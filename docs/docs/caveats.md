---
sidebar_position: 4
---

# Caveats

## Circular dependencies

To automatically resolve dependencies, at the point of calling `resolve()`, `ts-injectable` will
traverse the dependency tree until it finds a class that it can instantiate.

If circular dependencies occur like in the scenario below, an error will be thrown.

```typescript
@Injectable
export class MyService {
  constructor(private app: App) {}
}

@Injectable
export class App {
  constructor(private service: MyService) {}
}
```

## Register before resolve

Any named injectables must be registered before your entry point class is resolved.

```typescript
@Injectable
export class App {
  @Autowire("TOKEN")
  private config: ConfigObject;

  constructor() {}
}

// This works
register({ test: 123 }, "TOKEN");
const app = resolve<App>(App);

// This throws
const app = resolve<App>(App);
register({ test: 123 }, "TOKEN");
```

## Webpack

This library has been tested pretty thoroughly with Webpack 5, and it works great. Just make
sure that your setup uses one version of `ts-injection` per bundle file. Basically requiring the
module twice will create two different injection contexts, so you won't be able to access the same
instances.
