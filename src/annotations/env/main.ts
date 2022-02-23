import { PRIMITIVE_TYPES } from "../../constants";
import { Debugger } from "../../debugger";
import { Newable } from "../../types";

import { Options, EnvironmentVariableError } from "./types";

const logger: Debugger = Debugger.getInstance("Env");

export function Env<VariableType>(
  varName: string,
  options?: Options<VariableType>
) {
  return (classCtor: Newable, fieldName: string) => {
    validate();

    logger.debug(
      `Injecting env var ${varName} into ${classCtor.constructor.name}.${fieldName}`
    );

    const type = Reflect.getMetadata("design:type", classCtor, fieldName);
    const variable = getEnvVar(varName, options, type);

    // eslint-disable-next-line no-param-reassign
    classCtor[fieldName as keyof Newable] = variable as never;
  };
}

export function env<VariableType>(
  varName: string,
  options?: Options<VariableType>
): VariableType | undefined {
  validate();

  return getEnvVar(varName, options);
}

export function envRequired<VariableType>(
  varName: string,
  options?: Omit<Options<VariableType>, "default" | "failBehaviour">
): VariableType | undefined {
  validate();

  return getEnvVar(varName, { ...options, failBehaviour: "THROW" });
}

export function envOptional<VariableType>(
  varName: string,
  options?: Omit<Options<VariableType>, "default" | "failBehaviour">
): VariableType | undefined {
  validate();

  return getEnvVar(varName, { ...options, failBehaviour: "SILENT" });
}

function validate(): void {
  if (!process || !process.env) {
    throw new EnvironmentVariableError(
      "Invalid runtime, process or process.env is undefined."
    );
  }
}

function getEnvVar<VariableType>(
  varName: string,
  { mapper, failBehaviour }: Options<VariableType> = {},
  type?: () => VariableType
): VariableType | undefined {
  const envVar = process.env[varName];

  if (!envVar) {
    const message = `Environment variable '${varName}' is undefined.`;

    if (failBehaviour !== "SILENT") {
      console.warn(message); // eslint-disable-line no-console
    }

    if (failBehaviour === "THROW") {
      throw new EnvironmentVariableError(message);
    }

    return undefined;
  }

  logger.debug(`Variable resolved to ${envVar}.`);

  if (mapper) {
    logger.debug("Using provided mapper to parse.");
    return mapper(envVar) as VariableType;
  }

  logger.debug(`Using inferred type ${type} to parse.`);

  return (
    type ? parseEnvVarByInferredType(type, envVar) : envVar
  ) as VariableType;
}

function parseEnvVarByInferredType<VariableType>(
  type: () => VariableType,
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
