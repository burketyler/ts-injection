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

## Getting started

`npm install ts-injection`

or

`yarn install ts-injection`

### Defining an injectable

#### Classes

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

#### Named injectable

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

### Injecting dependencies

#### Constructor injection

Any constructor arguments provided to an `@Injectable` class will be automatically resolved from the injection context.

```typescript
@Injectable
export class App {
    constructor(private service: MyService) {
        this.service.test();
        // Outputs: Injection context test from MyService.
    }
}
```

#### Field injection

You can inject a named injectable into a class member by using the `@Autowire`
annotation.

```typescript
@Injectable
export class App {
    @Autowire("TOKEN_CONFIG")
    private config: ConfigObject;

    constructor(private service: MyService) {
       this.service.test();
       // Outputs: Injection context test from MyService.
    }

    public printConfig() {
        console.log(this.config);
        // Output: { config1: "123" }
    }
}
```

### Injection entry point
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

## Caveats
### Injectable constructor arguments
Because it's managed by the injection context, a class marked as `@Injectable`
can ***only*** define constructor arguments that are other
Injectable classes. Never construct `App` using `new`, always use `resolve()`.

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

### Circular dependencies
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

### Field injection and class constructors
Because a class member can only be set after a class has been instantiated, a named injectable cannot be
accessed inside a class constructor.

```typescript
@Injectable
export class App {
    @Autowire("TOKEN_CONFIG")
    private config: ConfigObject;

    constructor(private service: MyService) {
        console.log(this.config.config1);
        // This will error, config is undefined at this point
    }

    public test() {
        console.log(this.config.config1);
        // Output: 123
    }
}
```

### Register before resolve
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
let app = resolve<App>(App);

// This throws
const app = resolve<App>(App);
register({test: 123}, "TOKEN");
```
