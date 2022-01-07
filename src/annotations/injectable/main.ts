import { META_TYPE } from "../../constants";
import { useDebugger } from "../../debugger";
import { InjectableType as InjectionType, Newable } from "../../types";

import { makeClassInjectable } from "./utils";

const { logger } = useDebugger("Injectable");

export function Injectable<InjectableType extends Newable>(
  classCtor: InjectableType
): void {
  logger.debug(`Detected Injectable class ${classCtor.name}.`);

  Reflect.defineMetadata(META_TYPE, InjectionType.CLASS, classCtor);

  makeClassInjectable(classCtor).onError((error) => {
    throw error;
  });
}
