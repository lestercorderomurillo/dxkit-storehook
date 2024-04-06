import { Observable } from "./classes/Observable";
import { useStore } from "./hooks/useStore";
import { createStoreProps, createStoreReturn, createStoreHookReturn, createStoreHookProps, SubscriptionsSchema, Subscriptions } from "./types";

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

export const deepSet = (src: any, path?: string, replacement?: any): any => {
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
  const value = new Observable<StateType>(params.initialState);
  const subscriptionsSchema = params.subscriptions({
    current: () => value.current()
  });
  const subscriptions = new Observable<Subscriptions>({
    onRead: subscriptionsSchema.onRead ?? [],
    onUpdate: subscriptionsSchema.onUpdate ?? [],
    willUpdate: subscriptionsSchema.willUpdate ?? [],
  });
  const dispatch = (callback: Function) => {
    subscriptions.current().willUpdate.forEach(callbackFn => callbackFn(value.current()));
    callback();
    subscriptions.current().onUpdate.forEach(callbackFn => callbackFn(value.current()));
  }
  return {
    current: () => value.current(),
    subscribe: (effectCallback) => value.watch(effectCallback),
    mutations: params.mutations({
      current(){
        subscriptions.current().onRead.forEach(callbackFn => callbackFn(value.current()));
        return value.current();
      },
      merge(newState) {
        dispatch(() => value.update(deepMerge(value.current(), newState)));
      },
      set(props) {;
        dispatch(() => value.update(deepSet(value.current(), props.path, props.value)));
      },
      reset() {
        dispatch(() => value.update(params.initialState));
      },
    })
  };
};

export const createStoreHook = <StateType, SelectionType = StateType>(params: createStoreHookProps<StateType>): createStoreHookReturn<StateType, SelectionType> => {
  const store = createStore(params);
  return (selector) => useStore(store, selector);
};