import { Newable } from "../types";

export class ClassNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ClassNotFoundError";
    Object.setPrototypeOf(this, ClassNotFoundError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface ClassItem {
  id: string;
  ctor: Newable;
}
