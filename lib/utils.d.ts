import { DeepMerge, DeepSet } from "./types";
/**
 * Checks if the given value is a function.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a function, otherwise false.
 */
export declare const isFunction: (value: any) => value is Function;
/**
 * Checks if the given value is an object.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is an object, otherwise false.
 */
export declare const isObject: (value: any) => value is object;
/**
 * Checks if the given value is a string.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a string, otherwise false.
 */
export declare const isString: (value: any) => value is string;
/**
 * Checks if the given object is valid JSON.
 * @param {any} value The object to check.
 * @returns {boolean} True if the object is valid JSON, otherwise false.
 */
export declare const isJSON: (value: any) => boolean;
/**
 * Merges two objects deeply.
 * @param {DeepMerge} options - The options for the merge operation.
 * @returns {any} The merged object.
 */
export declare const deepMerge: ({ sourceObject: src, targetObject: dest }: DeepMerge) => any;
/**
 * Sets a deeply nested property in an object.
 * @param {DeepSet} options - The options for the set operation.
 * @returns {any} The modified object.
 */
export declare const deepSet: ({ propertyPath: path, sourceObject: src, value }: DeepSet) => any;
