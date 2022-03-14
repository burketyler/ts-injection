/* eslint-disable no-param-reassign */

import { AUTO_WIRE_LIST, PARAM_LIST } from "../../constants";
import { Logger, LogNamespace } from "../../logger";
import {
  ClassMetadata,
  InjectableClass,
  InjectableProto,
  Newable,
  Proto,
} from "../../types";

import { AutowireError } from "./types";

const logger = new Logger(LogNamespace.AUTOWIRE);

/* eslint-disable @typescript-eslint/no-explicit-any */
export function autowire(token: string): any;
export function autowire(_class: Newable): any;
export function autowire(tokenOrClass: string | Newable): any {
  return typeof tokenOrClass === "string"
    ? Autowire(tokenOrClass)
    : Autowire(tokenOrClass);
}

export function Autowire(token: string): any;
export function Autowire(_class: Newable): any;
export function Autowire(tokenOrClass: string | Newable): any {
  return (proto: Proto | Newable, member: string, index: number) => {
    if (index === undefined) {
      handleFieldInjection(tokenOrClass, proto as InjectableProto, member);
    } else {
      handleConstructorInjection(
        tokenOrClass,
        proto as InjectableClass,
        member,
        index
      );
    }
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function handleFieldInjection(
  tokenOrClass: string | Newable,
  proto: InjectableProto,
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
  Class: InjectableClass,
  member: string,
  index: number
): void {
  logger.info(`Processing Autowire for ${Class.name}.`);

  const tokenOrClassId =
    typeof tokenOrClass === "string" ? tokenOrClass : getClassId(tokenOrClass);

  logger.debug(
    `Binding injectable ${tokenOrClassId} to constructor at index ${index}.`
  );

  Class[PARAM_LIST] = Class[PARAM_LIST] ?? {};
  (Class as InjectableClass)[PARAM_LIST][index] = tokenOrClassId;
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
