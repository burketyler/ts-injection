# ts-injection

This is an annotation based dependency injection framework written in Typescript for NodeJS apps. It enables building
applications that have loosely coupled components, resulting in:

- Easy to read code.
- Reduction in boiler plate.
- Enhanced developer experience.

**Annotation vs Decorator**: The correct term for the @ syntax in TypeScript/Javascript is a "decorator", in many other
languages it's referred to as an "annotation". I prefer the term annotation, so that's how I'll be referring to them in
this documentation.

Annotations can only be placed on javascript classes, as such `ts-injection` is best suited for projects that have a
class based architecture. If you have a functional code based this probably won't be suited for you.

# Table of Contents
<!--ts-->
   * [Setup](#setup)
      * [Install](#install)
      * [Requirements](#requirements)
   * [Getting started](#getting-started)
      * [Defining an injectable](#defining-an-injectable)
         * [Classes](#classes)
         * [Named injectables](#named-injectables)
      * [Injecting dependencies](#injecting-dependencies)
         * [Constructor injection](#constructor-injection)
         * [Field injection](#field-injection)
      * [Injection entry point](#injection-entry-point)
      * [Environment variables](#environment-variables)
   * [API reference](#api-reference)
      * [Decorators](#decorators)
         * [@Injectable](#injectable)
         * [@Autowire(tokenOrClass: string | Newable)](#autowiretokenorclass-string--newable)
         * [@Env&lt;T&gt;(varName: string, mapper?: (val: string) =&gt; T)](#envtvarname-string-mapper-val-string--t)
      * [Functions](#functions)
         * [resolve&lt;T&gt;(injectable: Newable): T](#resolvetinjectable-newable-t)
         * [register&lt;T&gt;(injectable: T, token: string, type: string = "OBJECT"): void](#registertinjectable-t-token-string-type-string--object-void)
   * [Extending ts-injection](#extending-ts-injection)
      * [Methods](#methods)
         * [useInjectionContext(): { injectionCtx: InjectionContext }](#useinjectioncontext--injectionctx-injectioncontext-)
         * [useDebugger(className: string): { logger: Debugger }](#usedebuggerclassname-string--logger-debugger-)
         * [makeClassInjectable&lt;T extends Newable&gt;(classCtor: T) : string | undefined](#makeclassinjectablet-extends-newableclassctor-t--string--undefined)
         * [injectIntoClass(classCtor: classOrClassCtor, member: string, injectable: any): void](#injectintoclassclassctor-classorclassctor-member-string-injectable-any-void)
      * [Classes](#classes-1)
          * [InjectionContext](#injectioncontext)
             * [Domain](#domain)
                * [InjectableItemModel](#injectableitemmodel)
             * [Methods](#methods-1)
                * [register(injectable: any): string](#registerinjectable-any-string)
                * [registerWithToken(injectable: any, token: string): void](#registerwithtokeninjectable-any-token-string-void)
                * [isTokenInItems(token: string): boolean](#istokeninitemstoken-string-boolean)
                * [retrieveByToken(token: string): any](#retrievebytokentoken-string-any)
                * [addMetadataToItem(token: string, metaData: { [key: string]: any }): void](#addmetadatatoitemtoken-string-metadata--key-string-any--void)
             * [queryByType(type: string): any[]](#querybytypetype-string-any)
             * [findItemByToken(token: string): InjectableItemModel&lt;any&gt; | undefined](#finditembytokentoken-string-injectableitemmodelany--undefined)
      * [Debugger](#debugger)
         * [Example](#example)
         * [Available internal debuggers](#available-internal-debuggers)
   * [Caveats](#caveats)
      * [Injectable constructor arguments](#injectable-constructor-arguments)
      * [Circular dependencies](#circular-dependencies)
      * [Register before resolve](#register-before-resolve)
      * [Webpack](#webpack)

<!-- Added by: tburke, at: Fri Mar 19 12:32:06 AEDT 2021 -->

<!--te-->

# Setup
## Install

`npm install ts-injection`

or

`yarn add ts-injection`

## Requirements
Make sure your tsconfig.json contains
```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```
Install [reflect-metadata](https://www.npmjs.com/package/reflect-metadata).
At the entrypoint to your application, include:
```typescript
import "reflect-metadata";
```

Your runtime must support `Symbols`.

# Getting started
## Defining an injectable

### Classes
Use the `@Injectable` annotation to let the framework know that you intend for this class to be handled by the injection
context.

This means that:

1) it can be injected into other classes.
2) any injectable classes provided as constructor arguments are automatically resolved.

```typescript
@Injectable
export class MyService {
    constructor() {
    }

    public test() {
        console.log("Injection context test from MyService.");
    }
}
```

### Named injectables

You can make any other variable injectable using the `register()`method. You will need to specify a unique token name to
identify the value.

```typescript
interface ConfigObject {
    config1: string;
}

const myObject = {
    config1: "123"
};

register<ConfigObject>(myObject, "TOKEN_CONFIG");
```

## Injecting dependencies
### Constructor injection

Any constructor arguments provided to an `@Injectable` class will be automatically resolved from the injection context.
You can also specify a named injectable using the `@Autowire` annotation.

```typescript
@Injectable
export class App {
    constructor(private service: MyService, @Autowire("TOKEN_CONFIG") private config: ConfigObject) {
        this.service.test();
        // Outputs: Injection context test from MyService.
        console.log(this.config);
        // Output: { config1: "123" }
    }
}
```

### Field injection
You can inject a named injectable or an injectable class into a class member by using the `@Autowire`
annotation.

```typescript
@Injectable
export class App {
    @Autowire(MyService)
    private service: MyService;

    @Autowire("TOKEN_CONFIG")
    private config: ConfigObject;

    constructor() {
       this.service.test();
       // Outputs: Injection context test from MyService.
        console.log(this.config);
        // Output: { config1: "123" }
    }
}
```

## Injection entry point
The framework needs to know where your application begins. Use the `resolve()` method to get an instance
of your entry point class from the injection context.

```typescript

@Injectable
export class App {
    constructor(private service: MyService) {
    }
}

const app = resolve<App>(App);
```

## Environment variables
You can inject environment variables into class members using the `@Env` annotation.
The framework will use the `type` of the `class member` to infer how to parse the value.
Supported types are: `string`, `boolean`, `object`, `number`.
You can also optionally pass a mapping function that will take in the string value and
return the mapped value.

```typescript
process.env.CFG_STR = "test";
process.env.CFG_NUM = "123";
process.env.CFG_BOOL = "true";
process.env.CFG_OBJ = "{\"myObj\": \"hello\"}";

type MyObj = { myObj: string };

function mapObj(val: string): MyObj {
    const obj = JSON.parse(val);
    obj.newVal = 123;
    return obj;
}

export class App {
    @Env("CFG_STR")
    private myString: string;
    @Env("CFG_NUM")
    private myNumber: number;
    @Env("CFG_BOOL")
    private myBool: boolean;
    @Env("CFG_OBJ")
    private myObj: MyObj;
    @Env<MyObj>("CFG_OBJ", mapObj)
    private myMappedObj: MyObj;
    
    constructor() {
        console.log(this.myString);
        // "test"
        console.log(this.myNumber);
        // 123
        console.log(this.myBool);
        // true
        console.log(this.myObj);
        // {
        //  myObj: "hello"
        // }
        console.log(this.myMappedObj);
        // {
        //  myObj: "hello",
        //  newVal: 123
        // }
    }
}
```

# API reference
## Decorators
### @Injectable
Indicate to `ts-injection` that this annotated class should be handled by the injection context.

### @Autowire(tokenOrClass: string | Newable)
Inject the specified named injectable or class injectable by its reference.
In the case of a named injectable, provide the token name:

`@Autowire("TOKEN_NAME")`

In the case of a class injectable, provide a reference to the class constructor:

`@Autowire(MyClass)`

### @Env\<T\>(varName: string, mapper?: (val: string) => T)
Inject the specified environment variable from process.env into the annotated class member.
The `type` of the `class member` this annotation has been applied to is used to infer how
to parse the value. Supported types are: `string`, `boolean`, `object`, `number`.
You can also optionally pass a mapping function that will take in the string value and
return the mapped value.

## Functions
### resolve\<T\>(injectable: Newable): T
Get an instance of the provided injectable class from the injection context.
Use this instead of calling `new` on injectable classes.
Must supply a reference to the injectable class's constructor:

`resolve<MyClass>(MyClass);`

**Note**: providing a non-injectable class (not annotated with `@Injectable`)
will throw an error.

### register\<T\>(injectable: T, token: string, type: string = "OBJECT"): void
Register any object or value into the injectable context with a specified token or 'name'.
This injectable can then be accessed in classes with the `@Autowire` annotation.
You can optionally specify a 'type' which can be useful when extending this framework.

`register<{myVar: string}>({myVar: "test"}, "MY_TOKEN");`

# Extending ts-injection
I've exposed some internal APIs that can be used by anyone who wants to extend
the functionality provided by `ts-injection`. An example of this is the [fastify-boot](https://github.com/burketyler/fastify-boot) library.

## Methods
### useInjectionContext(): { injectionCtx: InjectionContext }
Obtain the instance of the `InjectionContext` class.
Read more about this in [InjectionContext](#injection-context).

### useDebugger(className: string): { logger: Debugger }
Obtain an instance of the `Debugger` class for the specified class.\
Read more about this in [Debugger](#debugger).

### makeClassInjectable\<T extends Newable\>(classCtor: T) : string | undefined
The internal API that `@Injectable` invokes to instantiate the provided class and add
the instance to the injection context. Input must be a class constructor. The return value
is the token reference to the injectable, or undefined
if it detects the classCtor is actually for a primitive type.

### injectIntoClass(classCtor: any, member: string, injectable: any): void
A simple helper method that will inject the provided instance or value (injectable) into the class (classOrClassCtor) member/field (member).

## Classes
### InjectionContext
The class responsible for managing the injection context that `ts-injection` uses.

#### Domain
##### InjectableItemModel
```typescript
export interface InjectableItemModel<T> {
  token: string;
  value: T;
}
```

#### Methods
##### register(injectable: any): string
Register an injectable class object or value into the injection context.
Returns an auto-generated token reference to the injectable.

##### registerWithToken(injectable: any, token: string): void
Register an injectable class object or value into the injection context with a specific token.
If the token already exists in the context, it will replace the existing item.

##### isTokenInItems(token: string): boolean
Check if a given injectable exists in the injectable context by its token reference.

##### retrieveByToken(token: string): any
Retrieve an injectable by its token reference, or throw an error if the token doesn't exist.

##### addMetadataToItem(token: string, metaData: { [key: string]: any }): void
Add the specified metaData keys to an injectable instance based on its token reference.\
E.g:

```typescript
  const token = makeClassInjectable(classCtor);
  injectionCtx.addMetadataToItem(token, {
    [META_TYPE]: "MY_TYPE",
  });
```

#### queryByType(type: string): any[]
Retrieve an array of injectables that match the provided type.\
Type is defined by the string value added to the injectable's metaData key [META_TYPE](#meta_type).

```typescript
  const injectables = injectionCtx.queryByType("MY_TYPE");
```

#### findItemByToken(token: string): InjectableItemModel\<any\> | undefined
Retrieve an injectable item object [InjectableItem](#injectableitemmodel) by its token reference value.
Doesn't throw if it can't be found, will just return undefined.

### Debugger
DI in Typescript/Javascript is very dependent on the order files are loaded, and the flow for using
decorators can be quite complex. Understanding what's happening under the hood can be very useful when debugging issues.
For my own use internally I've created a simple debugger component
that can be activated via adding environment variables.

The `Debugger` class will listen to process.env.DEBUG_CLASSES, which it expects to be a comma separated
`string` of class names.
If the class you want to debug is present in the list, `Debugger` will write the debug logs to `console.debug`,
if it's not then no logs are emitted.

#### Example

```typescript
proces.env.DEBUG_CLASSES="MyFn"

function myFn(): void {
    const { logger } = useDebugger("MyFn");
    logger.debug("Hello");
    // Outputs Hello
}

function otherFn(): void {
    const { logger } = useDebugger("OtherFn");
    logger.debug("");
    // No output
}
```

#### Available internal debuggers
- InjectionContext
- Injectable
- Autowire
- Env

# Caveats
## Injectable constructor arguments
Because it's managed by the injection context, a class marked as `@Injectable`
can ***only*** define constructor arguments that are injectables. Never construct
`App` using `new`, always use `resolve()`.

This will results in an error:

```typescript
export class NonInjectableClass {
    constructor() {
    }
}

@Injectable
export class App {
    constructor(private service: NonInjectableClass) {
    }
}

resolve<App>(app);
```

## Circular dependencies
To automatically resolve dependencies, at the point of calling `resolve()`, `ts-injectable` will
traverse the dependency tree until it finds a class that it can instantiate.

If circular dependencies occur like in the scenario below, an error will be thrown.

```typescript
@Injectable
export class MyService {
   constructor(private app: App) {
   }
}

@Injectable
export class App {
   constructor(private service: MyService) {
   }
}
```

## Register before resolve
Any named injectables must be registered before your entry point class is resolved.

```typescript
@Injectable
export class App {
    @Autowire("TOKEN")
    private config: ConfigObject;

    constructor() {
    }
}

// This works
register({test: 123}, "TOKEN");
const app = resolve<App>(App);

// This throws
const app = resolve<App>(App);
register({test: 123}, "TOKEN");
```

## Webpack
This library has been tested pretty thoroughly with Webpack 5, and it works great. Just make
sure that your setup uses one version of `ts-injection` per bundle file. Basically requiring the
module twice will create two different injection contexts, so you won't be able to access the same
instances. I'll need to look into how I can change this behaviour to check if an in-memory context
exists that we can pull from.
