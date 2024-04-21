import { DeepMergeOptions, DeepSetOptions } from "./types";

/**
 * Checks if the given value is a function.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a function, otherwise false.
 */
export const isFunction = (value: any): value is Function => typeof value === "function";

/**
 * Checks if the given value is an object.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is an object, otherwise false.
 */
export const isObject = (value: any): value is object => typeof value === "object";

/**
 * Checks if the given value is a string.
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is a string, otherwise false.
 */
export const isString = (value: any): value is string => typeof value === "string";

/**
 * Checks if the given object is valid JSON.
 * @param {any} value The object to check.
 * @returns {boolean} True if the object is valid JSON, otherwise false.
 */
export const isJSON = (value: any): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};
/**
 * Merges two objects deeply.
 * @param {DeepMergeOptions} options - The options for the merge operation.
 * @returns {any} The merged object.
 */
export const deepMerge = ({sourceObject: src, targetObject: dest}: DeepMergeOptions): any => {
  if (typeof src !== "object" || typeof dest !== "object") {
    return src;
  }

  for (const key in dest) {
    if (Object.prototype.hasOwnProperty.call(dest, key)) {
      if (dest[key] !== null && typeof dest[key] === "object") {
        src[key] = deepMerge({sourceObject: src[key] ?? {}, targetObject: dest[key]});
      } else {
        src[key] = dest[key];
      }
    }
  }
  return src;
};

/**
 * Sets a deeply nested property in an object.
 * @param {object} src The source object.
 * @param {any} value The value to set.
 * @returns {any} The modified object.
 */
export const deepSet = ({propertyPath: path, sourceObject: src, value}: DeepSetOptions): any => {
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
}