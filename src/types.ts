export type Store<StateType = any> = {
    state: () => StateType | undefined;
    onChange: (callback: Function) => any;
    mutations: MutationsSchema;
};
  
export type MutationsSchema = {
  [actionName: string]: Function;
};

export type createStoreProps<StateType = any> = {
  initialState: StateType | undefined;
  mutations?: (operations: {
    state: () => StateType;
    reset: () => void;
    set: (state: StateType) => void;
    merge: (state: StateType) => void;
  }) => MutationsSchema;
};

export type createStoreReturn<StateType> = Store<StateType>;

export type useStoreReturn<StateType = any, SelectionType = StateType> = [StateType | SelectionType, { [functionName: string]: Function }];

export type createStoreHookReturn<StateType, SelectionType> = (selector?: SelectorFunction) => useStoreReturn<StateType, SelectionType>;

export type createStoreHookProps<StateType = any> = createStoreProps<StateType>;

export type SelectorFunction<StateType = any, SelectedType = any> = (state: StateType) => SelectedType;
