/**
 * A signal implementation for observing changes.
 * @template SignalType - The type of signal being emitted.
 */
export declare class Signal<SignalType = any> {
    /** Set to store observer callbacks. */
    observers: Set<Function>;
    /**
     * Creates an instance of Signal.
     */
    constructor();
    /**
     * Registers an observer callback to be notified when the signal is emitted.
     * @param callback - The callback function to be invoked when the signal is emitted.
     * @returns A function to unsubscribe the callback from further notifications.
     */
    observe(callback: Function): () => void;
    /**
     * Emits the signal, notifying all registered observers.
     * @param newSignal - The new signal to emit.
     */
    emit(newSignal: SignalType): void;
}
