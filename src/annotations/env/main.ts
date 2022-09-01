import { PRIMITIVE_TYPES, TSI_LOG_KEY } from "../../constants";
import { Logger, LogNamespace, LogLevel } from "../../logger";

import { EnvironmentVariableError, EnvVarOptions } from "./types";

const logger = new Logger(LogNamespace.ENV, TSI_LOG_KEY);

export function Env<VariableType>(
  varName: string,
  options?: EnvVarOptions<VariableType>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (classCtor: any, fieldName: string) => {
    validate();

    logger.info(
      `Injecting environment var '${varName}' into ${classCtor.constructor.name}'s property '${fieldName}'.`
    );

    const type = Reflect.getMetadata("design:type", classCtor, fieldName);

    // eslint-disable-next-line no-param-reassign
    classCtor[fieldName as keyof unknown] = getEnvVar(varName, options, type);
  };
}

export function env<VariableType>(
  varName: string,
  options?: EnvVarOptions<VariableType>
): VariableType | undefined {
  validate();

  return getEnvVar(varName, options);
}

export function envRequired<VariableType>(
  varName: string,
  options?: Omit<EnvVarOptions<VariableType>, "default" | "failBehaviour">
): VariableType | undefined {
  validate();

  return getEnvVar(varName, { ...options, failBehaviour: "THROW" });
}

export function envOptional<VariableType>(
  varName: string,
  options?: Omit<EnvVarOptions<VariableType>, "default" | "failBehaviour">
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
  { mapper, failBehaviour }: EnvVarOptions<VariableType> = {},
  type?: () => VariableType
): VariableType | undefined {
  const envVar = process.env[varName];

  if (!envVar) {
    const errMsg = `Environment variable '${varName}' is undefined.`;

    if (failBehaviour !== "SILENT") {
      logger.log(LogLevel.WARN, errMsg);
    }

    if (failBehaviour === "THROW") {
      throw new EnvironmentVariableError(errMsg);
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
