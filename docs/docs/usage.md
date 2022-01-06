---
sidebar_position: 2
---

# Usage

## Defining an injectable

### Classes

Use the `@Injectable` annotation to let the framework know that you intend for this class to be handled by the injection
context.

This means that:

1. it can be injected into other classes.
2. any injectable classes provided as constructor arguments are automatically resolved.

```typescript
@Injectable
export class MyService {
  constructor() {}

  public test() {
    console.log("Injection context test from MyService.");
  }
}
```

:::info

Because it's managed by the injection context, a class marked as `@Injectable`
can **_only_** define constructor arguments that are injectables. Never construct
`App` using `new`, always use `resolve()`.

:::

### Named injectables

You can make any other variable injectable using the `register()`method. You will need to specify a unique token name to
identify the value.

```typescript
interface ConfigObject {
  config1: string;
}

const myObject = {
  config1: "123",
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
  constructor(
    private service: MyService,
    @Autowire("TOKEN_CONFIG") private config: ConfigObject
  ) {
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
  constructor(private service: MyService) {}
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
process.env.CFG_OBJ = '{"myObj": "hello"}';

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
