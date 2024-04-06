import { useEffect, useState } from "react";
import { SelectorFunction, Store, useStoreReturn } from "../types";

export const useStore = <StateType = any, SelectionType = StateType>(
  store: Store<StateType>,
  selector?: SelectorFunction<StateType, SelectionType>
): useStoreReturn<StateType, SelectionType> => {
  const defaultSelector = (state: StateType): StateType | SelectionType => state;
  const select = selector ? selector : defaultSelector;
  const [selection, setSelection] = useState<StateType | SelectionType>(select(store.current()));

  useEffect(() => {
    return store.subscribe((newState: StateType) => {
      setSelection(JSON.parse(JSON.stringify(select(newState))));
    });
  }, []);

  return [selection, store.mutations];
};