/* eslint-disable max-classes-per-file, no-underscore-dangle */

export type Throwable<FailType, SuccessType> =
  | Fail<FailType, SuccessType>
  | Success<FailType, SuccessType>;

export interface ThrowableInterface<F, S> {
  value: () => F | S;
  isSuccess: () => this is Success<F, S>;
  isError: () => this is Fail<F, S>;
  successOrThrow: (error: Error) => S;
  onSuccess: (
    action: (value: F | S) => unknown
  ) => FailChainable<F, S, unknown> | SuccessChainable<F, S, unknown>;
  onError: (
    action: (value: F | S) => unknown
  ) => FailChainable<F, S, unknown> | SuccessChainable<F, S, unknown>;
}

export interface ChainableInterface<F, S, O> {
  onSuccess: (
    action: (value: F | S) => O
  ) => FailChainable<F, S, O> | SuccessChainable<F, S, O>;
  onError: (
    action: (value: F | S) => O
  ) => FailChainable<F, S, O> | SuccessChainable<F, S, O>;
  output: () => O;
}

export class Success<F, S> implements ThrowableInterface<F, S> {
  constructor(private readonly _value: S) {}

  public value(): S {
    return this._value;
  }

  public isSuccess(): this is Success<F, S> {
    return true;
  }

  public isError(): this is Fail<F, S> {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public successOrThrow(_: Error): S {
    return this.value();
  }

  public onSuccess<O>(action: (value: S) => O): SuccessChainable<F, S, O> {
    return new SuccessChainable<F, S, O>(this.value()).onSuccess(action);
  }

  public onError<O>(action: (value: F) => O): SuccessChainable<F, S, O> {
    return new SuccessChainable<F, S, O>(this.value()).onError(action);
  }
}

export class SuccessChainable<F, S, O> implements ChainableInterface<F, S, O> {
  private _output: O | undefined;

  constructor(private readonly _value: S) {}

  public onSuccess(action: (value: S) => O): this {
    this._output = action(this._value);

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onError(_: (value: F) => O): this {
    return this;
  }

  public output(): O {
    return this._output as O;
  }
}

export class Fail<F, S> implements ThrowableInterface<F, S> {
  constructor(private readonly _value: F) {}

  public isSuccess(): this is Success<F, S> {
    return false;
  }

  public isError(): this is Fail<F, S> {
    return true;
  }

  public successOrThrow(error: Error): S {
    throw error;
  }

  public value(): F {
    return this._value;
  }

  public onSuccess<O>(action: (value: S) => O): FailChainable<F, S, O> {
    return new FailChainable<F, S, O>(this.value()).onSuccess(action);
  }

  public onError<O>(action: (value: F) => O): FailChainable<F, S, O> {
    return new FailChainable<F, S, O>(this.value()).onError(action);
  }
}

export class FailChainable<F, S, O> implements ChainableInterface<F, S, O> {
  private _output: O | undefined;

  constructor(private readonly _value: F) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onSuccess(_: (value: S) => O): this {
    return this;
  }

  public onError(action: (value: F) => O): this {
    this._output = action(this._value);

    return this;
  }

  public output(): O {
    return this._output as O;
  }
}
