import "reflect-metadata";
import { injectIntoClass } from "../utils/inject-into-class";
import { useInjectionContext } from "../utils/use-injection-context";
import { useDebugger } from "../utils/use-debugger";
import { AutoWireList, ParamList, META_TOKEN } from "../constants";
import { Newable } from "../types/newable";

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
    addTokenToAutowireMaps(classCtor, member, tokenOrClass);
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
  classCtor[ParamList] = classCtor[ParamList] || {};
  classCtor[ParamList][index] = token;
}

function addTokenToAutowireMaps(
  classCtor: any,
  member: string,
  token: string
): void {
  logger.debug(
    "The injectable isn't registered yet, adding AutoWire rule to class for when it becomes available."
  );
  classCtor[AutoWireList] = classCtor[AutoWireList] || {};
  classCtor[AutoWireList][member] = token;
}

function getClassToken(classCtor: Newable): string {
  const token = Reflect.getMetadata(META_TOKEN, classCtor);
  if (token === undefined) {
    throw new Error("A class was provided but it has no token in metadata!");
  } else {
    return token;
  }
}
