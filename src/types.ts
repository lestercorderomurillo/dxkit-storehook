/**
 * Represents a function that can be called to unsubscribe from a subscription.
 */
export type UnSubscribeFunction = any;

/**
 * Represents a store that holds the application state.
 * @template StateType The type of the state managed by the store.
 */
export type Store<StateType = any> = {
    /**
     * Retrieves the current state of the store.
     * @returns {StateType | undefined} The current state of the store.
     */
    current: () => StateType | undefined;
    /**
     * Subscribes to changes in the store's state.
     * @param {Function} callback A function to be called when the state changes.
     * @returns {UnSubscribeFunction} A function to unsubscribe from the subscription.
     */
    subscribe: (callback: (state: StateType) => any) => UnSubscribeFunction;
    /**
     * Defines the mutations that can be applied to the store's state.
     */
    mutations: Mutations;
};

/**
 * Represents a mapping of mutation names to mutation functions.
 */
export type Mutations = {
    [mutationName: string]: (payload?: any) => any;
};

/**
 * Represents the types of subscriptions for a store.
 */
export type Subscriptions<StateType> = {
    [subscriptionName in keyof Store<StateType>['mutations']]?: SubscriptionsTypes;
};

/**
 * Represents the types of subscriptions.
 */
export type SubscriptionsTypes = {
    willCommit?: (mutation: any) => Promise<any> | void;
    didCommit?: (mutation: any) => Promise<any> | void;
};

/**
 * Represents the properties used to set the store's state.
 */
export type StoreSetMutationProps = {
    path?: string;
    value: any;
};

/**
 * Represents the operations that can be performed on the store's state.
 * @template StateType The type of the state managed by the store.
 */
export type MutationOperations<StateType> = {
    /**
     * Retrieves the current state of the store.
     * @returns {StateType} The current state of the store.
     */
    current: () => StateType;
    /**
     * Resets the store's state to its initial value.
     */
    reset: () => void;
    /**
     * Sets the store's state to the specified value.
     * @param {StoreSetMutationProps} setParams The parameters used to set the state.
     */
    set: (setParams: StoreSetMutationProps) => void;
    /**
     * Merges the specified partial state into the store's state.
     * @param {Partial<StateType>} state The partial state to merge.
     */
    merge: (state: Partial<StateType>) => void;
    /**
     * Sets an optimistic value for a given key. When you call forward, this update will be computed again with the real value.
     * @param {string} key The key for which to remember this field.
     * @param {any} value The optimistic value to pass before the real value is forwarded.
     * @returns {any} The optimistic value, or the real value if its already forwarded.
     */
    optimistic: (key: string, value: any) => any;
};

/**
 * Represents the operations that can be performed on store subscriptions.
 * @template StateType The type of the state managed by the store.
 */
export type SubscriptionsOperations<StateType> = {
    /**
     * Retrieves the current state of the store.
     * @returns {StateType} The current state of the store.
     */
    current: () => StateType;
    /**
     * Forwards the real value with the specified key to replace the previous optimistic value.
     * @param {string} key The key to which to forward the value.
     * @param {ForwardedType} value The real value to forward.
     */
    forward: <ForwardedType = any>(key: string, value: ForwardedType) => void;
    /**
     * Rollback the mutation. The state will be set back to before it was executed.
     */
    rollback: () => void;
};

/**
 * Represents the properties used to create a store.
 * @template StateType The type of the state managed by the store.
 */
export type createStoreProps<StateType = any> = {
    /**
     * The initial state of the store.
     */
    initialState: StateType | undefined;
    /**
     * A function that defines the mutations that can be applied to the store's state.
     */
    mutations?: (operations: MutationOperations<StateType>) => Mutations;
    /**
     * A function that defines the subscriptions for the store.
     */
    subscriptions?: (operations: SubscriptionsOperations<StateType>) => Subscriptions<StateType>;
};

/**
 * Represents the return type of the createStore function.
 * @template StateType The type of the state managed by the store.
 */
export type createStoreReturn<StateType> = Store<StateType>;

/**
 * Represents the return type of the useStore function.
 * @template StateType The type of the state managed by the store.
 * @template SelectionType The type of the selected state.
 */
export type useStoreReturn<StateType = any, SelectionType = StateType> = [
    StateType | SelectionType,
    { [functionName: string]: Function }
];

/**
 * Represents the return type of the createStoreHook function.
 * @template StateType The type of the state managed by the store.
 * @template SelectionType The type of the selected state.
 */
export type createStoreHookReturn<StateType, SelectionType> = (
    selector?: SelectorFunction
) => useStoreReturn<StateType, SelectionType>;

/**
 * Represents the properties used to create a store hook.
 * @template StateType The type of the state managed by the store.
 */
export type createStoreHookProps<StateType = any> = createStoreProps<StateType>;

/**
 * Represents a function that selects a portion of the store's state.
 * @template StateType The type of the state managed by the store.
 * @template SelectedType The type of the selected state.
 */
export type SelectorFunction<StateType = any, SelectedType = any> = (
    state: StateType
) => SelectedType;

/**
 * Represents the parameters for a deep merge operation.
 * @property {object} any - The source object to merge from.
 * @property {object} any - The target object to merge into.
 */
export type DeepMergeOptions = {
  src: any;
  dest: any;
}

/**
 * Represents the parameters for a deep set operation.
 * @property {any} src - The source object to set from.
 * @property {string} path The path to the property.
 * @property {object} value - The value to set.
 */
export type DeepSetOptions = {
  src: any;
  path: string;
  value: any;
}

/**
 * Represents a mutation that has been dispatched.
 * @property {string} name - The name of the mutation.
 * @property {*} payload - The payload of the mutation (optional).
 */
export type MutationDispatch = {
  name: string;
  payload?: any;
};