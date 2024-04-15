"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const react_1 = require("react");
/**
 * Hhook for integrating a store.
 * @template StateType - The type of the state managed by the store.
 * @template SelectionType - The type of the selected state returned by the selector function.
 * @param store - The store instance to use.
 * @param selector - An selector function to extract a selected portion of the state.
 * @returns An array containing the selected state and store mutations.
 */
const useStore = (store, selector) => {
    // If no selector is provided, default to identity function
    const defaultSelector = (state) => state;
    const select = selector ? selector : defaultSelector;
    const [selection, setSelection] = (0, react_1.useState)(select(store.current()));
    (0, react_1.useEffect)(() => {
        return store.subscribe((newState) => {
            // Deep clone the selected state to avoid reference issues
            setSelection(JSON.parse(JSON.stringify(select(newState))));
        });
    }, []);
    // Return the selected state and store mutations
    return [selection, store.mutations];
};
exports.useStore = useStore;
