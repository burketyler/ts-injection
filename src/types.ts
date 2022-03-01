import { AUTO_WIRE_LIST, PARAM_LIST } from "./constants";

export class InjectionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "InjectionError";
    Object.setPrototypeOf(this, InjectionError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface Newable {
  new (...args: any[]): any; // eslint-disable-line @typescript-eslint/no-explicit-any
  [PARAM_LIST]?: {
    [paramIndex: number]: string;
  };
  constructor: {
    prototype: Proto;
  } & Omit<Function, "prototype">; // eslint-disable-line @typescript-eslint/ban-types
}

export interface Proto {
  constructor: Function; // eslint-disable-line @typescript-eslint/ban-types
  [AUTO_WIRE_LIST]: {
    [fieldName: string]: string;
  };
}

export interface InjectableClass extends Newable {
  [PARAM_LIST]: {
    [paramIndex: number]: string;
  };
}

export interface InjectableItem<ItemType> extends InjectableOptions {
  token: string;
  instance: ItemType;
}

export interface InjectableOptions {
  tags: string[];
  token: string;
  isTransient?: boolean;
}

export enum ClassMetadata {
  PARAMS = "design:paramtypes",
  CLASS_ID = "tsi:id",
  OPTIONS = "tsi:options",
}
