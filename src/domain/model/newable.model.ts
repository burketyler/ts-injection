export type Newable = new (...args: any[]) => any;
export type TypedNewable<T> = new (...args: any[]) => T;
