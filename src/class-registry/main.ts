import { Logger, LogNamespace } from "../logger";
import { success, fail, Throwable } from "../throwable";
import { Newable } from "../types";

import { ClassItem, ClassNotFoundError } from "./types";

export class ClassRegistry {
  private static readonly logger = new Logger(LogNamespace.CLASS_REGISTRY);

  private static readonly items: ClassItem[] = [];

  private static idCursor = 0;

  public static register(ctor: Newable): ClassItem {
    this.logger.info(`Registering class ${ctor.name}.`);

    const newItem = { ctor, id: this.getNextId() };
    this.items.push(newItem);

    return newItem;
  }

  public static list(): ClassItem[] {
    return this.items;
  }

  public static get(ctor: Newable): Throwable<ClassNotFoundError, ClassItem> {
    const foundItem = this.items.find((item) => item.ctor === ctor);

    return foundItem ? success(foundItem) : fail(new ClassNotFoundError());
  }

  public static getById(id: string): Throwable<ClassNotFoundError, ClassItem> {
    const foundItem = this.items.find((item) => item.id === id);

    if (!foundItem) {
      return fail(new ClassNotFoundError(`Class ${id} not found.`));
    }

    return success(foundItem);
  }

  private static getNextId(): string {
    this.idCursor += 1;

    return `cls_${this.idCursor}`;
  }
}
