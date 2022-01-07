import { PARAM_LIST, META_PARAMS, META_TOKEN } from "../../constants";
import { useDebugger } from "../../debugger";
import { useInjectionContext } from "../../injection-context";
import { fail, success, Throwable } from "../../throwable";
import { Newable, InjectionError, InjectableItem } from "../../types";

import { InjectableParamMap } from "./types";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Injectable");

export function makeClassInjectable<ClassType extends Newable>(
  classCtor: ClassType
): Throwable<InjectionError, InjectableItem<InstanceType<ClassType>>> {
  try {
    logger.debug(`Making injectable instance of class ${classCtor.name}.`);

    const existingToken = Reflect.getMetadata(META_TOKEN, classCtor);
    const dependencyList = Reflect.getMetadata(META_PARAMS, classCtor);

    if (existingToken) {
      logger.debug("Class already instantiated, returning existing instance.");

      const getItemResult =
        injectionCtx.getItemByToken<InstanceType<ClassType>>(existingToken);

      if (getItemResult.isSuccess()) {
        return success(getItemResult.value());
      }

      throw getItemResult.value();
    }

    if (!dependencyList) {
      logger.debug("Dependency is a primitive or has no constructor.");
    }

    return success(
      addClassToInjectionCtx(
        classCtor,
        processDependencies(classCtor, dependencyList ?? [])
      )
    );
  } catch (error) {
    logger.debug(error);

    return fail(
      new InjectionError(
        `Unable to make injectable instance of ${classCtor.name}.`
      )
    );
  }
}

function addClassToInjectionCtx<ClassType extends Newable>(
  ClassCtor: ClassType,
  resolvedDeps: unknown[]
): InjectableItem<InstanceType<ClassType>> {
  let instance;

  try {
    instance = new ClassCtor(...resolvedDeps);
  } catch (e) {
    throw new InjectionError(`Error calling class constructor: ${e.message}.`);
  }

  const token: string = injectionCtx.register(instance);
  Reflect.defineMetadata(META_TOKEN, token, ClassCtor);

  return { token, instance };
}

function processDependencies(
  classCtor: Newable,
  dependencies: unknown[]
): unknown[] {
  logger.debug(`${classCtor.name} has ${dependencies.length} dependencies.`);

  const resolved: unknown[] = [];

  dependencies.forEach((dep, index) => {
    resolved.push(resolveDependency(classCtor, dep, index));
  });

  return resolved;
}

function resolveDependency(
  classCtor: Newable,
  dependency: unknown,
  index: number
): unknown {
  logger.debug(`Resolving dependency ${index + 1}.`);

  if (dependency === undefined) {
    throw new InjectionError(
      "Dependency is undefined, this is usually due to circular dependencies. Read docs for further information."
    );
  }

  const getItemResult = injectionCtx.getItemByToken(
    getTokenForDependency(classCtor, dependency, index)
  );

  if (getItemResult.isSuccess()) {
    const { instance, token } = getItemResult.value();

    logger.debug(`Already instantiated with token ${token}.`);

    return instance;
  }

  logger.debug("Not instantiated, see if we can instantiate it now.");

  const makeInjectableResult = makeClassInjectable(dependency as Newable);

  if (makeInjectableResult.isSuccess()) {
    return makeInjectableResult.value();
  }

  throw makeInjectableResult.value();
}

function getTokenForDependency(
  classCtor: Newable,
  dependency: unknown,
  index: number
): string {
  const token = Reflect.getMetadata(META_TOKEN, dependency as Object);
  const paramMap: InjectableParamMap = classCtor.prototype[PARAM_LIST];

  if (token) {
    return token;
  }

  if (!paramMap) {
    throw new InjectionError(
      "Unable to get token from metadata, can't find what to inject."
    );
  }

  return paramMap[index];
}
