import "reflect-metadata";
import { useDebugger } from "../utils/use-debugger";
import { InjectableType } from "../types/injectable-type";
import { META_TYPE } from "../constants";
import { Newable } from "../types/newable";
import { makeClassInjectable } from "./utils";

const { logger } = useDebugger("Injectable");

export function Injectable<T extends Newable>(classCtor: T): void {
  logger.debug(`Detected Injectable class ${classCtor.name}.`);
  Reflect.defineMetadata(META_TYPE, InjectableType.CLASS, classCtor);
  makeClassInjectable(classCtor);
}
