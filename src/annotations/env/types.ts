export class EnvironmentVariableError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "EnvironmentVariableError";
    Object.setPrototypeOf(this, EnvironmentVariableError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface Options<VariableType> {
  default?: VariableType;
  failBehaviour?: "THROW" | "LOG" | "SILENT";
  mapper?: (val: string) => VariableType;
}
