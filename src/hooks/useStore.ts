import { useEffect, useState } from "react";
import { MutationsSchema, Selector, Store, useStoreReturn } from "../types";
import { isObject } from "../utils";

/**
 * Hook for interacting with a store.
 * @template TState The type of the state managed by the store.
 * @template TSlice The type of the selected state.
 * @template TMutations The type of mutations that can be dispatched to the store.
 * @param {Store<TState, TMutations>} store The store to interact with.
 * @param {Selector<TState, TSlice>} [selector] A function to select a portion of the store's state.
 * @returns {useStoreReturn<TState, TSlice, TMutations>} An array containing the selected state and mutation functions.
 */
export const useStore = <TState, TSlice = TState, TMutations extends MutationsSchema = MutationsSchema>(
  store: Store<TState, TMutations>,
  selector?: Selector<TState, TSlice>,
): useStoreReturn<TState, TSlice, TMutations> => {
  const defaultSelector = (state: TState): TState | TSlice => state;
  const select = selector ? selector : defaultSelector;
  const [selection, setSelection] = useState(select(store.current()));

  useEffect(() => {
    return store.subscribe((newState: TState) => {
      if (isObject(newState)) {
        setSelection(select({ ...newState }));
      } else if (Array.isArray(newState)) {
        setSelection(select([...newState] as any));
      } else {
        setSelection(select(newState));
      }
    });
  }, []);

  return [selection, store.mutations];
};
