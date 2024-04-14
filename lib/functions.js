"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreHook = exports.createStore = exports.deepSet = exports.deepMerge = exports.isDeepSetStateSchema = exports.isJSON = exports.isString = exports.isObject = exports.isFunction = void 0;
const Observable_1 = require("./classes/Observable");
const useStore_1 = require("./hooks/useStore");
const isFunction = (value) => typeof value === "function";
exports.isFunction = isFunction;
const isObject = (value) => typeof value === "object";
exports.isObject = isObject;
const isString = (value) => typeof value === "string";
exports.isString = isString;
const isJSON = (obj) => {
    try {
        JSON.parse(obj);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.isJSON = isJSON;
const isDeepSetStateSchema = (newState) => {
    return (0, exports.isJSON)(newState) && (0, exports.isString)(newState.path) && 'value' in newState && Object.keys(newState).length == 2;
};
exports.isDeepSetStateSchema = isDeepSetStateSchema;
const deepMerge = ({ oldObj, newObj }) => {
    var _a;
    if (typeof oldObj !== "object" || typeof newObj !== "object") {
        return oldObj;
    }
    for (const key in newObj) {
        if (newObj[key] !== null && typeof newObj[key] === "object") {
            oldObj[key] = (0, exports.deepMerge)({ oldObj: (_a = oldObj[key]) !== null && _a !== void 0 ? _a : {}, newObj: newObj[key] });
        }
        else {
            oldObj[key] = newObj[key];
        }
    }
    return oldObj;
};
exports.deepMerge = deepMerge;
const deepSet = ({ src, path, replacement }) => {
    if (!path || path == '' || path == null) {
        return replacement;
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
    current[lastKey] = replacement;
    return src;
};
exports.deepSet = deepSet;
const createStore = (params) => {
    const value = new Observable_1.Observable(params.initialState);
    const snapshot = new Observable_1.Observable();
    const optimisticValues = new Observable_1.Observable({});
    const mutation = new Observable_1.Observable();
    const dispatch = async (fn) => {
        if (snapshot.current() == undefined) {
            snapshot.update(value.current());
        }
        await fn();
        await subscriptions[mutation.current().name].willCommit(mutation.current().payload);
        optimisticValues.update({});
        await subscriptions[mutation.current().name].didCommit(mutation.current().payload);
        mutation.update(undefined);
        snapshot.update(undefined);
    };
    const subscriptions = params.subscriptions({
        current() {
            return value.current();
        },
        forward(key, value) {
            optimisticValues.update((0, exports.deepSet)({
                path: key,
                src: optimisticValues.current(),
                replacement: value
            }));
            mutations[mutation.current().name](mutation.current().payload);
        },
        rollback() {
            value.update(snapshot.current());
        },
    });
    const mutations = params.mutations({
        current() {
            return value.current();
        },
        merge(newState) {
            dispatch(() => {
                value.update((0, exports.deepMerge)({
                    oldObj: value.current(),
                    newObj: newState
                }));
            });
        },
        set(props) {
            dispatch(() => {
                value.update((0, exports.deepSet)({
                    path: props.path,
                    src: value.current(),
                    replacement: props.value,
                }));
            });
        },
        reset() {
            dispatch(() => {
                value.update(params.initialState);
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
const createStoreHook = (params) => {
    const store = (0, exports.createStore)(params);
    return (selector) => (0, useStore_1.useStore)(store, selector);
};
exports.createStoreHook = createStoreHook;
