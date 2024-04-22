"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const react_1 = require("react");
/**
 * Hook for interacting with a store.
 * @template TState The type of the state managed by the store.
 * @template TSlice The type of the selected state.
 * @template TMutations The type of mutations that can be dispatched to the store.
 * @param {Store<TState, TMutations>} store The store to interact with.
 * @param {Selector<TState, TSlice>} [selector] A function to select a portion of the store's state.
 * @returns {useStoreReturn<TState, TSlice, TMutations>} An array containing the selected state and mutation functions.
 */
const useStore = (store, selector) => {
    const defaultSelector = (state) => state;
    const select = selector ? selector : defaultSelector;
    const [selection, setSelection] = (0, react_1.useState)(select(store.current()));
    (0, react_1.useEffect)(() => {
        return store.subscribe((newState) => {
            setSelection(JSON.parse(JSON.stringify(select(newState))));
        });
    }, []);
    return [selection, store.mutations];
};
exports.useStore = useStore;
