import { ClassRegistry } from "../../class-registry";
import { TSI_LOG_KEY } from "../../constants";
import { RegisterOptions } from "../../injection-container";
import { Logger, LogNamespace } from "../../logger";
import { ClassMetadata, InjectableTag, Newable } from "../../types";

const logger = new Logger(LogNamespace.INJECTABLE, TSI_LOG_KEY);

export function injectable<ClassType extends Newable>(
  ctor: ClassType,
  options: Partial<RegisterOptions> = {}
) {
  return Injectable(options)(ctor);
}

export function Injectable<ClassType extends Newable>(
  options: Partial<RegisterOptions> = {}
) {
  return (ctor: ClassType): void => {
    logger.info(`Detected Injectable class ${ctor.name}.`);

    const { id } = ClassRegistry.add(ctor);

    if (!options.tags) {
      // eslint-disable-next-line no-param-reassign
      options.tags = [InjectableTag.CLASS];
    }

    Reflect.defineMetadata(
      ClassMetadata.OPTIONS,
      options ?? { tags: [InjectableTag.CLASS] },
      ctor
    );
    Reflect.defineMetadata(ClassMetadata.CLASS_ID, id, ctor);

    logger.debug(`Added class to ClassRegistry with ID: ${id}.`);
  };
}
