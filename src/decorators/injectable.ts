import "reflect-metadata";
import { makeClassInjectable } from "../functions/makeClassInjectable";
import { useDebugger } from "../functions/useDebugger";
import { InjectableType } from "../domain/enum/injectableType.enum";
import { META_TYPE } from "../domain/metaAttribs.const";
import { Newable } from "../domain/model/newable.model";

const { logger } = useDebugger("Injectable");

export function Injectable<T extends Newable>(classCtor: T): void {
  logger.debug(`Detected Injectable class ${classCtor.name}.`);
  Reflect.defineMetadata(META_TYPE, InjectableType.CLASS, classCtor);
  makeClassInjectable(classCtor);
}
