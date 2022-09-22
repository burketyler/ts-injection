import { TSI_LOG_KEY } from "../constants";
import { RegisterOptions } from "../injection-container";
import { Logger, LogNamespace } from "../logger";
import { fail, success, Throwable } from "../throwable";
import { InjectableItem, Newable } from "../types";
import { isNewable } from "../utils";

export class InjectableRepo {
  private readonly items: InjectableItem<any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any

  private readonly logger: Logger;

  private tokenCursor: number;

  constructor() {
    this.items = [];
    this.tokenCursor = 0;
    this.logger = new Logger(LogNamespace.INJECTABLE_REPO, TSI_LOG_KEY);
  }

  public doesItemExist(token: string): boolean;
  public doesItemExist(ctor: Newable): boolean;
  public doesItemExist(tokenOrCtor: string | Newable): boolean;
  public doesItemExist(tokenOrCtor: string | Newable): boolean {
    return !!this.getItem(tokenOrCtor);
  }

  public getItem<ItemType>(token: string): InjectableItem<ItemType> | undefined;
  public getItem<ItemType>(ctor: Newable): InjectableItem<ItemType> | undefined;
  public getItem<ItemType>(
    tokenOrCtor: string | Newable
  ): InjectableItem<ItemType> | undefined;
  public getItem<ItemType>(
    tokenOrCtor: string | Newable
  ): InjectableItem<ItemType> | undefined {
    return this.items.find(
      (inj) =>
        inj.instance.constructor === tokenOrCtor ||
        inj.token === this.createToken(tokenOrCtor as string)
    );
  }

  public getItemsByTag<ItemType>(tag: string): InjectableItem<ItemType>[] {
    return this.items.filter((item) => item.tags?.some((_tag) => _tag === tag));
  }

  public addTagsToItem(
    tokenOrCtor: string | Newable,
    ...tags: string[]
  ): Throwable<"NOT_FOUND", void> {
    this.logger.debug(
      `Adding tags to item ${
        isNewable(tokenOrCtor) ? tokenOrCtor.name : tokenOrCtor
      }.`,
      ...tags
    );

    const item = this.getItem(tokenOrCtor);

    if (!item) {
      return fail("NOT_FOUND");
    }

    item.tags = item.tags ?? []; // eslint-disable-line no-param-reassign
    item.tags.push(...tags);

    return success(undefined);
  }

  public saveItem<ItemType>(
    injectable: ItemType,
    options: RegisterOptions,
    token?: string
  ): InjectableItem<ItemType> {
    this.logger.info("Saving injectable in context.");

    const existingItem = token
      ? this.getItem<ItemType>(token)
      : this.getItem<ItemType>(injectable as unknown as Newable);

    if (existingItem) {
      this.logger.debug("Existing instance found, updating existing item.");

      return this.replaceItem(
        {
          ...existingItem,
          ...options,
          token: existingItem.token,
          instance: injectable,
        },
        existingItem
      ) as InjectableItem<ItemType>;
    }

    this.logger.debug("No instance found, creating new item.");

    return this.addItem({
      ...options,
      token: this.createToken(token ?? this.getNextCursor()),
      instance: injectable,
    }) as InjectableItem<ItemType>;
  }

  public removeItem(tokenOrCtor: string | Newable): void {
    const existingItem = this.getItem(tokenOrCtor);

    if (existingItem) {
      this.logger.info("Removing injectable from context.");
      this.items.splice(this.items.indexOf(existingItem), 1);
    } else {
      this.logger.debug("No instance found, nothing to remove.");
    }
  }

  private addItem(item: InjectableItem<unknown>): InjectableItem<unknown> {
    this.items.push(item);

    return item;
  }

  private replaceItem(
    newItem: InjectableItem<unknown>,
    existingItem: InjectableItem<unknown>
  ): InjectableItem<unknown> {
    this.items[this.items.indexOf(existingItem)] = newItem;

    return newItem;
  }

  private getNextCursor(): string {
    this.tokenCursor += 1;

    return this.tokenCursor.toString();
  }

  private createToken(token: string): string {
    return `tkn_${token}`;
  }
}
