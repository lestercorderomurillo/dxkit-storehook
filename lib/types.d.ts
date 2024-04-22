import { Paths } from "type-fest";
/**
 * Represents the schema for a store that holds the application state.
 * @template TState The type of the state managed by the store.
 * @template TMutations The type of mutations that can be dispatched to the store.
 * @template TSubscriptions The type of subscriptions that can be attached to mutations.
 */
export type StoreSchema<TState = any, TMutations extends MutationsSchema = MutationsSchema, TSubscriptions extends SubscriptionsSchema<TMutations> = SubscriptionsSchema<TMutations>> = {
    /**
     * The initial state of the store.
     */
    initialState: TState | undefined;
    /**
     * A function that holds the defined mutation functions.
     * @param operations Callbacks available that can perform mutations on the store.
     * @returns An object containing the store mutation functions.
     */
    mutations?: (operations: MutationOperations<TState>) => TMutations;
    /**
     * A function that generates subscription functions based on the provided mutations.
     * @param operations The subscription operations available in the store.
     * @returns An object containing the store subscription functions.
     */
    subscriptions?: (operations: SubscriptionOperations<TState>) => TSubscriptions;
};
/**
 * Represents a store that holds a state consistently.
 * @template StateType - The type of the state managed by the store.
 * @template TMutations - The type of mutations that can be dispatched to the store.
 */
export type Store<TState = any, TMutations extends MutationsSchema = {}> = {
    /**
     * Retrieves the current root state of the store.
     * @returns {TState | undefined} The current state of the store.
     */
    current: () => TState | undefined;
    /**
     * Subscribes to changes in the store's state.
     * @param {Function} callback - A function to be called when the state changes. The function receives the new state as its argument.
     * @returns {Function} A function to unsubscribe from the subscription.
     */
    subscribe: (callback: (state: TState) => any) => () => void;
    /**
     * Mutations callbacks that can be dispatched to the store.
     */
    mutations: TMutations;
};
/**
 * Enforces mutations schemas to be defined in a specific way.
 * @typedef {Object} MutationsSchema
 * @property {Function} [key: string] - A mutation function that takes an optional payload as an argument and returns void.
 * @property {any} [payload=] - The optional payload to be passed to the mutation function.
 */
export type MutationsSchema = {
    [key: string]: (payload?: any) => void;
};
/**
 * Enforces subscription schemas to be defined in a specific way.
 * @template TMutations - The type of mutations to which subscriptions can be attached.
 */
export type SubscriptionsSchema<TMutations extends MutationsSchema> = {
    [key in keyof TMutations]?: {
        /**
         * A hook function that is called before the current mutation is permanently committed.
         * It receives the same arguments as the mutation function the user called.
         *
         * Intended to be used as a submission point and to forward the real values from your external datasource
         * into the optimistic values that have already been mutated.
         */
        willCommit?: (...args: Parameters<TMutations[key]>) => void;
        /**
         * A hook function that is called after the corresponding mutation is fully committed,
         * and already using the final values from your external datasource.
         * It receives the same arguments as the mutation function.
         */
        didCommit?: (...args: Parameters<TMutations[key]>) => void;
    };
};
export type useStoreReturn<TState, TSlice, TMutations> = [TState | TSlice, TMutations];
/**
 * Represents the operations available for mutations.
 * @template TState The type of the state managed by the store.
 */
export type MutationOperations<TState> = {
    /**
     * Retrieves the current state of the store.
     * @returns The current state.
     */
    get: () => TState;
    /**
     * Sets the state of the store.
     * @param setParams The parameters for setting the state.
     */
    set: (setParams: SetMutation<TState>) => void;
    /**
     * Merges new data into the state of the store.
     * @param mergeParams The parameters for merging the state.
     */
    merge: (mergeParams: MergeMutation<TState>) => void;
    /**
     * Provides optimistic updates to the state.
     * @param key The key of the value to update.
     * @param value The optimistic value.
     * @returns The updated value.
     */
    optimistic: (key: string, value: any) => any;
    /**
     * Resets the state of the store.
     */
    reset: () => void;
};
/**
 * Represents the operations available for subscriptions.
 * @template TState The type of the state managed by the store.
 */
export type SubscriptionOperations<TState> = {
    /**
     * Retrieves the current state of the store.
     * @returns {TState} The current state.
     */
    get: () => TState;
    /**
     * Forwards a value to a previous cache and forces a store update.
     * @param key The key to replace from a previous optimistic value.
     * @param value The non-optimistic value.
     */
    forward: (key: string, value: any) => void;
    /**
     * Rolls back the mutation and stop propagation to other mutation subscriptions.
     */
    rollback: () => void;
};
/**
 * Represents a function that selects a portion of the store's state.
 * @template TState - The type of the state managed by the store.
 * @template TSlice - The type of the selected state.
 * @param {TState} state - The current state of the store.
 * @returns {TSlice} The selected portion of the store's state.
 **/
export type Selector<TState = any, TSlice = any> = (state: TState) => TSlice;
/**
 * Represents an action or mutation that can be dispatched to the store.
 */
export type Action = {
    /**
     * The name of the action.
     */
    name: string;
    /**
     * The payload associated with the action.
     */
    payload?: any;
};
/**
 * Represents parameters for deeply setting a value in an object.
 */
export type DeepSet = {
    /**
     * The source object.
     */
    sourceObject: any;
    /**
     * The property path where the value should be set.
     */
    propertyPath: string;
    /**
     * The value to set.
     */
    value: any;
};
/**
 * Represents parameters for deeply merging objects.
 */
export type DeepMerge = {
    /**
     * The source object.
     */
    sourceObject: any;
    /**
     * The target object.
     */
    targetObject: any;
};
/**
 * Represents parameters for setting the state of the store.
 * @template TState The type of the state managed by the store.
 */
export type SetMutation<TState> = {
    /**
     * The path to where the value should be set in the state.
     */
    path?: Paths<TState>;
    /**
     * The value to set.
     */
    value: any;
};
/**
 * Represents parameters for merging data into the state of the store.
 * @template TState The type of the state managed by the store.
 */
export type MergeMutation<TState = any> = Partial<TState>;
