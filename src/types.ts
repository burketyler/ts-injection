/**
 * @deprecated please use InjectableItem instead
 */
export type InjectableItemModel<ItemType> = InjectableItem<ItemType>;

export interface InjectableItem<ItemType> {
  token: string;
  value: ItemType;
}

export enum InjectableType {
  CLASS,
  OBJECT,
}

export type Newable = new (...args: any[]) => any;

export class InjectionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "InjectionError";
    Object.setPrototypeOf(this, InjectionError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
