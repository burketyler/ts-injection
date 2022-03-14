import { Logger, LogNamespace } from "../logger";
import { ClassDef, Newable } from "../types";

import { ClassItem } from "./types";

export class ClassRegistry {
  private static readonly logger = new Logger(LogNamespace.CLASS_REGISTRY);

  private static readonly items: ClassItem[] = [];

  private static idCursor = 0;

  public static add(Class: Newable): ClassItem {
    this.logger.info(`Adding class ${Class.name}.`);

    const newItem = { Class, id: this.getNextId() };
    this.items.push(newItem);

    return newItem;
  }

  public static list(): ClassItem[] {
    return this.items;
  }

  public static get(Class: ClassDef): ClassItem | undefined {
    return this.items.find((item) => item.Class === Class);
  }

  public static getById(id: string): ClassItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  private static getNextId(): string {
    this.idCursor += 1;

    return `cls_${this.idCursor}`;
  }
}
