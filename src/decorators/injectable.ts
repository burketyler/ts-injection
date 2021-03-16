import "reflect-metadata";
import { InjectableType, META_TYPE } from "./di.model";
import { makeClassInjectable } from "./makeClassInjectable";
import { useDebugger } from "./useDebugger";

const { logger } = useDebugger("Injectable");

export function Injectable<T extends new (...args: any[]) => {}>(
  classCtor: T
): void {
  logger.debug(`Detected Injectable class ${classCtor.name}.`);
  Reflect.defineMetadata(META_TYPE, InjectableType.CLASS, classCtor);
  makeClassInjectable(classCtor);
}
