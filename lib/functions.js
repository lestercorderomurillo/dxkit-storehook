"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreHook = exports.createStore = void 0;
const Observable_1 = require("./classes/Observable");
const useStore_1 = require("./hooks/useStore");
const utils_1 = require("./utils");
/**
 * Creates a proxy handler for intercepting mutation calls and updating a mutation object.
 * @param {Object} params An object containing mutations and a mutation object.
 * @param {MutationsSchema} params.mutations The object containing mutation functions.
 * @param {Ref<Action>} params.mutation The reference to the current mutation being executed.
 * @returns {Proxy} A Proxy object that intercepts mutation calls and updates the mutation object.
 */
const createMutationHandler = ({ mutations, mutation }) => new Proxy(mutations, {
    get(object, functionName) {
        const origMethod = object[functionName];
        if (typeof origMethod === "function") {
            return function (...args) {
                mutation.update({
                    name: functionName,
                    payload: args[0],
                });
                return origMethod.apply(this, args);
            };
        }
        else {
            return origMethod;
        }
    },
});
/**
 * Executes a transaction function, updating state and handling subscriptions before and after the mutation.
 * @param {Function} fn The transaction function to execute.
 * @param {Object} params An object containing references to snapshot, value, mutation, subscriptions, and forwarded objects.
 * @param {Ref<Store>} params.snapshot The reference to the snapshot object representing the current state.
 * @param {Ref<Store>} params.value The reference to the value object representing the initial state.
 * @param {Ref<Action>} params.mutation The reference to the current mutation being executed.
 * @param {SubscriptionsSchema} params.subscriptions The object containing subscription functions.
 * @param {Ref<{}>} params.forwarded The reference to the forwarded object representing forwarded mutations.
 * @returns {Promise<void>} A promise that resolves once the transaction is completed.
 */
const transaction = async (fn, { snapshot, value, mutation, subscriptions, forwarded }) => {
    if (snapshot.current() == undefined) {
        snapshot.update(value.current());
    }
    const subscription = subscriptions[mutation.current().name];
    await fn();
    if (subscription) {
        await subscription.willCommit?.(mutation.current().payload);
    }
    forwarded.update({});
    if (subscription) {
        await subscription.didCommit?.(mutation.current().payload);
    }
    mutation.update(undefined);
    snapshot.update(undefined);
};
/**
 * Creates a store based on the provided schema.
 * @template TState The type of the state managed by the store.
 * @template TMutations The type of mutations that can be dispatched to the store.
 * @template TSubscriptions The type of subscriptions that can be attached to mutations.
 * @param {StoreSchema<TState, TMutations, TSubscriptions>} schema The schema defining the structure of the store.
 * @returns {Store<TState, TMutations>} A store object with specified state, mutations, and subscriptions.
 */
const createStore = (schema) => {
    const value = new Observable_1.Observable(schema.initialState);
    const snapshot = new Observable_1.Observable();
    const mutation = new Observable_1.Observable();
    const forwarded = new Observable_1.Observable({});
    const subscriptions = schema.subscriptions
        ? schema.subscriptions({
            get() {
                return value.current();
            },
            forward(key, value) {
                forwarded.update((0, utils_1.deepSet)({
                    propertyPath: key,
                    sourceObject: forwarded.current(),
                    value: value,
                }));
                mutations[mutation.current().name](mutation.current().payload);
            },
            rollback() {
                value.update(snapshot.current());
            },
        })
        : undefined;
    const mutations = schema.mutations
        ? schema.mutations({
            get() {
                return value.current();
            },
            set(props) {
                transaction(() => {
                    value.update((0, utils_1.deepSet)({
                        propertyPath: props.path,
                        sourceObject: value.current(),
                        value: props.value,
                    }));
                }, { snapshot, forwarded, mutation, subscriptions, value });
            },
            merge(newState) {
                transaction(() => {
                    value.update((0, utils_1.deepMerge)({
                        sourceObject: value.current(),
                        targetObject: newState,
                    }));
                }, { snapshot, forwarded, mutation, subscriptions, value });
            },
            optimistic(key, value) {
                if (forwarded[key]) {
                    return forwarded[key];
                }
                return value;
            },
            reset() {
                transaction(() => {
                    value.update(schema.initialState);
                }, { snapshot, forwarded, mutation, subscriptions, value });
            },
        })
        : {};
    return {
        current: () => value.current(),
        subscribe: (cb) => value.watch(cb),
        mutations: createMutationHandler({ mutations, mutation }),
    };
};
exports.createStore = createStore;
/**
 * Generates a hook for interacting with a store based on the provided initial state schema.
 * @template TState The type of the state managed by the store.
 * @template TMutations The type of mutations that can be dispatched to the store.
 * @template TSubscriptions The type of subscriptions that can be attached to mutations.
 * @param {StoreSchema<TState, TMutations, TSubscriptions>} schema The schema defining the initial state of the store.
 */
const createStoreHook = (schema) => {
    const store = (0, exports.createStore)(schema);
    return (selector) => (0, useStore_1.useStore)(store, selector);
};
exports.createStoreHook = createStoreHook;
