/**
 * Represents an observable value that can be watched for changes.
 * @template ObservedValueType - The type of the value being observed.
 */
export declare class Observable<ObservedValueType = any> {
    private value;
    private signal;
    /**
     * Creates an instance of Observable.
     * @param value - The initial value to set for the observable (optional).
     */
    constructor(value?: ObservedValueType);
    /**
     * Register a callback to be invoked whenever the value of the observable changes.
     * @param effectCallback - The callback function to be invoked.
     * @returns A function to unsubscribe the callback from further notifications.
     */
    watch(effectCallback: Function): () => void;
    /**
     * Updates the value of the observable and notifies all registered watchers.
     * @param value - The new value for the observable.
     */
    update(value: ObservedValueType): void;
    /**
     * Retrieves the current value of the observable.
     * @returns The current value.
     */
    current(): ObservedValueType;
}
