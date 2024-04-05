export type Store<StateType = any> = {
    state: () => StateType | undefined;
    mutations: MutationsManifestObject;
    onChange: (callback: Function) => any;
  };
  
  export type MutationsManifestObject = {
    [actionName: string]: any;
  };
  
  export type StoreManifest<StateType = any> = {
    initialState: StateType | undefined;
    includeMutations?: "object" | "array";
    mutations?: (operations: {
      state: () => StateType;
      reset: () => void;
      set: (state: StateType) => void;
      merge: (state: StateType) => void;
    }) => MutationsManifestObject;
  };
  
  export type SelectorFunction<StateType = any, ResultType = any> = (state: StateType) => ResultType;
  