import "reflect-metadata";

import { Autowire } from "../../src/annotations/autowire";
import { Injectable } from "../../src/annotations/injectable";
import { InjectionContainer } from "../../src/injection-container";

const mockAssert = jest.fn();

const ctorObject = {
  token: "CTOR_OBJ",
  expected: "I'm in the constructor!",
  assert: mockAssert,
};

const fieldObject = {
  token: "PROP_OBJ",
  expected: "I'm a property",
  assert: mockAssert,
};

@Injectable()
class CtorClass {
  public assert() {
    mockAssert(this.constructor.name);
  }
}

@Injectable()
class FieldClass {
  public assert() {
    mockAssert(this.constructor.name);
  }
}

@Injectable()
class ManualInitClass {
  @Autowire(fieldObject.token)
  private propObj!: typeof fieldObject;

  @Autowire(FieldClass)
  private fieldClass!: FieldClass;

  constructor(
    @Autowire(CtorClass) private propClass: CtorClass,
    @Autowire(ctorObject.token) private ctorObj: typeof ctorObject
  ) {
    this.ctorObj.assert(this.ctorObj.expected);
    this.propClass.assert();
  }

  public assert() {
    this.propObj.assert(this.propObj.expected);
    this.fieldClass.assert();
  }
}

describe("Manual Init Injection tests", () => {
  let ctx: InjectionContainer;

  beforeAll(() => {
    ctx = new InjectionContainer("Ctx1", { isManualInit: true });
    ctx.register(ctorObject, ctorObject.token);
    ctx.register(fieldObject, fieldObject.token);
    ctx.initialize();
  });

  it("Should resolve all classes and objects", () => {
    expect(mockAssert).toHaveBeenCalledWith(ctorObject.expected);
    expect(mockAssert).toHaveBeenCalledWith(CtorClass.name);

    expect(ctx.resolve(ManualInitClass)).toBeDefined();
    expect(ctx.resolve(ManualInitClass)).toBeInstanceOf(ManualInitClass);
    expect(ctx.resolve(CtorClass)).toBeDefined();
    expect(ctx.resolve(CtorClass)).toBeInstanceOf(CtorClass);
    expect(ctx.resolve(FieldClass)).toBeDefined();
    expect(ctx.resolve(FieldClass)).toBeInstanceOf(FieldClass);

    expect(ctx.resolve(ctorObject.token)).toEqual(ctorObject);
    expect(ctx.resolve(fieldObject.token)).toEqual(fieldObject);

    ctx.resolve(ManualInitClass)?.assert();

    expect(mockAssert).toHaveBeenCalledWith(fieldObject.expected);
    expect(mockAssert).toHaveBeenCalledWith(FieldClass.name);
  });
});
