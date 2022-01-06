/* eslint-disable no-param-reassign */

import { AUTO_WIRE_LIST, PARAM_LIST, META_TOKEN } from "../constants";
import { useDebugger } from "../debugger";
import { useInjectionContext } from "../injection-context";
import { Newable } from "../types";

import { AutowireError } from "./types";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Autowire");

export function Autowire(tokenOrClass: string | Newable): any {
  return (classCtor: any, member: string, index: number) => {
    if (index === undefined) {
      handleFieldInjection(tokenOrClass, classCtor, member);
    } else {
      handleParameterInjection(tokenOrClass, classCtor, member, index);
    }
  };
}

function handleFieldInjection(
  tokenOrClass: string | Newable,
  classCtor: Newable,
  member: string
): void {
  logger.debug(
    `Attempting to inject ${tokenOrClass} into ${classCtor.constructor.name}.${member}.`
  );

  if (typeof tokenOrClass !== "string") {
    tokenOrClass = getClassToken(tokenOrClass);
  }

  injectionCtx
    .getItemByToken(tokenOrClass)
    .onSuccess(({ value }) => {
      logger.debug(`Found injectable, inserting into class.`);

      (classCtor as any)[member] = value;
    })
    .onError(() => {
      addTokenToAutowireMaps(classCtor, member, tokenOrClass as string);
    });
}

function handleParameterInjection(
  tokenOrClass: string | Newable,
  classCtor: Newable,
  member: string,
  index: number
): void {
  if (typeof tokenOrClass !== "string") {
    tokenOrClass = getClassToken(tokenOrClass);
  }

  addTokenToParamMap(classCtor.prototype, tokenOrClass, index);
}

function addTokenToParamMap(
  classCtor: Newable,
  token: string,
  index: number
): void {
  if (!(classCtor as any)[PARAM_LIST]) {
    (classCtor as any)[PARAM_LIST] = {};
  }

  (classCtor as any)[PARAM_LIST][index] = token;
}

function addTokenToAutowireMaps(
  classCtor: Newable,
  member: string,
  token: string
): void {
  logger.debug(
    "The injectable isn't registered yet, adding AutoWire rule to class for when it becomes available."
  );

  if (!(classCtor as any)[PARAM_LIST]) {
    (classCtor as any)[PARAM_LIST] = {};
  }

  (classCtor as any)[AUTO_WIRE_LIST][member] = token;
}

function getClassToken(classCtor: Newable): string {
  const token = Reflect.getMetadata(META_TOKEN, classCtor);

  if (token === undefined) {
    throw new AutowireError(
      "A newable constructor was provided but it has no token in metadata."
    );
  } else {
    return token;
  }
}
