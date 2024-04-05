import { Observable } from "./classes/Observable";
import { useStore } from "./hooks/useStore";
import { createStoreProps, createStoreReturn, createStoreHookReturn, createStoreHookProps } from "./types";

export const isFunction = (value: any): value is Function => typeof value === "function";

export const isObject = (value: any): value is object => typeof value === "object";

export const isString = (value: any): value is string => typeof value === "string";

export const isJSON = (obj: any) => {
  try {
    JSON.parse(obj);
    return true;
  } catch (e) {
    return false;
  }
};

export const deepMerge = (oldObj: any, newObj: any) => {
  if (typeof oldObj !== "object" || typeof newObj !== "object") {
    return oldObj;
  }

  for (const key in newObj) {
    if (newObj[key] !== null && typeof newObj[key] === "object") {
      oldObj[key] = deepMerge(oldObj[key] ?? {}, newObj[key]);
    } else {
      oldObj[key] = newObj[key];
    }
  }
  return oldObj;
};

export const createStore = <StateType>(params: createStoreProps<StateType>): createStoreReturn<StateType> => {
  const observable = new Observable<StateType>(params.initialState);
  return {
    state: () => observable.current(),
    mutations: params.mutations({
      state: () => observable.current(),
      merge(newState) {
        observable.update(deepMerge(observable.current(), newState));
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

export const createStoreHook = <StateType, SelectionType = StateType>(params: createStoreHookProps<StateType>): createStoreHookReturn<StateType, SelectionType> => {
  const store = createStore(params);
  return (selector) => useStore(store, selector);
};