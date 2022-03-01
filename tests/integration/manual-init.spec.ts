import "reflect-metadata";
import exp from "constants";

import { Autowire } from "../../src/annotations/autowire";
import { Injectable } from "../../src/annotations/injectable";
import { InjectionContext } from "../../src/injection-context";

const mockAssert = jest.fn();

const ctorObject = {
  token: "CTOR_OBJ",
  expected: "I'm in the constructor!",
  assert: mockAssert,
};

const propObject = {
  token: "PROP_OBJ",
  expected: "I'm a property",
  assert: mockAssert,
};

@Injectable()
class ManualInitClass {
  @Autowire(propObject.token) private propObj!: typeof propObject;

  constructor(@Autowire(ctorObject.token) private ctorObj: typeof ctorObject) {
    this.ctorObj.assert(this.ctorObj.expected);
  }

  public assert() {
    this.propObj.assert(this.propObj.expected);
  }
}

describe("Manual Init Injection tests", () => {
  let ctx: InjectionContext;

  beforeAll(() => {
    ctx = new InjectionContext("Ctx1", { isManualInit: true });
    ctx.register(ctorObject, ctorObject.token);
    ctx.register(propObject, propObject.token);
    ctx.initialize();
  });

  it("Should resolve class and both objects", () => {
    expect(ctx.resolve(ManualInitClass)).toBeInstanceOf(ManualInitClass);
    expect(ctx.resolve(ctorObject.token)).toEqual(ctorObject);
    expect(ctx.resolve(propObject.token)).toEqual(propObject);
  });

  it("Should resolve both objects", () => {
    const _class = ctx.resolve(ManualInitClass);

    _class.assert();

    expect(mockAssert).toBeCalledWith(ctorObject.expected);
    expect(mockAssert).toBeCalledWith(propObject.expected);
  });
});
