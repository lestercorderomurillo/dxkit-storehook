import { useEffect, useState } from "react";
import { SelectorFunction, Store, useStoreReturn } from "../types";

/**
 * Hook for integrating a store.
 * @template StateType - The type of the state managed by the store.
 * @template SelectionType - The type of the selected state returned by the selector function.
 * @param store - The store instance to use.
 * @param selector - An selector function to extract a selected portion of the state.
 * @returns An array containing the selected state and store mutations.
 */
export const useStore = <StateType = any, SelectionType = StateType>(
  store: Store<StateType>,
  selector?: SelectorFunction<StateType, SelectionType>
): useStoreReturn<StateType, SelectionType> => {
  // If no selector is provided, default to identity function
  const defaultSelector = (state: StateType): StateType | SelectionType => state;
  const select = selector ? selector : defaultSelector;
  const [selection, setSelection] = useState<StateType | SelectionType>(select(store.current()));

  useEffect(() => {
    return store.subscribe((newState: StateType) => {
      // Deep clone the selected state to avoid reference issues
      setSelection(JSON.parse(JSON.stringify(select(newState))));
    });
  }, []);

  // Return the selected state and store mutations
  return [selection, store.mutations];
};
