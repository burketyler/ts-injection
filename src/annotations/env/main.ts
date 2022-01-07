import { PRIMITIVE_TYPES } from "../../constants";
import { Debugger } from "../../debugger";
import { Newable } from "../../types";

import { Options, EnvironmentVariableError } from "./types";

const logger: Debugger = Debugger.getInstance("Env");

export function Env<VariableType>(
  varName: string,
  options: Options<VariableType>
) {
  if (!process || !process.env) {
    throw new EnvironmentVariableError(
      "Invalid runtime, process or process.env is undefined."
    );
  }

  return (classCtor: Newable, fieldName: string) => {
    const type = Reflect.getMetadata("design:type", classCtor, fieldName);

    logger.debug(
      `Injecting env var ${varName} into ${classCtor.constructor.name}.${fieldName}`
    );

    injectIntoField(
      type,
      classCtor,
      varName,
      fieldName,
      process.env[varName],
      options
    );
  };
}

function injectIntoField(
  type: () => unknown,
  classCtor: Newable,
  varName: string,
  fieldName: string,
  envVar: string | undefined,
  { mapper, failBehaviour }: Options<unknown>
): void {
  if (!envVar) {
    const message = `Environment variable '${varName}' is undefined.`;
    console.warn(message); // eslint-disable-line no-console

    if (failBehaviour === "THROW") {
      throw new EnvironmentVariableError(message);
    }

    return;
  }

  logger.debug(`Variable resolved to ${envVar}.`);

  if (mapper) {
    logger.debug("Using provided mapper to parse.");
    classCtor[fieldName as keyof Newable] = mapper(envVar) as never; // eslint-disable-line no-param-reassign
  } else {
    logger.debug(`Using inferred type ${type} to parse.`);
    // eslint-disable-next-line no-param-reassign
    classCtor[fieldName as keyof Newable] = parseEnvVarByInferredType(
      type,
      envVar
    ) as never;
  }
}

function parseEnvVarByInferredType(
  type: () => unknown,
  envVar: string
): number | boolean | Record<string, unknown> | string {
  const { NUMBER, BOOLEAN, OBJECT } = PRIMITIVE_TYPES;

  switch (type) {
    case NUMBER:
      return Number(envVar);
    case BOOLEAN:
      return envVar === "true";
    case OBJECT:
      return JSON.parse(envVar);
    default:
      return envVar;
  }
}
