import { Observable } from "./classes/Observable";
import { useStore } from "./hooks/useStore";
import { createStoreProps, createStoreReturn, createStoreHookReturn, createStoreHookProps, SubscriptionsTypes, DeepMergeOptions, DeepSetOptions, MutationDispatch } from "./types";

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
export const deepMerge = ({src, dest}: DeepMergeOptions): any => {
  if (typeof src !== "object" || typeof dest !== "object") {
    return src;
  }

  for (const key in dest) {
    if (Object.prototype.hasOwnProperty.call(dest, key)) {
      if (dest[key] !== null && typeof dest[key] === "object") {
        src[key] = deepMerge({src: src[key] ?? {}, dest: dest[key]});
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
export const deepSet = ({path, src, value}: DeepSetOptions): any => {
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

/**
 * Creates a new store instance with the specified initial state.
 * @template StateType - The type of the state managed by the store.
 * @param {createStoreProps<StateType>} storeConfig Configuration object for creating the store.
 * @returns {createStoreReturn<StateType>} An object containing the store instance.
 */
export const createStore = <StateType = any>(storeConfig: createStoreProps<StateType>): createStoreReturn<StateType> => {
  const value = new Observable<StateType>(storeConfig.initialState);
  const snapshot = new Observable<StateType>();
  const optimisticValues = new Observable<any>({});
  const mutation = new Observable<MutationDispatch>();

  const dispatch = async (fn: Function) => {
    if(snapshot.current() == undefined){
      snapshot.update(value.current());
    }
    const subscription = subscriptions[mutation.current().name];

    await fn();

    if(subscription){
      await subscription.willCommit?.(mutation.current().payload);
    }

    optimisticValues.update({});

    if(subscription){
      await subscription.didCommit?.(mutation.current().payload);
    }

    mutation.update(undefined);
    snapshot.update(undefined);
  };

  const subscriptions = storeConfig.subscriptions ? storeConfig.subscriptions({
    current() {
      return value.current();
    },
    forward(key, value) {
      optimisticValues.update(deepSet({
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

  const mutations = storeConfig.mutations ? storeConfig.mutations({
    current(){
      return value.current();
    },
    merge(newState) {
      dispatch(() => {
          value.update(deepMerge({
            src: value.current(),
            dest: newState
          }));
      });
    },
    set(props) {
      dispatch(() => {
        value.update(deepSet({
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
      if(optimisticValues[key]){
        return optimisticValues[key];
      }
      return value;
    },
  }) : {};

  const mutationsProxy = new Proxy(mutations, {
    get(object: any, functionName: string) {
      const origMethod = object[functionName];
      if (typeof origMethod === 'function') {
        return function (...args: any[]) {
          mutation.update({
            name: functionName,
            payload: args[0]
          });
          return origMethod.apply(this, args);
        };
      } else {
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

/**
 * Generates a new store hook for accessing the declared store's state and mutations.
 * @template StateType The type of the state managed by the store.
 * @template SelectionType Optional selector type, useful to represent the type of the selected subpart of the state.
 * @param {createStoreHookProps<StateType>} storeConfig The configuration object used to create the store hook.
 * @returns {createStoreHookReturn<StateType, SelectionType>} The generated React hook.
 */
export const createStoreHook = <StateType, SelectionType = StateType>(
  storeConfig: createStoreHookProps<StateType>
): createStoreHookReturn<StateType, SelectionType> => {
  const store = createStore(storeConfig);
  return (selector) => useStore(store, selector);
};