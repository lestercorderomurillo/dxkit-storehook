export declare class Observable<ObservedValueType = any> {
    private value;
    private signal;
    constructor(value?: ObservedValueType);
    watch(effectCallback: Function): () => void;
    update(value: ObservedValueType): void;
    current(): ObservedValueType;
}
