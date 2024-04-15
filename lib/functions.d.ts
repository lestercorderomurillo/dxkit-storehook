import { createStoreProps, createStoreReturn, createStoreHookReturn, createStoreHookProps, DeepMergeOptions, DeepSetOptions } from "./types";
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
 * @param {DeepMergeOptions} options - The options for the merge operation.
 * @returns {any} The merged object.
 */
export declare const deepMerge: ({ src, dest }: DeepMergeOptions) => any;
/**
 * Sets a deeply nested property in an object.
 * @param {object} src The source object.
 * @param {any} value The value to set.
 * @returns {any} The modified object.
 */
export declare const deepSet: ({ path, src, value }: DeepSetOptions) => any;
/**
 * Creates a new store instance with the specified initial state.
 * @template StateType - The type of the state managed by the store.
 * @param {createStoreProps<StateType>} storeConfig Configuration object for creating the store.
 * @returns {createStoreReturn<StateType>} An object containing the store instance.
 */
export declare const createStore: <StateType = any>(storeConfig: createStoreProps<StateType>) => createStoreReturn<StateType>;
/**
 * Generates a new store hook for accessing the declared store's state and mutations.
 * @template StateType The type of the state managed by the store.
 * @template SelectionType Optional selector type, useful to represent the type of the selected subpart of the state.
 * @param {createStoreHookProps<StateType>} storeConfig The configuration object used to create the store hook.
 * @returns {createStoreHookReturn<StateType, SelectionType>} The generated React hook.
 */
export declare const createStoreHook: <StateType, SelectionType = StateType>(storeConfig: createStoreHookProps<StateType>) => createStoreHookReturn<StateType, SelectionType>;
