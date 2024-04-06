export type Store<StateType = any> = {
    current: () => StateType | undefined;
    subscribe: (callback: (state: StateType) => any) => any;
    mutations: MutationsSchema;
};
export type MutationsSchema = {
    [actionName: string]: Function;
};
export type SubscriptionsSchema = {
    onRead?: Function[];
    onUpdate?: Function[];
    willUpdate?: Function[];
};
export type Subscriptions = {
    onRead: any[];
    onUpdate: any[];
    willUpdate: any[];
};
export type StoreSetMutationProps = {
    path?: string;
    value: any;
};
export type MutationOperations<StateType> = {
    current: () => StateType;
    reset: () => void;
    set: (setParams: StoreSetMutationProps) => void;
    merge: (state: Partial<StateType>) => void;
};
export type SubscriptionsOperations<StateType> = {
    current: () => StateType;
};
export type createStoreProps<StateType = any> = {
    initialState: StateType | undefined;
    mutations?: (operations: MutationOperations<StateType>) => MutationsSchema;
    subscriptions?: (operations: SubscriptionsOperations<StateType>) => SubscriptionsSchema;
};
export type createStoreReturn<StateType> = Store<StateType>;
export type useStoreReturn<StateType = any, SelectionType = StateType> = [StateType | SelectionType, {
    [functionName: string]: Function;
}];
export type createStoreHookReturn<StateType, SelectionType> = (selector?: SelectorFunction) => useStoreReturn<StateType, SelectionType>;
export type createStoreHookProps<StateType = any> = createStoreProps<StateType>;
export type SelectorFunction<StateType = any, SelectedType = any> = (state: StateType) => SelectedType;
