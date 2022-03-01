/* eslint-disable no-param-reassign */

import { ClassRegistry } from "../class-registry";
import {
  AUTO_WIRE_LIST,
  ERROR_LINK_CIRC_DEP,
  TAG_CLASS,
  TAG_OBJECT,
} from "../constants";
import { InjectableNotFoundError, InjectableRepo } from "../injectable-repo";
import { Logger, LogNamespace } from "../logger";
import { fail, success, Throwable } from "../throwable";
import {
  ClassMetadata,
  InjectableItem,
  InjectionError,
  Newable,
} from "../types";
import { isClass, isNewable } from "../utils";

import { RegisterOptions } from "./types";

export class InjectionContext {
  public readonly repo: InjectableRepo;

  private readonly logger: Logger;

  private readonly name: string;

  private isInitialized: boolean;

  constructor(
    name: string,
    options?: {
      isManualInit?: boolean;
    }
  ) {
    this.logger = new Logger(LogNamespace.INJECTION_CONTEXT);
    this.logger.info(`Creating new InjectionContext: ${name}.`);
    this.repo = new InjectableRepo();
    this.isInitialized = false;
    this.name = name;

    if (!options?.isManualInit) {
      this.initialize();
    }
  }

  public initialize(): void {
    if (this.isInitialized) {
      this.logger.warn("Context already initialized.");
      return;
    }

    this.logger.info("Initializing items from ClassRegistry.");

    ClassRegistry.list().forEach(({ ctor }) => {
      this.logger.debug(`Initializing class ${ctor.name}.`);

      const options: RegisterOptions = Reflect.getMetadata(
        ClassMetadata.OPTIONS,
        ctor
      );

      this.instantiateClass(ctor)
        .onSuccess((instance) => {
          this.register(instance, options);
        })
        .onError((error) => {
          throw error;
        });
    });

    this.isInitialized = true;
  }

  public register<InjectableType>(
    injectable: InjectableType,
    token?: string
  ): InjectableItem<InjectableType>;
  public register<InjectableType>(
    injectable: InjectableType,
    options: RegisterOptions
  ): InjectableItem<InjectableType>;
  public register<InjectableType>(
    injectable: InjectableType,
    optionsOrToken: RegisterOptions | string | undefined
  ): InjectableItem<InjectableType> {
    let token: string | undefined;
    let options: RegisterOptions;
    const inputIsClass = isClass(injectable);
    const defaultOptions = { tags: [inputIsClass ? TAG_CLASS : TAG_OBJECT] };

    this.logger.info(
      "Registering injectable.",
      inputIsClass ? injectable.constructor?.name : injectable
    );

    if (typeof optionsOrToken === "string") {
      token = optionsOrToken;
      options = defaultOptions;
    } else if (optionsOrToken?.token) {
      token = optionsOrToken.token;
      options = optionsOrToken ?? defaultOptions;
    } else {
      options = optionsOrToken ?? defaultOptions;
    }

    const item = this.repo.saveItem(injectable, options, token);

    this.logger.debug(`Injectable registered with token: ${item.token}.`);

    return item as InjectableItem<InjectableType>;
  }

  public resolve<InjectableType>(token: string): InjectableType;
  public resolve<ClassType extends Newable>(
    ctor: ClassType
  ): InstanceType<ClassType>;
  public resolve<InjectableType extends Newable>(
    tokenOrCtor: string | InjectableType
  ): InjectableType {
    this.logger.info(
      "Resolving injectable.",
      isNewable(tokenOrCtor) ? tokenOrCtor.name : tokenOrCtor
    );

    if (!this.isInitialized) {
      this.logger.warn("Context has no items, have you initialized?");
    }

    const getResult = isNewable(tokenOrCtor)
      ? this.repo.getItem(tokenOrCtor)
      : this.repo.getItem(tokenOrCtor);

    return getResult
      .onSuccess(({ instance }) => instance as InjectableType)
      .onError((error) => {
        throw error;
      })
      .output();
  }

  private instantiateClass<ClassType extends Newable>(
    _Newable: ClassType
  ): Throwable<InjectionError, InjectableItem<InstanceType<ClassType>>> {
    try {
      this.logger.info(`Making instance of class ${_Newable.name}.`);

      const dependencyList =
        Reflect.getMetadata(ClassMetadata.PARAMS, _Newable) ?? [];

      if (!dependencyList[0]) {
        this.logger.debug("Dependency is a primitive or has no constructor.");
      }

      const instance = new _Newable(
        ...this.instantiateDependencies(_Newable, dependencyList)
      );

      this.processAutowires(instance);

      return success(instance);
    } catch (error) {
      this.logger.debug(error);

      return fail(
        new InjectionError(`Error while instantiating class ${_Newable.name}.`)
      );
    }
  }

  private instantiateDependencies(
    newable: Newable,
    dependencies: Newable[]
  ): unknown[] {
    const resolved: unknown[] = [];

    this.logger.debug(
      `${newable.name} has ${dependencies.length} dependencies.`
    );

    dependencies.forEach((depCtor, index) => {
      this.logger.debug(`Resolving dependency ${index + 1}: ${depCtor?.name}.`);

      if (depCtor === undefined) {
        this.logger.error(
          "Circular dependency detected, cannot instantiate dependency.",
          { read_more: ERROR_LINK_CIRC_DEP }
        );
      }

      const getItemResult = this.repo.getItem(depCtor);

      if (getItemResult.isSuccess()) {
        const { instance, token, isTransient } = getItemResult.value();

        if (isTransient) {
          this.logger.debug(
            `${depCtor.name} is transient, creating new instance.`
          );
        } else {
          this.logger.debug(
            `${depCtor.name} instance exists with token ${token}.`
          );
          resolved.push(instance);
        }
      } else {
        this.logger.debug(`Creating new instance of ${depCtor.name}.`);

        this.instantiateClass(depCtor)
          .onSuccess(({ instance }) => {
            resolved.push(instance);
          })
          .onError((error) => {
            throw error;
          })
          .output();
      }
    });

    return resolved;
  }

  private processAutowires(newable: Newable): void {
    const { constructor: ctor } = newable;

    const rules = Object.entries(ctor.prototype[AUTO_WIRE_LIST] ?? {});

    this.logger.info(`${ctor.name} has ${rules.length} Autowire rules.`);

    rules.forEach(([fieldName, tokenOrClassId], index) => {
      let item: InjectableItem<unknown> | undefined;

      this.logger.info(`Processing rule ${index + 1}.`);

      const isClassId = tokenOrClassId.match(/^cls_.*/i);

      if (isClassId) {
        this.logger.debug(
          `Token is a classId, get ${tokenOrClassId} from ClassRegistry.`
        );

        ClassRegistry.getById(tokenOrClassId).onSuccess((classItem) => {
          this.repo.getItem(classItem.ctor).onSuccess((injItem) => {
            item = injItem;
          });
        });
      } else {
        this.logger.debug(`Getting token ${tokenOrClassId} from context`);

        this.repo.getItem(tokenOrClassId).onSuccess((injItem) => {
          item = injItem;
        });
      }

      if (!item) {
        throw new InjectableNotFoundError(
          `Injectable ${tokenOrClassId} not found.`
        );
      }

      this.logger.info(
        `Injecting token ${item.token} into prop '${fieldName}'.`
      );

      newable[fieldName as keyof Newable] = item.instance as never;
    });
  }
}
