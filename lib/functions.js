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
const deepMerge = (oldObj, newObj) => {
    var _a;
    if (typeof oldObj !== "object" || typeof newObj !== "object") {
        return oldObj;
    }
    for (const key in newObj) {
        if (newObj[key] !== null && typeof newObj[key] === "object") {
            oldObj[key] = (0, exports.deepMerge)((_a = oldObj[key]) !== null && _a !== void 0 ? _a : {}, newObj[key]);
        }
        else {
            oldObj[key] = newObj[key];
        }
    }
    return oldObj;
};
exports.deepMerge = deepMerge;
function deepSet(src, path, replacement) {
    if (!path) {
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
}
exports.deepSet = deepSet;
const createStore = (params) => {
    const observable = new Observable_1.Observable(params.initialState);
    return {
        state: () => observable.current(),
        mutations: params.mutations({
            state: () => observable.current(),
            merge(newState) {
                observable.update((0, exports.deepMerge)(observable.current(), newState));
            },
            set(props) {
                observable.update(deepSet(observable.current(), props.path, props.value));
            },
            reset() {
                observable.update(params.initialState);
            },
        }),
        onChange: (effectCallback) => observable.watch(effectCallback),
    };
};
exports.createStore = createStore;
const createStoreHook = (params) => {
    const store = (0, exports.createStore)(params);
    return (selector) => (0, useStore_1.useStore)(store, selector);
};
exports.createStoreHook = createStoreHook;
