export class Signal<SignalType = any> {
    observers: Set<Function>;

    constructor() {
        this.observers = new Set();
    }

    observe(callback: Function): () => void {
        this.observers.add(callback);
        return () => {
            this.observers.delete(callback);
        };
    }

    emit(newSignal: SignalType) {
        this.observers.forEach((callback) => callback(newSignal));
    }
}