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

export const isDeepSetStateSchema = (newState: any): newState is object => {
  return isJSON(newState) && isString(newState.path) && 'value' in newState && Object.keys(newState).length == 2;
}

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

export function deepSet(src: any, path?: string, replacement?: any): any {
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

export const createStore = <StateType>(params: createStoreProps<StateType>): createStoreReturn<StateType> => {
  const observable = new Observable<StateType>(params.initialState);
  return {
    state: () => observable.current(),
    mutations: params.mutations({
      state: () => observable.current(),
      merge(newState) {
        observable.update(deepMerge(observable.current(), newState));
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

export const createStoreHook = <StateType, SelectionType = StateType>(params: createStoreHookProps<StateType>): createStoreHookReturn<StateType, SelectionType> => {
  const store = createStore(params);
  return (selector) => useStore(store, selector);
};