import "reflect-metadata";
import { Env } from "../../src/annotations/env";

process.env.TEST_VAR = "myTestVar";

const mockAssert = jest.fn();

class EnvVarInjectedClass {
  @Env("TEST_VAR")
  private test!: string;

  constructor() {
    mockAssert(this.test);
  }

  public assert() {
    mockAssert(this.test);
  }
}

describe("Env tests", () => {
  let _class: EnvVarInjectedClass;

  beforeAll(() => {
    _class = new EnvVarInjectedClass();
  });

  it("Should not prevent class instantiating", () => {
    expect(_class).toBeDefined();
    expect(_class).toBeInstanceOf(EnvVarInjectedClass);
  });

  it("Should inject var into prototype, allowing access in ctor and props", () => {
    _class.assert();

    expect(mockAssert).toHaveBeenCalledWith(process.env.TEST_VAR);
    expect(mockAssert).toHaveBeenCalledWith(process.env.TEST_VAR);
  });
});
