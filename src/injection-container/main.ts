/* eslint-disable no-param-reassign */

import { ClassRegistry } from "../class-registry";
import { AUTO_WIRE_LIST } from "../constants";
import { InjectableRepo } from "../injectable-repo";
import { Logger, LogNamespace } from "../logger";
import { fail, success, Throwable } from "../throwable";
import {
  ClassMetadata,
  ClassDef,
  InjectableClass,
  InjectableItem,
  InjectableTag,
  InjectionError,
  Newable,
} from "../types";
import { isClassDef, isNewable } from "../utils";

import { InjectionContainerOptions, RegisterOptions } from "./types";
import { generateInstanceName } from "./utils";

export class InjectionContainer {
  public readonly repo: InjectableRepo;

  private readonly logger: Logger;

  private readonly name: string;

  private isInitialized: boolean;

  constructor();
  constructor(name: string);
  constructor(options: InjectionContainerOptions);
  constructor(name: string, options?: InjectionContainerOptions);
  constructor(
    nameOrOptions?: string | InjectionContainerOptions,
    options?: InjectionContainerOptions
  ) {
    if (typeof nameOrOptions === "string") {
      this.name = nameOrOptions;
    } else {
      this.name = generateInstanceName();
    }

    this.logger = new Logger(LogNamespace.INJECTION_CONTAINER);
    this.repo = new InjectableRepo();
    this.isInitialized = false;
    this.logger.info(`Creating new InjectionContext: ${this.name}.`);

    if (
      !options?.isManualInit &&
      !(nameOrOptions as InjectionContainerOptions)?.isManualInit
    ) {
      this.initialize();
    }
  }

  public initialize(): void {
    if (this.isInitialized) {
      this.logger.warn("Context already initialized.");
      return;
    }

    this.logger.info("Initializing items from ClassRegistry.");

    ClassRegistry.list().forEach(({ Class }) => {
      this.logger.debug(`Initializing class ${Class.name}.`);

      const options: RegisterOptions = Reflect.getMetadata(
        ClassMetadata.OPTIONS,
        Class
      );

      this.instantiateClass(Class)
        .onSuccess((instance) => {
          this.register(instance, options);
        })
        .onError((error) => {
          throw error;
        });
    });

    this.isInitialized = true;
  }

  public register<InjectableType extends Newable>(
    _class: InjectableType,
    token?: string
  ): Throwable<InjectionError, InjectableItem<InstanceType<InjectableType>>>;
  public register<InjectableType>(
    object: InjectableType,
    token?: string
  ): Throwable<InjectionError, InjectableItem<InjectableType>>;
  public register<InjectableType extends Newable>(
    _class: InjectableType,
    options: RegisterOptions
  ): Throwable<InjectionError, InjectableItem<InstanceType<InjectableType>>>;
  public register<InjectableType>(
    object: InjectableType,
    options: RegisterOptions
  ): Throwable<InjectionError, InjectableItem<InjectableType>>;
  public register<InjectableType>(
    classOrObject: InjectableType,
    optionsOrToken: RegisterOptions | string | undefined
  ): Throwable<InjectionError, InjectableItem<InjectableType>> {
    let token: string | undefined;
    let options: RegisterOptions | undefined;

    try {
      if (typeof optionsOrToken === "string") {
        token = optionsOrToken;
      } else if (optionsOrToken?.token) {
        token = optionsOrToken.token;
        options = optionsOrToken;
      }

      return success(
        isNewable(classOrObject)
          ? this.registerClass(classOrObject, token, options)
          : this.registerObject(classOrObject, token, options)
      );
    } catch (error) {
      this.logger.error("Error registering injectable.", error);

      return fail(error);
    }
  }

  public resolve<InjectableType>(token: string): InjectableType | undefined;
  public resolve<ClassType extends Newable>(
    ctor: ClassType
  ): InstanceType<ClassType> | undefined;
  public resolve<InjectableType extends Newable>(
    tokenOrClass: string | InjectableType
  ): InjectableType | undefined {
    this.logger.info(
      "Resolving injectable.",
      isClassDef(tokenOrClass) ? tokenOrClass.name : tokenOrClass
    );

    if (!this.isInitialized) {
      this.logger.warn("Context has no items, have you initialized?");
    }

    return this.repo.getItem(tokenOrClass)?.instance as InjectableType;
  }

