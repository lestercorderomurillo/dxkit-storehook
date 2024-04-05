import { Store, StoreManifest } from "./types";
export declare const isFunction: (value: any) => value is Function;
export declare const isObject: (value: any) => value is object;
export declare const isString: (value: any) => value is string;
export declare const isJSON: (obj: any) => boolean;
export declare const deepMerge: (oldObj: any, newObj: any) => any;
export declare const createStore: <StateType = any>(params: StoreManifest<StateType>) => Store<StateType>;
export declare const createStoreHook: <StateType = any, SelectionType = StateType>(params: StoreManifest<StateType>) => (() => [
    SelectionType,
    {
        [functionName: string]: Function;
    }
]);
