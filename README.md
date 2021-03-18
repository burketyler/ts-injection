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
   * [Caveats](#caveats)
      * [Injectable constructor arguments](#injectable-constructor-arguments)
      * [Circular dependencies](#circular-dependencies)
      * [Register before resolve](#register-before-resolve)
      * [Webpack](#webpack)
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
