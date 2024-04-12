import { Signal } from "./Signal";

export class Observable<ObservedValueType = any> {
    private value: ObservedValueType;
    private signal: Signal;
  
    constructor(value?: ObservedValueType) {
      this.signal = new Signal<ObservedValueType>();
      this.update(value);
    }
  
    watch(effectCallback: Function) {
      return this.signal.observe(effectCallback);
    }
  
    update(value: ObservedValueType) {
      this.value = value;
      this.signal.emit(value);
    }
  
    current() {
      return this.value;
    }
  }