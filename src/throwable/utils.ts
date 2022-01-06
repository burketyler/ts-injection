import { Fail, Success } from "./main";

export function fail<FailType, SuccessType>(
  value: FailType
): Fail<FailType, SuccessType> {
  return new Fail<FailType, SuccessType>(value);
}

export function success<FailType, SuccessType>(
  value: SuccessType
): Success<FailType, SuccessType> {
  return new Success<FailType, SuccessType>(value);
}
