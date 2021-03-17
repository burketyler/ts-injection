import "reflect-metadata";
import { injectIntoClass } from "../functions/injectIntoClass";
import { useInjectionContext } from "../functions/useInjectionContext";
import { useDebugger } from "../functions/useDebugger";
import { INJ_PARAMS, META_TOKEN } from "../domain/metaAttribs.const";
import { Newable } from "../domain/model/newable.model";

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
  classCtor: any,
  member: string
): void {
  logger.debug(
    `Attempting to inject ${tokenOrClass} into ${classCtor.constructor.name}.${member}.`
  );
  if (typeof tokenOrClass !== "string") {
    tokenOrClass = getClassToken(tokenOrClass);
  }
  if (injectionCtx.isTokenInItems(tokenOrClass)) {
    logger.debug(`Found injectable, inserting into class.`);
    injectIntoClass(
      classCtor,
      member,
      injectionCtx.retrieveByToken(tokenOrClass)
    );
  } else {
    addAutoWireCallback(classCtor, member, tokenOrClass);
  }
}

function handleParameterInjection(
  tokenOrClass: string | Newable,
  classCtor: any,
  member: string,
  index: number
): void {
  if (typeof tokenOrClass !== "string") {
    tokenOrClass = getClassToken(tokenOrClass);
  }
  addTokenToParamMap(classCtor.prototype, tokenOrClass, index);
}

function addTokenToParamMap(
  classCtor: any,
  token: string,
  index: number
): void {
  classCtor[INJ_PARAMS] = classCtor[INJ_PARAMS] || {};
  classCtor[INJ_PARAMS][index] = token;
}

function addAutoWireCallback(
  classCtor: any,
  member: string,
  token: string
): void {
  logger.debug(
    `Class isn't available yet, adding AutoWire callback for when it becomes available.`
  );
  injectionCtx.addAutoWire({
    class: classCtor,
    member,
    token,
  });
}

function getClassToken(classCtor: new (...args: any[]) => {}): string {
  const token = Reflect.getMetadata(META_TOKEN, classCtor);
  if (token === undefined) {
    throw new Error("A class was provided but it has no token in metadata!");
  } else {
    return token;
  }
}
