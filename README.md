<p align="center">
    <img width="200px" src="https://content.tylerburke.dev/images/ts-injection-logo.png" />
</p>

<a href="https://www.npmjs.com/package/ts-injection"><img src="https://img.shields.io/npm/v/ts-injection.svg"/></a>
<a href="https://bundlephobia.com/result?p=ts-injection"><img src="https://img.shields.io/bundlephobia/minzip/ts-injection.svg"/></a>
<img src="https://img.shields.io/badge/license-MIT-blue.svg"/>
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"/>

ts-injection is an annotation based dependency injection framework written in Typescript for NodeJS apps. It enables building
applications that have loosely coupled components.

## Show me some code

```typescript
@Injectable()
class ArnyService {
  public getQuote(): string {
    return "Get to the choppa!";
  }
}

@Injectable()
class ArnyApp {
  @Autowire(ArnyService)
  private service!: ArnyService;

  public getQuote(): string {
    return this.service.getQuote();
  }
}

const container = new InjectionContainer();

function main(): void {
  const app = container.resolve(ArnyApp);
  
  console.log(app.getQuote());
}
```

## Features

- 🌾 [Field injection](https://burketyler.github.io/ts-injection/docs/usage#-field-injection)
- 🔨 [Constructor injection](https://burketyler.github.io/ts-injection/docs/usage#-constructor-injection)
- 🔢 [Environment variable parsing](https://burketyler.github.io/ts-injection/docs/usage#environment-variables)

## [View full documentation](https://burketyler.github.io/ts-injection/docs/setup)
