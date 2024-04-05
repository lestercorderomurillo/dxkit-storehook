import { useEffect, useState } from "react";
import { SelectorFunction, Store } from "../types";

export const useStore = <StateType = any, SelectionType = StateType>(
  store: Store<StateType>,
  selector?: SelectorFunction<StateType, SelectionType>
): [StateType | SelectionType, { [functionName: string]: Function }] => {
  const defaultSelector = (state: StateType): StateType | SelectionType => state;
  const select = selector ? selector : defaultSelector;

  const [selection, setSelection] = useState<StateType | SelectionType>(select(store.state()));

  useEffect(() => {
    return store.onChange((newState: StateType) => {
      setSelection(JSON.parse(JSON.stringify(select(newState))));
    });
  }, []);

  return [selection, store.mutations];
};
