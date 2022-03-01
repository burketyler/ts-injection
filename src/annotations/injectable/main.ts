import { ClassRegistry } from "../../class-registry";
import { TAG_CLASS } from "../../constants";
import { RegisterOptions } from "../../injection-context";
import { Logger, LogNamespace } from "../../logger";
import { ClassMetadata, Newable } from "../../types";

const logger = new Logger(LogNamespace.INJECTABLE);

export function injectable<ClassType extends Newable>(
  ctor: ClassType,
  options: Partial<RegisterOptions> = {}
) {
  return Injectable(options);
}

export function Injectable<ClassType extends Newable>(
  options: Partial<RegisterOptions> = {}
) {
  return (ctor: ClassType): void => {
    logger.info(`Detected Injectable class ${ctor.name}.`);

    const { id } = ClassRegistry.register(ctor);

    if (!options.tags) {
      // eslint-disable-next-line no-param-reassign
      options.tags = [TAG_CLASS];
    }

    Reflect.defineMetadata(
      ClassMetadata.OPTIONS,
      options ?? { tags: [TAG_CLASS] },
      ctor
    );
    Reflect.defineMetadata(ClassMetadata.CLASS_ID, id, ctor);

    logger.debug(`Added class to ClassRegistry with ID: ${id}.`);
  };
}
