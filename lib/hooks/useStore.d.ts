import { MutationsSchema, Selector, Store, useStoreReturn } from "../types";
/**
 * Hook for interacting with a store.
 * @template TState The type of the state managed by the store.
 * @template TSlice The type of the selected state.
 * @template TMutations The type of mutations that can be dispatched to the store.
 * @param {Store<TState, TMutations>} store The store to interact with.
 * @param {Selector<TState, TSlice>} [selector] A function to select a portion of the store's state.
 * @returns {useStoreReturn<TState, TSlice, TMutations>} An array containing the selected state and mutation functions.
 */
export declare const useStore: <TState, TSlice = TState, TMutations extends MutationsSchema = MutationsSchema>(store: Store<TState, TMutations>, selector?: Selector<TState, TSlice>) => useStoreReturn<TState, TSlice, TMutations>;
