import "reflect-metadata";
import { makeClassInjectable } from "../functions/makeClassInjectable";
import { useDebugger } from "../functions/useDebugger";
import { InjectableType } from "../domain/enum/injectableType.enum";
import { META_TYPE } from "../domain/metaAttribs.const";

const { logger } = useDebugger("Injectable");

export function Injectable<T extends new (...args: any[]) => {}>(
  classCtor: T
): void {
  logger.debug(`Detected Injectable class ${classCtor.name}.`);
  Reflect.defineMetadata(META_TYPE, InjectableType.CLASS, classCtor);
  makeClassInjectable(classCtor);
}
