import { Observable } from "./classes/Observable";
import { useStore } from "./hooks/useStore";
import { createStoreProps, createStoreReturn, createStoreHookReturn, createStoreHookProps, SubscriptionsTypes } from "./types";

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

export const deepMerge = ({oldObj, newObj}: {oldObj: any, newObj: any}) => {
  if (typeof oldObj !== "object" || typeof newObj !== "object") {
    return oldObj;
  }

  for (const key in newObj) {
    if (newObj[key] !== null && typeof newObj[key] === "object") {
      oldObj[key] = deepMerge({oldObj: oldObj[key] ?? {}, newObj: newObj[key]});
    } else {
      oldObj[key] = newObj[key];
    }
  }
  return oldObj;
};

export const deepSet = ({src, path, replacement}): any => {
  if (!path || path == '' || path == null) {
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
  const snapshot = new Observable<StateType>();
  const optimisticValues = new Observable<any>({});
  const mutation = new Observable<{name: string; payload: any;}>();
  const dispatch = async (fn: Function) => {
    if(snapshot.current() == undefined){
      snapshot.update(value.current());
    }
    await fn();
    await subscriptions[mutation.current().name].willCommit(mutation.current().payload);
    optimisticValues.update({});
    await subscriptions[mutation.current().name].didCommit(mutation.current().payload);
    mutation.update(undefined);
    snapshot.update(undefined);
  };
  const subscriptions = params.subscriptions({
    current() {
      return value.current();
    },
    forward(key, value) {
      optimisticValues.update(deepSet({
        path: key,
        src: optimisticValues.current(),
        replacement: value
      }));
      mutations[mutation.current().name](mutation.current().payload);
    },
    undo() {
      value.update(snapshot.current());
    },
  });
  const mutations = params.mutations({
    current(){
      return value.current();
    },
    merge(newState) {
      dispatch(() => {
        value.update(deepMerge({
          oldObj: value.current(),
          newObj: newState
        }));
      });
    },
    set(props) {
      dispatch(() => {
        value.update(deepSet({
          path: props.path,
          src: value.current(),
          replacement: props.value,
        }));
      });
    },
    reset() {
      dispatch(() => {
        value.update(params.initialState);
      });
    },
    optimistic(key, value) {
      if(optimisticValues[key]){
        return optimisticValues[key];
      }
      return value;
    },
  });

  const mutationsProxy = new Proxy(mutations, {
    get(object: any, functionName: string) {
      const origMethod = object[functionName];
      if (typeof origMethod === 'function') {
        return function (...args) {
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

export const createStoreHook = <StateType, SelectionType = StateType>(params: createStoreHookProps<StateType>): createStoreHookReturn<StateType, SelectionType> => {
  const store = createStore(params);
  return (selector) => useStore(store, selector);
};
