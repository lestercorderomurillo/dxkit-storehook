import { SelectorFunction, Store } from "../types";
export declare const useStore: <StateType = any, SelectionType = StateType>(store: Store<StateType>, selector?: SelectorFunction<StateType, SelectionType>) => [StateType | SelectionType, {
    [functionName: string]: Function;
}];
