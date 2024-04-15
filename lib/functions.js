"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreHook = exports.createStore = exports.deepSet = exports.deepMerge = exports.isJSON = exports.isString = exports.isObject = exports.isFunction = void 0;
const Observable_1 = require("./classes/Observable");
const useStore_1 = require("./hooks/useStore");
/**
 * Checks if the given value is a function.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a function, otherwise false.
 */
const isFunction = (value) => typeof value === "function";
exports.isFunction = isFunction;
/**
 * Checks if the given value is an object.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is an object, otherwise false.
 */
const isObject = (value) => typeof value === "object";
exports.isObject = isObject;
/**
 * Checks if the given value is a string.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a string, otherwise false.
 */
const isString = (value) => typeof value === "string";
exports.isString = isString;
/**
 * Checks if the given object is valid JSON.
 * @param {any} value The object to check.
 * @returns {boolean} True if the object is valid JSON, otherwise false.
 */
const isJSON = (value) => {
    try {
        JSON.parse(value);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.isJSON = isJSON;
/**
 * Merges two objects deeply.
 * @param {DeepMergeOptions} options - The options for the merge operation.
 * @returns {any} The merged object.
 */
const deepMerge = ({ src, dest }) => {
    var _a;
    if (typeof src !== "object" || typeof dest !== "object") {
        return src;
    }
    for (const key in dest) {
        if (Object.prototype.hasOwnProperty.call(dest, key)) {
            if (dest[key] !== null && typeof dest[key] === "object") {
                src[key] = (0, exports.deepMerge)({ src: (_a = src[key]) !== null && _a !== void 0 ? _a : {}, dest: dest[key] });
            }
            else {
                src[key] = dest[key];
            }
        }
    }
    return src;
};
exports.deepMerge = deepMerge;
/**
 * Sets a deeply nested property in an object.
 * @param {object} src The source object.
 * @param {any} value The value to set.
 * @returns {any} The modified object.
 */
const deepSet = ({ path, src, value }) => {
    if (!path || path == '' || path == null) {
        return value;
    }
    const keys = path.split('.');
    let current = src;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current || typeof current !== 'object' || Array.isArray(current)) {
            return src;
        }
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    }
    const lastKey = keys[keys.length - 1];
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
        return src;
    }
    current[lastKey] = value;
    return src;
};
exports.deepSet = deepSet;
/**
 * Creates a new store instance with the specified initial state.
 * @template StateType - The type of the state managed by the store.
 * @param {createStoreProps<StateType>} storeConfig Configuration object for creating the store.
 * @returns {createStoreReturn<StateType>} An object containing the store instance.
 */
const createStore = (storeConfig) => {
    const value = new Observable_1.Observable(storeConfig.initialState);
    const snapshot = new Observable_1.Observable();
    const optimisticValues = new Observable_1.Observable({});
    const mutation = new Observable_1.Observable();
    const dispatch = async (fn) => {
        var _a, _b;
        if (snapshot.current() == undefined) {
            snapshot.update(value.current());
        }
        const subscription = subscriptions[mutation.current().name];
        await fn();
        if (subscription) {
            await ((_a = subscription.willCommit) === null || _a === void 0 ? void 0 : _a.call(subscription, mutation.current().payload));
        }
        optimisticValues.update({});
        if (subscription) {
            await ((_b = subscription.didCommit) === null || _b === void 0 ? void 0 : _b.call(subscription, mutation.current().payload));
        }
        mutation.update(undefined);
        snapshot.update(undefined);
    };
    const subscriptions = storeConfig.subscriptions ? storeConfig.subscriptions({
        current() {
            return value.current();
        },
        forward(key, value) {
            optimisticValues.update((0, exports.deepSet)({
                path: key,
                src: optimisticValues.current(),
                value: value
            }));
            mutations[mutation.current().name](mutation.current().payload);
        },
        rollback() {
            value.update(snapshot.current());
        },
    }) : undefined;
    const mutations = storeConfig.mutations({
        current() {
            return value.current();
        },
        merge(newState) {
            dispatch(() => {
                value.update((0, exports.deepMerge)({
                    src: value.current(),
                    dest: newState
                }));
            });
        },
        set(props) {
            dispatch(() => {
                value.update((0, exports.deepSet)({
                    path: props.path,
                    src: value.current(),
                    value: props.value,
                }));
            });
        },
        reset() {
            dispatch(() => {
                value.update(storeConfig.initialState);
            });
        },
        optimistic(key, value) {
            if (optimisticValues[key]) {
                return optimisticValues[key];
            }
            return value;
        },
    });
    const mutationsProxy = new Proxy(mutations, {
        get(object, functionName) {
            const origMethod = object[functionName];
            if (typeof origMethod === 'function') {
                return function (...args) {
                    mutation.update({
                        name: functionName,
                        payload: args[0]
                    });
                    return origMethod.apply(this, args);
                };
            }
            else {
                return origMethod;
            }
        }
    });
    return {
        current: () => value.current(),
        subscribe: (effectCallback) => value.watch(effectCallback),
        mutations: mutationsProxy
    };
};
exports.createStore = createStore;
/**
 * Generates a new store hook for accessing the declared store's state and mutations.
 * @template StateType The type of the state managed by the store.
 * @template SelectionType Optional selector type, useful to represent the type of the selected subpart of the state.
 * @param {createStoreHookProps<StateType>} storeConfig The configuration object used to create the store hook.
 * @returns {createStoreHookReturn<StateType, SelectionType>} The generated React hook.
 */
const createStoreHook = (storeConfig) => {
    const store = (0, exports.createStore)(storeConfig);
    return (selector) => (0, useStore_1.useStore)(store, selector);
};
exports.createStoreHook = createStoreHook;
