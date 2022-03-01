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
class CtorInjectedClass {
  constructor(@Autowire(InjectedClass) private subClass: InjectedClass) {}

  public assert() {
    mockAssert(this.constructor.name);
    this.subClass.assert();
  }
}

describe("Constructor Injection tests", () => {
  let ctx: InjectionContext;

  beforeAll(() => {
    ctx = new InjectionContext("Ctx1");
  });

  it("Should resolve CtorInjectedClass", () => {
    expect(ctx.resolve(CtorInjectedClass)).toBeDefined();
    expect(ctx.resolve(CtorInjectedClass)).toBeInstanceOf(CtorInjectedClass);
  });

  it("Should inject InjectedClass into CtorInjectedClass", () => {
    const _class = ctx.resolve(CtorInjectedClass);

    _class.assert();

    expect(mockAssert).toBeCalledWith(CtorInjectedClass.name);
    expect(mockAssert).toBeCalledWith(InjectedClass.name);
  });
});
