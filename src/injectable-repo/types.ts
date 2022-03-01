export class InjectableNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "InjectableNotFoundError";
    Object.setPrototypeOf(this, InjectableNotFoundError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
