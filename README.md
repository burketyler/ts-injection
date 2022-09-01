<p align="center">
<img width="200px" src="https://content.tylerburke.dev/images/ts-injection-logo.png" />
</p>

<a href="https://www.npmjs.com/package/ts-injection"><img src="https://img.shields.io/npm/v/ts-injection.svg"></a>
<a href="https://bundlephobia.com/result?p=ts-injection"><img src="https://img.shields.io/bundlephobia/minzip/ts-injection.svg"/></a>
<img src="https://img.shields.io/badge/license-MIT-blue.svg">
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />

ts-injection is an annotation based dependency injection framework written in Typescript for NodeJS apps. It enables building
applications that have loosely coupled components, resulting in:

- Easy to read code.
- Reduction in boilerplate.
- Enhanced developer experience.

## Show me some code

```typescript
@Injectable()
class ArnyService {
  public getQuote(): string {
    return "Get to the choppa!";
  }
}

@Injectable()
class ArnyQuotesHandler {
  @Autowire(ArnyService)
  private service!: ArnyService;

  public getQuote(): string {
    return this.service.getQuote();
  }
}

const container = new InjectionContainer();

const handler = container.resolve(ArnyQuotesHandler);

console.log(handler.getQuote());
```

<a href="https://burketyler.github.io/ts-injection/docs/usage"><p align="center" style="font-size: 25px">View full documentation</p></a>
