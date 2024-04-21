import { Observable } from "./classes/Observable";
import { useStore } from "./hooks/useStore";
import { createStoreProps, createStoreReturn, createStoreHookReturn, createStoreHookProps, Action, DeepMergeOptions, DeepSetOptions, SelectorFunction } from "./types";
import { deepSet, deepMerge } from "./utils";

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
  const mutation = new Observable<Action>();

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
    get() {
      return value.current();
    },
    forward(key, value) {
      optimisticValues.update(deepSet({
        propertyPath: key,
        sourceObject: optimisticValues.current(),
        value: value
      }));
      mutations[mutation.current().name](mutation.current().payload);
    },
    rollback() {
      value.update(snapshot.current());
    },
  }) : undefined;

  const mutations = storeConfig.mutations ? storeConfig.mutations({
    get(){
      return value.current();
    },
    set(props) {
      dispatch(() => {
        value.update(deepSet({
          propertyPath: props.path as any,
          sourceObject: value.current(),
          value: props.value,
        }));
      });
    },
    merge(newState) {
      dispatch(() => {
          value.update(deepMerge({
            sourceObject: value.current(),
            targetObject: newState
          }));
      });
    },
    optimistic(key, value) {
      if(optimisticValues[key]){
        return optimisticValues[key];
      }
      return value;
    },
    reset() {
      dispatch(() => {
        value.update(storeConfig.initialState);
      });
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
) => {
  const store = createStore(storeConfig);
  return (selector?: SelectorFunction<StateType, SelectionType>) => useStore(store, selector);
};