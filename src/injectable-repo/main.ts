import { RegisterOptions } from "../injection-context";
import { Logger, LogNamespace } from "../logger";
import { fail, success, Throwable } from "../throwable";
import { InjectableItem, Newable } from "../types";
import { isNewable } from "../utils";

import { InjectableNotFoundError } from "./types";

export class InjectableRepo {
  private readonly items: InjectableItem<any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any

  private readonly logger: Logger;

  private tokenCursor: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor() {
    this.items = [];
    this.tokenCursor = 0;
    this.logger = new Logger(LogNamespace.INJECTABLE_REPO);
  }

  public doesItemExist(token: string): boolean;
  public doesItemExist(ctor: Newable): boolean;
  public doesItemExist(tokenOrCtor: string | Newable): boolean {
    const getResult = isNewable(tokenOrCtor)
      ? this.getItem(tokenOrCtor)
      : this.getItem(tokenOrCtor);

    return getResult
      .onSuccess(() => true)
      .onError(() => false)
      .output();
  }

  public getItem<ItemType>(
    token: string
  ): Throwable<InjectableNotFoundError, InjectableItem<ItemType>>;
  public getItem<ItemType>(
    ctor: Newable
  ): Throwable<InjectableNotFoundError, InjectableItem<ItemType>>;
  public getItem<ItemType>(
    tokenOrCtor: string | Newable
  ): Throwable<InjectableNotFoundError, InjectableItem<ItemType>> {
    this.logger.debug(
      "Getting item.",
      isNewable(tokenOrCtor) ? tokenOrCtor.name : tokenOrCtor
    );

    const item = this.items.find(
      (inj) =>
        inj.instance.constructor === tokenOrCtor ||
        inj.token === this.createToken(tokenOrCtor as string)
    );

    if (!item) {
      return fail(
        new InjectableNotFoundError(
          `Item ${
            isNewable(tokenOrCtor) ? tokenOrCtor.name : tokenOrCtor
          } not found.`
        )
      );
    }

    return success(item);
  }

  public getItemsByTag<ItemType>(tag: string): InjectableItem<ItemType>[] {
    return this.items.filter((item) => item.tags?.some((_tag) => _tag === tag));
  }

  public addTagsToItem(tokenOrCtor: string | Newable, ...tags: string[]): void {
    this.logger.debug(
      `Adding tags to item ${
        isNewable(tokenOrCtor) ? tokenOrCtor.name : tokenOrCtor
      }.`,
      ...tags
    );

    const getResult = isNewable(tokenOrCtor)
      ? this.getItem(tokenOrCtor)
      : this.getItem(tokenOrCtor);

    getResult
      .onSuccess((item) => {
        item.tags = item.tags ?? []; // eslint-disable-line no-param-reassign
        item.tags.push(...tags);
      })
      .onError((error) => {
        throw error;
      });
  }

  public saveItem<ItemType>(
    injectable: ItemType,
    options: RegisterOptions,
    token?: string
  ): InjectableItem<ItemType> {
    this.logger.info("Saving injectable in context.");

    const getResult = token
      ? this.getItem<ItemType>(token)
      : this.getItem<ItemType>(injectable as unknown as Newable);

    return getResult
      .onSuccess((existingItem) => {
        this.logger.debug("Existing instance found, updating existing item.");

        return this.replaceItem(
          {
            ...existingItem,
            ...options,
            token: existingItem.token,
            instance: injectable,
          },
          existingItem
        );
      })
      .onError(() => {
        this.logger.debug("No instance found, creating new item.");

        return this.addItem({
          ...options,
          token: this.createToken(token ?? this.getNextCursor()),
          instance: injectable,
        });
      })
      .output() as InjectableItem<ItemType>;
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
