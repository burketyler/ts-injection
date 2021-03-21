import "reflect-metadata";
import { Debugger } from "../classes/debugger";

const logger: Debugger = Debugger.getInstance("Env");

export function Env<T>(varName: string, mapper?: (val: string) => T): any {
  if (process && process.env) {
    return (classCtor: any, fieldName: string) => {
      logger.debug(
        `Injecting env var ${varName} into ${classCtor.constructor.name}.${fieldName}`
      );
      injectVarIntoMember(classCtor, fieldName, process.env[varName], mapper);
    };
  } else {
    throw new Error("The environment doesn't have process or process.env!");
  }
}

function injectVarIntoMember(
  classCtor: any,
  fieldName: string,
  envVar: string,
  mapper?: (val: string) => any
): void {
  if (envVar) {
    logger.debug(`Variable resolved to ${envVar}.`);
    classCtor[fieldName] = mapper ? mapper(envVar) : envVar;
  } else if (!envVar) {
    throw new Error(`Environment variable is undefined.`);
  }
}
