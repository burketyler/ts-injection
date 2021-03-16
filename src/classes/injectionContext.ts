import { Debugger } from "./debugger";
import { AutoWireRuleModel } from "../domain/model/autoWireRule.model";
import { InjectableItemModel } from "../domain/model/injectableItem.model";
import { META_TYPE } from "../domain/metaAttribs.const";

export class InjectionContext {
  private static readonly instance = new InjectionContext();
  private tokenIndex: number = 0;
  private items: InjectableItemModel<any>[] = [];
  private autoWires: AutoWireRuleModel[] = [];
  private logger: Debugger;

  constructor() {
    this.logger = Debugger.getInstance("InjectionContext");
  }

  public static getInstance(): InjectionContext {
    return this.instance;
  }

  public registerWithToken(injectable: any, token: string): void {
    this.overWriteItem(
      this.findItemByToken(token),
      InjectionContext.buildItem(token, injectable)
    );
    this.logger.debug(`Injectable with token ${token} registered.`);
  }

  public register(injectable: any): string {
    const token = this.getNextToken();
    this.addItem(InjectionContext.buildItem(token, injectable));
    this.processAutoWire(token);
    this.logger.debug(`Injectable with token ${token} registered.`);
    return token;
  }

  public isTokenInItems(token: string): boolean {
    return this.items.some((inj) => inj.token === token);
  }

  public retrieveByToken(token: string): any {
    const item = this.findItemByToken(token);
    if (item) {
      return item.value;
    } else {
      throw new Error(`Injectable with token ${token} does not exist.`);
    }
  }

  public queryByType(type: string): any[] {
    return this.items
      .map((item) => item.value)
      .filter((item) => {
        return Reflect.getMetadata(META_TYPE, item) === type;
      });
  }

  public findItemByToken(token: string): InjectableItemModel<any> | undefined {
    return this.items.find((inj) => inj.token === token);
  }

  public addAutoWire(rule: AutoWireRuleModel): void {
    this.autoWires.push(rule);
  }

  public addMetadataToItem(
    token: string,
    metaData: { [key: string]: any }
  ): void {
    const item = this.retrieveByToken(token);
    Object.entries(metaData).forEach((md) => {
      Reflect.defineMetadata(md[0], md[1], item);
    });
  }

  private static buildItem<T>(token: string, value: T): InjectableItemModel<T> {
    return {
      token,
      value,
    };
  }

  private addItem(item: InjectableItemModel<any>): void {
    this.items.push(item);
  }

  private getNextToken(): string {
    return `${this.tokenIndex++}`;
  }

  private processAutoWire(token: string): void {
    this.logger.debug(`Processing AutoWire callbacks.`);
    this.getAutoWireRulesForToken(token).forEach(this.executeAutoWireRule);
  }

  private getAutoWireRulesForToken(token: string): AutoWireRuleModel[] {
    return this.autoWires.filter((rule) => rule.token === token) || [];
  }

  private executeAutoWireRule(cb: AutoWireRuleModel): void {
    this.logger.debug(
      `Injecting ${cb.token} into ${cb.class.constructor.name}.${cb.member}.`
    );
    cb.class[cb.member] = this.retrieveByToken(cb.token);
  }

  private overWriteItem(item: any, newItem: any): void {
    const indexOf = this.items.indexOf(item);
    if (indexOf !== -1) {
      this.items[indexOf] = newItem;
    } else {
      this.items.push(newItem);
    }
  }
}
