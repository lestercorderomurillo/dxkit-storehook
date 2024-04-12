import { createStoreProps, createStoreReturn, createStoreHookReturn, createStoreHookProps } from "./types";
export declare const isFunction: (value: any) => value is Function;
export declare const isObject: (value: any) => value is object;
export declare const isString: (value: any) => value is string;
export declare const isJSON: (obj: any) => boolean;
export declare const isDeepSetStateSchema: (newState: any) => newState is object;
export declare const deepMerge: ({ oldObj, newObj }: {
    oldObj: any;
    newObj: any;
}) => any;
export declare const deepSet: ({ src, path, replacement }: {
    src: any;
    path: any;
    replacement: any;
}) => any;
export declare const createStore: <StateType>(params: createStoreProps<StateType>) => createStoreReturn<StateType>;
export declare const createStoreHook: <StateType, SelectionType = StateType>(params: createStoreHookProps<StateType>) => createStoreHookReturn<StateType, SelectionType>;
