import "reflect-metadata";
import { Debugger } from "../classes/debugger";
import extractType from "../functions/extractType";
import { PrimitiveType } from "../domain/model/primitiveType.model";

const logger: Debugger = Debugger.getInstance("Env");

export function Env<T>(varName: string, mapper?: (val: string) => T) {
  if (process && process.env) {
    return (classCtor: any, fieldName: string) => {
      const type = extractType(classCtor, fieldName);
      logger.debug(
        `Injecting env var ${varName} into ${classCtor.constructor.name}.${fieldName}`
      );
      injectVarIntoMember(
        type,
        classCtor,
        fieldName,
        process.env[varName],
        mapper
      );
    };
  } else {
    throw new Error("The environment doesn't have process or process.env!");
  }
}

function injectVarIntoMember(
  type: () => any,
  classCtor: any,
  fieldName: string,
  envVar: string,
  mapper?: (val: string) => any
): void {
  if (!envVar) {
    throw new Error(`Environment variable is undefined.`);
  }
  logger.debug(`Variable resolved to ${envVar}.`);
  if (mapper) {
    logger.debug("Using custom mapper to parse var.");
    classCtor[fieldName] = mapper(envVar);
  } else {
    logger.debug(`Using provided type ${type} to parse var.`);
    classCtor[fieldName] = parseEnvVarByType(type, envVar);
  }
}

function parseEnvVarByType(
  type: () => any,
  envVar: string
): number | boolean | object | string {
  switch (type) {
    case PrimitiveType.NUMBER:
      return Number(envVar);
    case PrimitiveType.BOOLEAN:
      return envVar === "true";
    case PrimitiveType.OBJECT:
      return JSON.parse(envVar);
    default:
      return envVar;
  }
}
