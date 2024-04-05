"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoreHook = exports.createStore = exports.deepMerge = exports.isJSON = exports.isString = exports.isObject = exports.isFunction = void 0;
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
const createStore = (params) => {
    const observable = new Observable_1.Observable(params.initialState);
    return {
        state: () => observable.current(),
        mutations: params.mutations({
            state: () => observable.current(),
            merge(newState) {
                observable.update((0, exports.deepMerge)(observable.current(), newState));
            },
            reset() {
                observable.update(params.initialState);
            },
            set(newState) {
                observable.update(newState);
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
