import { useInjectionContext } from "./useInjectionContext";
import { useDebugger } from "./useDebugger";
import {
  INJ_PARAMS,
  META_PARAMS,
  META_TOKEN,
} from "../domain/metaAttribs.const";
import { Newable } from "../domain/model/newable.model";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Injectable");

export function makeClassInjectable<T extends Newable>(
  classCtor: T
): string | undefined {
  try {
    logger.debug(`Making injectable instance of class ${classCtor.name}.`);
    const depList = getDependencyList(classCtor);
    if (!depList) {
      logger.debug("Dependency is a primitive, skipping.");
      return undefined;
    }
    return addClassToInjectionCtx(
      classCtor,
      processDependencies(classCtor, depList)
    );
  } catch (e) {
    logger.debug(e);
    throw new Error(`Unable to make injectable instance of ${classCtor.name}.`);
  }
}

function getDependencyList(target: any): any[] | undefined {
  return Reflect.getMetadata(META_PARAMS, target);
}

function addClassToInjectionCtx<T extends new (...args: any[]) => {}>(
  classCtor: T,
  resolvedDeps: any[]
): string {
  const token: string = injectionCtx.register(new classCtor(...resolvedDeps));
  Reflect.defineMetadata(META_TOKEN, token, classCtor);
  return token;
}

function processDependencies(classCtor: any, deps: any[]): any[] {
  const resolved: any[] = [];
  logger.debug(`${classCtor.name} has ${deps.length} dependencies.`);
  deps.forEach((dep, index) => {
    resolved.push(resolveDependency(classCtor, dep, index));
  });
  return resolved;
}

function resolveDependency(classCtor: any, dep: any, index: number): any {
  logger.debug(`Resolving dependency ${index + 1}.`);
  checkIfDependencyDefined(dep);
  const depToken = getDepToken(classCtor, dep, index);
  const instantiatedClass = injectionCtx.findItemByToken(depToken).value;
  if (instantiatedClass) {
    logger.debug(`Already instantiated with token ${depToken}.`);
    return instantiatedClass;
  } else {
    logger.debug("Not instantiated, see if we can instantiate it now.");
    return makeClassInjectable(dep);
  }
}

function getDepToken(classCtor: any, dep: any, index: number): string {
  let depToken = Reflect.getMetadata(META_TOKEN, dep);
  const injParamMap: { [key: string]: string } =
    classCtor.prototype[INJ_PARAMS];
  if (!depToken) {
    if (!injParamMap) {
      throw new Error(
        "Unable to get token from metadata, can't find what to inject."
      );
    } else {
      depToken = injParamMap[index];
    }
  }
  return depToken;
}

function checkIfDependencyDefined(dep: any): void {
  if (dep === undefined) {
    throw new Error(
      "Dependency is undefined, this is usually due to circular dependencies. Check to make sure your classes aren't injecting each other."
    );
  }
}
