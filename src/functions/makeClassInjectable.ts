import { useInjectionContext } from "./useInjectionContext";
import { useDebugger } from "./useDebugger";
import { META_PARAMS, META_TOKEN } from "../domain/metaAttribs.const";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Injectable");

export function makeClassInjectable<T extends new (...args: any[]) => {}>(
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
      processDependencies(classCtor.name, depList)
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

function processDependencies(className: string, deps: any[]): any[] {
  const resolved: any[] = [];
  logger.debug(`${className} has ${deps.length} dependencies.`);
  deps.forEach((dep, index) => {
    resolved.push(resolveDependency(dep, index));
  });
  return resolved;
}

function resolveDependency(dep: any, index: number): any {
  logger.debug(`Resolving dependency ${index + 1}.`);
  checkIfDependencyDefined(dep);
  const depToken = Reflect.getMetadata(META_TOKEN, dep);
  const instantiatedClass = injectionCtx.findItemByToken(depToken).value;
  if (instantiatedClass) {
    logger.debug(`Already instantiated with token ${depToken}.`);
    return instantiatedClass;
  } else {
    logger.debug("Not instantiated, see if we can instantiate it now.");
    return makeClassInjectable(dep);
  }
}

function checkIfDependencyDefined(dep: any): void {
  if (dep === undefined) {
    throw new Error(
      "Dependency is undefined, this is usually due to circular dependencies. Check to make sure your classes aren't injecting each other."
    );
  }
}
