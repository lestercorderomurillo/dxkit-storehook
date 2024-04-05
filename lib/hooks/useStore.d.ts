import { SelectorFunction, Store, useStoreReturn } from "../types";
export declare const useStore: <StateType = any, SelectionType = StateType>(store: Store<StateType>, selector?: SelectorFunction<StateType, SelectionType>) => useStoreReturn<StateType, SelectionType>;
