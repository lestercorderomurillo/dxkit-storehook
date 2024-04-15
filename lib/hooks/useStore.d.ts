import { SelectorFunction, Store, useStoreReturn } from "../types";
/**
 * Hhook for integrating a store.
 * @template StateType - The type of the state managed by the store.
 * @template SelectionType - The type of the selected state returned by the selector function.
 * @param store - The store instance to use.
 * @param selector - An selector function to extract a selected portion of the state.
 * @returns An array containing the selected state and store mutations.
 */
export declare const useStore: <StateType = any, SelectionType = StateType>(store: Store<StateType>, selector?: SelectorFunction<StateType, SelectionType>) => useStoreReturn<StateType, SelectionType>;
