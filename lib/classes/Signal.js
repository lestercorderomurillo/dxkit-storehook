"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signal = void 0;
class Signal {
    constructor() {
        this.observers = new Set();
    }
    observe(callback) {
        this.observers.add(callback);
        return () => {
            this.observers.delete(callback);
        };
    }
    emit(newSignal) {
        this.observers.forEach((callback) => callback(newSignal));
    }
}
exports.Signal = Signal;
