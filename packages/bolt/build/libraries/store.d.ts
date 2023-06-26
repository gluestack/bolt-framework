declare class Store {
    path: string;
    store: any;
    constructor(path: string);
    restore(): void;
    set(key: string, value: any): void;
    get(key: string): any;
    save(): void;
}
export default Store;
