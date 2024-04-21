import { createStoreHook } from "./functions";
import type {Paths} from 'type-fest';

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
    subscribe: (callback: (state: StateType) => any) => Function;
    /**
     * Contains the mutations that can be applied to the store's state.
     */
    mutations: Mutations;
};

/**
 * Represents a mapping of mutation names to mutation functions.
 * @template StateType The type of the state managed by the store.
 */
export type Mutations = {
    [mutationName: string]: (payload?: any) => void;
};


/**
 * Represents the return type of the useStore function.
 * @template StateType The type of the state managed by the store.
 * @template SelectionType The type of the selected state.
 */
export type useStoreReturn<StateType = any, SelectionType = StateType> = [
    StateType | SelectionType,
    {
        [K in keyof Mutations]: Function;
    }
];

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
     * A function that defines the subscriptions for the mutations defined.
     */
    subscriptions?: (operations: SubscriptionsOperations<StateType>) => Subscriptions<StateType>;
};

/**
 * Represents the return type of the createStore function.
 * @template StateType The type of the state managed by the store.
 */
export type createStoreReturn<StateType> = Store<StateType>;

/**
 * Represents the properties used to create a store hook.
 * @template StateType The type of the state managed by the store.
 */
export type createStoreHookProps<StateType = any> = createStoreProps<StateType>;

/**
* Represents the return type of the createStoreHook function.
* @template StateType The type of the state managed by the store.
* @template SelectionType The type of the selected state.
*/
export type createStoreHookReturn<StateType, SelectionType> = (
   selector?: SelectorFunction<StateType, SelectionType>
) => useStoreReturn<StateType, SelectionType>;

/**
 * Represents the operations that can be performed on the store's state.
 * @template StateType The type of the state managed by the store.
 */
export type MutationOperations<StateType> = {
    /**
     * Retrieves the current state of the store.
     * @returns {StateType} The current state of the store.
     */
    get: () => StateType;
    /**
     * Sets the store's state to the specified value.
     * @param {StoreSetMutationProps} setParams The parameters used to set the state.
     */
    set: (setParams: StoreSetMutationProps<StateType>) => void;
    /**
     * Merges the specified partial state into the store's state.
     * @param {Partial<StateType>} state The partial state to merge.
     */
    merge: (mergeParams: StoreMergeMutationProps<StateType>) => void;
    /**
     * Sets an optimistic value for a given key. When you call forward, this update will be computed again with the real value.
     * @param {string} key The key for which to remember this field.
     * @param {any} value The optimistic value to pass before the real value is forwarded.
     * @returns {any} The optimistic value, or the real value if its already forwarded.
     */
    optimistic: (key: string, value: any) => any;
    /**
     * Resets the store's state to its initial value.
     */
    reset: () => void;
};

/**
 * Represents the types of subscriptions for a store.
 */
export type Subscriptions<StateType> = {
    [subscriptionName in keyof Store<StateType>['mutations']]?: {
        willCommit?: (mutation: any) => Function;
        didCommit?: (mutation: any) => Function;
    };
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
    get: () => StateType;
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
 * Represents the properties used to set the store's state.
 * @template StateType The type of the state managed by the store.
 * @property {string|undefined} [path] The dot notation path to the property.
 * @property {any} value The value to set.
 */
export type StoreSetMutationProps<StateType> = { 
    path?: Paths<StateType>;
    value: any;
};

/**
 * Represents the properties used to merge the store's state.
 */
export type StoreMergeMutationProps<StateType = any> = Partial<StateType>;

/**
 * Represents an action dispatched to mutate application state.
 * @property {string} name - The name of the action.
 * @property {any} payload - Optional data associated with the action.
 */
export type Action = {
  name: string;
  payload?: any;
};

/**
 * Represents the parameters for a deep merge operation.
 * @property {any} sourceObject - The source object to merge from.
 * @property {any} targetObject - The target object to merge into.
 */
export type DeepMergeOptions = {
    sourceObject: any;
    targetObject: any;
}
  
/**
 * Represents the parameters for a deep set operation.
 * @property {any} sourceObject - The source object to set from.
 * @property {string} propertyPath The path to the property.
 * @property {any} value - The value to set.
 */
export type DeepSetOptions = {
    sourceObject: any;
    propertyPath: string;
    value: any;
}

/**
 * Represents a function that selects a portion of the store's state.
 * @template StateType The type of the state managed by the store.
 * @template SelectedType The type of the selected state.
 */
export type SelectorFunction<StateType = any, SelectedType = any> = (
    state: StateType
) => SelectedType;