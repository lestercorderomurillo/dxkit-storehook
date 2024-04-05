export declare class Signal<SignalType = any> {
    observers: Set<Function>;
    constructor();
    observe(callback: Function): () => void;
    emit(newSignal: SignalType): void;
}
