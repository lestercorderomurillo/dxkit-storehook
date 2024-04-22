"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepSet = exports.deepMerge = exports.isJSON = exports.isString = exports.isObject = exports.isFunction = void 0;
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
 * @param {DeepMerge} options - The options for the merge operation.
 * @returns {any} The merged object.
 */
const deepMerge = ({ sourceObject: src, targetObject: dest }) => {
    if (typeof src !== "object" || typeof dest !== "object") {
        return src;
    }
    for (const key in dest) {
        if (Object.prototype.hasOwnProperty.call(dest, key)) {
            if (dest[key] !== null && typeof dest[key] === "object") {
                src[key] = (0, exports.deepMerge)({ sourceObject: src[key] ?? {}, targetObject: dest[key] });
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
 * @param {DeepSet} options - The options for the set operation.
 * @returns {any} The modified object.
 */
const deepSet = ({ propertyPath: path, sourceObject: src, value }) => {
    if (!path || path == "" || path == null) {
        return value;
    }
    const keys = path.split(".");
    let current = src;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current || typeof current !== "object" || Array.isArray(current)) {
            return src;
        }
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    }
    const lastKey = keys[keys.length - 1];
    if (!current || typeof current !== "object" || Array.isArray(current)) {
        return src;
    }
    current[lastKey] = value;
    return src;
};
exports.deepSet = deepSet;
