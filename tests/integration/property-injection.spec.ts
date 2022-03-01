import "reflect-metadata";
import { Autowire } from "../../src/annotations/autowire";
import { Injectable } from "../../src/annotations/injectable";
import { InjectionContext } from "../../src/injection-context";

const mockAssert = jest.fn();

@Injectable()
class InjectedClass {
  public assert() {
    mockAssert(this.constructor.name);
  }
}

@Injectable()
class PropInjectedClass {
  @Autowire(InjectedClass) private subClass!: InjectedClass;

  public assert() {
    mockAssert(this.constructor.name);
    this.subClass.assert();
  }
}

describe("Property Injection tests", () => {
  let ctx: InjectionContext;

  beforeAll(() => {
    ctx = new InjectionContext("Ctx1");
  });

  it("Should resolve PropertyInjectedClass", () => {
    expect(ctx.resolve(PropInjectedClass)).toBeDefined();
    expect(ctx.resolve(PropInjectedClass)).toBeInstanceOf(PropInjectedClass);
  });

  it("Should inject InjectedClass and injectedObject into CtorInjectedClass", () => {
    const _class = ctx.resolve(PropInjectedClass);

    _class.assert();

    expect(mockAssert).toBeCalledWith(PropInjectedClass.name);
    expect(mockAssert).toBeCalledWith(InjectedClass.name);
  });
});
