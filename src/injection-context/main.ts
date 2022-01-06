import { AUTO_WIRE_LIST, META_TYPE } from "../constants";
import { Debugger } from "../debugger";
import { fail, success, Throwable } from "../throwable";
import { InjectableItem, Newable } from "../types";

import { InjectableNotFoundError } from "./types";

export class InjectionContext {
  private static readonly instance = new InjectionContext();

  private readonly items: InjectableItem<any>[];

  private readonly logger: Debugger;

  private tokenIndex: number;

  private constructor() {
    this.tokenIndex = 0;
    this.items = [];
    this.logger = Debugger.getInstance("InjectionContext");
  }

  public static getInstance(): InjectionContext {
    return this.instance;
  }

  public register(injectable: any): string {
    const token = this.getNextToken();

    this.addItem({
      token,
      instance: injectable,
    });
    this.processAutoWire(injectable);

    this.logger.debug(`Injectable with token ${token} registered.`);

    return token;
  }

  public registerWithToken<InjectableType>(
    injectable: InjectableType,
    token: string
  ): void {
    this.getItemByToken<InjectableType>(token)
      .onSuccess((existingItem) => {
        this.items[this.items.indexOf(existingItem)] = {
          ...existingItem,
          instance: injectable,
        };
      })
      .onError(() => {
        this.items.push({
          token,
          instance: injectable,
        });
      });

    this.logger.debug(`Injectable with token ${token} registered.`);
  }

  public doesItemExist(token: string): boolean {
    return this.items.some((inj) => inj.token === token);
  }

  /**
   * @deprecated please use getItemByToken instead
   */
  public findItemByToken(token: string): InjectableItem<any> | undefined {
    return this.items.find((inj) => inj.token === token);
  }

  public getItemByToken<InjectableType>(
    token: string
  ): Throwable<InjectableNotFoundError, InjectableItem<InjectableType>> {
    const item = this.items.find((inj) => inj.token === token);

    if (!item) {
      this.logger.debug(`Injectable with token ${token} not found.`);

      return fail(new InjectableNotFoundError());
    }

    return success(item);
  }

  public queryItemsByType<InjectableType>(type: string): InjectableType[] {
    return this.items
      .map((item) => item.instance)
      .filter((item) => {
        return Reflect.getMetadata(META_TYPE, item) === type;
      });
  }

  public addMetadataToItem(
    token: string,
    metaData: { [key: string]: unknown }
  ): void {
    const getItemResult = this.getItemByToken(token);

    getItemResult
      .onSuccess((item) => {
        Object.entries(metaData).forEach(([fieldName, value]) => {
          Reflect.defineMetadata(fieldName, value, item);
        });
      })
      .onError(() => {
        this.logger.debug(
          `Injectable with ${token} not found, can't add metadata.`
        );
      });
  }

  private addItem<InjectableType>(item: InjectableItem<InjectableType>): void {
    this.items.push(item);
  }

  private getNextToken(): string {
    this.tokenIndex += 1;

    return this.tokenIndex.toString();
  }

  private processAutoWire(injectable: Newable): void {
    this.logger.debug("Processing AutoWire rules.");

    const rules: { [key: string]: string } =
      injectable.constructor.prototype[AUTO_WIRE_LIST] ?? [];

    Object.entries(rules).forEach(([member, token]) => {
      this.logger.debug(`Injecting token ${token} into ${member} field.`);

      this.getItemByToken(token)
        .onSuccess(({ instance }) => {
          (injectable as any)[member] = instance; // eslint-disable-line no-param-reassign
        })
        .onError((error) => {
          throw error;
        });
    });
  }
}
