"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const react_1 = require("react");
const useStore = (store, selector) => {
    const defaultSelector = (state) => state;
    const select = selector ? selector : defaultSelector;
    const [selection, setSelection] = (0, react_1.useState)(select(store.state()));
    (0, react_1.useEffect)(() => {
        return store.subscribe((newState) => {
            setSelection(JSON.parse(JSON.stringify(select(newState))));
        });
    }, []);
    return [selection, store.mutations];
};
exports.useStore = useStore;
