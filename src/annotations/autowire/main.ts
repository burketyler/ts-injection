/* eslint-disable no-param-reassign */

import { AUTO_WIRE_LIST, PARAM_LIST } from "../../constants";
import { Logger, LogNamespace } from "../../logger";
import { ClassMetadata, InjectableClass, Newable, Proto } from "../../types";

import { AutowireError } from "./types";

const logger = new Logger(LogNamespace.AUTOWIRE);

/* eslint-disable @typescript-eslint/no-explicit-any */
export function autowire(token: string): any;
export function autowire(_class: Newable): any;
export function autowire(tokenOrClass: string | Newable): any {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return typeof tokenOrClass === "string"
    ? Autowire(tokenOrClass)
    : Autowire(tokenOrClass);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function Autowire(token: string): any;
export function Autowire(_class: Newable): any;
export function Autowire(tokenOrClass: string | Newable): any {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  return (proto: Proto | Newable, member: string, index: number) => {
    if (index === undefined) {
      handleFieldInjection(tokenOrClass, proto as Proto, member);
    } else {
      handleConstructorInjection(tokenOrClass, proto as Newable, member, index);
    }
  };
}

function handleFieldInjection(
  tokenOrClass: string | Newable,
  proto: Proto,
  fieldName: string
): void {
  logger.info(`Processing Autowire for ${proto.constructor.name}.`);

  const tokenOrClassId =
    typeof tokenOrClass === "string" ? tokenOrClass : getClassId(tokenOrClass);

  logger.debug(
    `Binding injectable ${tokenOrClassId} to property '${fieldName}'.`
  );

  proto[AUTO_WIRE_LIST] = proto[AUTO_WIRE_LIST] ?? {};
  proto[AUTO_WIRE_LIST][fieldName] = tokenOrClassId;
}

function handleConstructorInjection(
  tokenOrClass: string | Newable,
  ctor: Newable,
  member: string,
  index: number
): void {
  logger.info(`Processing Autowire for ${ctor.name}.`);

  const tokenOrClassId =
    typeof tokenOrClass === "string" ? tokenOrClass : getClassId(tokenOrClass);

  logger.debug(
    `Binding injectable ${tokenOrClassId} to constructor at index ${index}.`
  );

  ctor[PARAM_LIST] = ctor[PARAM_LIST] ?? {};
  (ctor as InjectableClass)[PARAM_LIST][index] = tokenOrClassId;
}

function getClassId(classCtor: Newable): string {
  const token: string | undefined = Reflect.getMetadata(
    ClassMetadata.CLASS_ID,
    classCtor
  );

  if (token === undefined) {
    throw new AutowireError(
      `Attempting to bind non-injectable class ${classCtor.name}.`
    );
  }

  return token;
}