  private registerObject(
    obj: unknown,
    token: string | undefined,
    options: RegisterOptions = { tags: [InjectableTag.OBJECT] }
  ): InjectableItem<unknown> {
    this.logger.info("Registering object.");

    const item = this.repo.saveItem(obj, options, token);

    this.logger.debug(`Injectable registered with token: ${item.token}.`);

    return item;
  }

  private registerClass(
    newable: Newable,
    token: string | undefined,
    options: RegisterOptions = { tags: [InjectableTag.CLASS] }
  ): InjectableItem<InstanceType<Newable>> {
    let Class: ClassDef;

    if (isClassDef(newable)) {
      Class = newable;
    } else {
      Class = (newable as Newable).constructor as ClassDef;
    }

    this.logger.info("Registering class.", { name: Class.name });

    const instance = this.instantiateClass(Class).successOrThrow();

    const item = this.repo.saveItem(instance, options, token);

    this.logger.debug(`Injectable registered with token: ${item.token}.`);

    return item;
  }

  private instantiateClass<ClassType extends ClassDef>(
    Class: ClassType
  ): Throwable<InjectionError, InstanceType<ClassType>> {
    try {
      this.logger.info(`Making instance of class ${Class.name}.`);

      const depList = Reflect.getMetadata(ClassMetadata.PARAMS, Class) ?? [];

      if (!depList[0]) {
        this.logger.debug("Dependency is a primitive or has no constructor.");
      }

      const depInstances = this.instantiateCtorDependencies(Class, depList);

      if (depInstances.isError()) {
        return fail(depInstances.value());
      }

      const instance = new Class(...depInstances.value());

      this.processAutowires(instance);

      return success(instance);
    } catch (error) {
      this.logger.debug(error);

      return fail(
        new InjectionError(`Error while instantiating class ${Class.name}.`)
      );
    }
  }

  private instantiateCtorDependencies(
    Class: ClassDef,
    dependencies: Newable[]
  ): Throwable<InjectionError, unknown[]> {
    let index = 0;
    const resolved: unknown[] = [];

    this.logger.debug(
      `${Class.name} has ${dependencies.length} constructor dependencies.`
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const depCtor of dependencies) {
      index += 1;

      this.logger.debug(`Resolving dependency ${index}: ${depCtor?.name}.`);

      if (depCtor === undefined) {
        this.logger.error(
          "Circular dependency detected, cannot instantiate dependency."
        );

        return fail(new InjectionError("Circular dependency detected."));
      }

      const item = this.repo.getItem(depCtor);

      if (item) {
        const { instance, token, isTransient } = item;

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

        resolved.push(this.instantiateClass(depCtor).successOrThrow());
      }
    }

    return success(resolved);
  }

  private processAutowires(
    newable: InjectableClass
  ): Throwable<InjectionError, void> {
    let index = 0;
    const { constructor: ctor } = newable;

    const rules = Object.entries(ctor.prototype[AUTO_WIRE_LIST] ?? {});

    this.logger.info(`${ctor.name} has ${rules.length} Autowire rules.`);

    // eslint-disable-next-line no-restricted-syntax
    for (const [fieldName, tokenOrClassId] of rules) {
      index += 1;

      this.logger.info(`Processing rule ${index}.`);

      const inject = this.injectAutowire(newable, fieldName, tokenOrClassId);

      if (inject.isError()) {
        return fail(inject.value());
      }
    }

    return success(undefined);
  }

  private injectAutowire(
    newable: InjectableClass,
    fieldName: string,
    tokenOrClassId: string
  ): Throwable<InjectionError, void> {
    let item: InjectableItem<unknown> | undefined;

    if (tokenOrClassId.match(/^cls_.*/i)) {
      this.logger.debug(
        `Token is a classId, get ${tokenOrClassId} from ClassRegistry.`
      );

      const classItem = ClassRegistry.getById(tokenOrClassId);

      if (classItem) {
        item = this.repo.getItem(classItem.Class);
      }
    } else {
      this.logger.debug(`Getting token ${tokenOrClassId} from context`);

      item = this.repo.getItem(tokenOrClassId);
    }

    if (!item) {
      this.logger.error("Couldn't retrieve injectable via classId or token.", {
        tokenOrClassId,
      });

      return fail(new InjectionError("Autowire injection failed."));
    }

    this.logger.info(`Injecting token ${item.token} into prop '${fieldName}'.`);

    newable[fieldName as keyof Newable] = item.instance as never;

    return success(undefined);
  }
}
