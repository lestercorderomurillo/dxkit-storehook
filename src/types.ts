export type UnSubscribeFunction = any;

export type Store<StateType = any> = {
    current: () => StateType | undefined;
    subscribe: (callback: (state: StateType) => any) => UnSubscribeFunction;
    mutations: Mutations;
};

export type Subscriptions = {
  [key in string]: {
    willCommit: <MutationType = any>(mutation: MutationType) => void;
    didCommit: <MutationType = any>(mutated: MutationType) => void;
  };
};
  
export type Mutations = {
  [actionName: string]: Function;
};

export type StoreSetMutationProps = {path?: string, value: any};

export type MutationOperations<StateType> = {
  current: () => StateType;
  reset: () => void;
  set: (setParams: StoreSetMutationProps) => void;
  merge: (state: Partial<StateType>) => void;
  optimistic: (key: string, value: any) => any;
}

export type SubscriptionsOperations<StateType> = {
  current: () => StateType;
}

export type createStoreProps<StateType = any> = {
  initialState: StateType | undefined;
  mutations?: (operations: MutationOperations<StateType>) => Mutations;
  subscriptions?: (operations: SubscriptionsOperations<StateType>) => Subscriptions;
};

export type createStoreReturn<StateType> = Store<StateType>;

export type useStoreReturn<StateType = any, SelectionType = StateType> = [StateType | SelectionType, { [functionName: string]: Function }];

export type createStoreHookReturn<StateType, SelectionType> = (selector?: SelectorFunction) => useStoreReturn<StateType, SelectionType>;

export type createStoreHookProps<StateType = any> = createStoreProps<StateType>;

export type SelectorFunction<StateType = any, SelectedType = any> = (state: StateType) => SelectedType;
