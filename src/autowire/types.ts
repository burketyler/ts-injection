export class AutowireError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "AutowireError";
    Object.setPrototypeOf(this, AutowireError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
