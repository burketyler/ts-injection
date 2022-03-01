import "reflect-metadata";

import exp from "constants";

import { Injectable } from "../../src/annotations/injectable";
import { InjectableNotFoundError } from "../../src/injectable-repo";
import { InjectionContext } from "../../src/injection-context";

const mockAssert = jest.fn();

const objectOne = {
  token: "OBJ_ONE",
};

const objectTwo = {
  token: "OBJ_TWO",
};

@Injectable()
class ClassOne {
  constructor() {
    mockAssert(this.constructor.name);
  }
}

@Injectable()
class ClassTwo {
  constructor() {
    mockAssert(this.constructor.name);
  }
}

describe("Injection Context tests", () => {
  describe("When context should be manually initialized", () => {
    let ctx: InjectionContext;

    beforeAll(() => {
      ctx = new InjectionContext("Ctx1", { isManualInit: true });
      ctx.register(objectOne, objectOne.token);
      ctx.register(objectTwo, objectTwo.token);
    });

    it("Should not instantiate any classes until initialize has been called", () => {
      expect(mockAssert).not.toHaveBeenCalled();
      expect(ctx.resolve(objectOne.token)).toEqual(objectOne);
      expect(ctx.resolve(objectTwo.token)).toEqual(objectTwo);
      expect(() => ctx.resolve(ClassOne)).toThrow(InjectableNotFoundError);
      expect(() => ctx.resolve(ClassTwo)).toThrow(InjectableNotFoundError);
    });

    it("Should not instantiate any classes until initialize has been called", () => {
      ctx.initialize();

      expect(mockAssert).toHaveBeenCalledWith(ClassOne.name);
      expect(mockAssert).toHaveBeenCalledWith(ClassTwo.name);
      expect(ctx.resolve(ClassOne)).toBeDefined();
      expect(ctx.resolve(ClassOne)).toBeInstanceOf(ClassOne);
      expect(ctx.resolve(ClassTwo)).toBeDefined();
      expect(ctx.resolve(ClassTwo)).toBeInstanceOf(ClassTwo);
    });

    it("Should do nothing when initialized", () => {
      const numItems = ctx.repo["items"].length;

      ctx.initialize();

      expect(ctx.repo["items"].length).toEqual(numItems);
    });
  });

  describe("When context should be immediately initialized", () => {
    let ctx: InjectionContext;

    beforeAll(() => {
      ctx = new InjectionContext("Ctx1");
    });

    it("Should instantiate all classes", () => {
      expect(mockAssert).toHaveBeenCalledWith(ClassOne.name);
      expect(mockAssert).toHaveBeenCalledWith(ClassTwo.name);
      expect(ctx.resolve(ClassOne)).toBeDefined();
      expect(ctx.resolve(ClassOne)).toBeInstanceOf(ClassOne);
      expect(ctx.resolve(ClassTwo)).toBeDefined();
      expect(ctx.resolve(ClassTwo)).toBeInstanceOf(ClassTwo);
      expect(() => ctx.resolve(objectOne.token)).toThrow(
        InjectableNotFoundError
      );
      expect(() => ctx.resolve(objectTwo.token)).toThrow(
        InjectableNotFoundError
      );
    });

    it("Should resolve objects after they've been registered", () => {
      ctx.register(objectOne, objectOne.token);
      ctx.register(objectTwo, objectTwo.token);

      expect(ctx.resolve(objectOne.token)).toEqual(objectOne);
      expect(ctx.resolve(objectTwo.token)).toEqual(objectTwo);
    });

    it("Should do nothing when initialized", () => {
      const numItems = ctx.repo["items"].length;

      ctx.initialize();

      expect(ctx.repo["items"].length).toEqual(numItems);
    });
  });
});
