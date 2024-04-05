"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
const Signal_1 = require("./Signal");
class Observable {
    constructor(value) {
        this.signal = new Signal_1.Signal();
        this.update(value);
    }
    watch(effectCallback) {
        return this.signal.observe(effectCallback);
    }
    update(value) {
        this.value = value;
        this.signal.emit(value);
    }
    current() {
        return this.value;
    }
}
exports.Observable = Observable;
