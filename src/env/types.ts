export class EnvironmentVariableError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "EnvironmentVariableError";
    Object.setPrototypeOf(this, EnvironmentVariableError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface Options<VariableType> {
  failBehaviour?: "THROW" | "LOG";
  mapper?: (val: string) => VariableType;
}
