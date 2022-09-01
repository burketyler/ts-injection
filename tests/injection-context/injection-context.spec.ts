import "reflect-metadata";

import { Injectable } from "../../src/annotations/injectable";
import { InjectionContainer } from "../../src/injection-container";

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

class ClassThree {
  constructor() {
    mockAssert(this.constructor.name);
  }
}

describe("Injection Context tests", () => {
  describe("When error should throw on not found injectable", () => {
    let ctx: InjectionContainer;

    beforeAll(() => {
      ctx = new InjectionContainer("Ctx1");
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("Should throw when class is resolved", () => {
      expect(() => ctx.resolve(ClassThree)).toThrowError(
        expect.objectContaining({
          message: expect.stringMatching(/.*not found.*/),
        })
      );
    });
  });

  describe("When context should be manually initialized", () => {
    let ctx: InjectionContainer;

    beforeAll(() => {
      ctx = new InjectionContainer("Ctx1", {
        isManualInit: true,
        shouldThrowOnNotFound: false,
      });
      ctx.register(objectOne, objectOne.token);
      ctx.register(objectTwo, objectTwo.token);
      ctx.register(ClassThree);
    });

    it("Should not instantiate any classes until initialize has been called", () => {
      expect(mockAssert).toHaveBeenCalledWith(ClassThree.name);
      expect(mockAssert).toBeCalledTimes(1);

      expect(ctx.resolve(objectOne.token)).toEqual(objectOne);
      expect(ctx.resolve(objectTwo.token)).toEqual(objectTwo);
      expect(ctx.resolve(ClassThree)).toBeDefined();
      expect(ctx.resolve(ClassThree)).toBeInstanceOf(ClassThree);

      expect(ctx.resolve(ClassOne)).toBeUndefined();
      expect(ctx.resolve(ClassTwo)).toBeUndefined();
    });

    it("Should not instantiate any classes until initialize has been called", () => {
      ctx.initialize();

      expect(mockAssert).toHaveBeenCalledWith(ClassOne.name);
      expect(mockAssert).toHaveBeenCalledWith(ClassTwo.name);
      expect(mockAssert).toHaveBeenCalledWith(ClassThree.name);

      expect(ctx.resolve(ClassOne)).toBeDefined();
      expect(ctx.resolve(ClassOne)).toBeInstanceOf(ClassOne);
      expect(ctx.resolve(ClassTwo)).toBeDefined();
      expect(ctx.resolve(ClassTwo)).toBeInstanceOf(ClassTwo);
      expect(ctx.resolve(ClassThree)).toBeDefined();
      expect(ctx.resolve(ClassThree)).toBeInstanceOf(ClassThree);
    });

    it("Should do nothing when initialized", () => {
      const numItems = ctx.repo["items"].length;

      ctx.initialize();

      expect(ctx.repo["items"].length).toEqual(numItems);
    });
  });

  describe("When context should be immediately initialized", () => {
    let ctx: InjectionContainer;

    beforeAll(() => {
      ctx = new InjectionContainer("Ctx1", { shouldThrowOnNotFound: false });
    });

    it("Should instantiate all classes", () => {
      expect(mockAssert).toHaveBeenCalledWith(ClassOne.name);
      expect(mockAssert).toHaveBeenCalledWith(ClassTwo.name);
      expect(mockAssert).toHaveBeenCalledWith(ClassThree.name);

      expect(ctx.resolve(ClassOne)).toBeDefined();
      expect(ctx.resolve(ClassOne)).toBeInstanceOf(ClassOne);
      expect(ctx.resolve(ClassTwo)).toBeDefined();
      expect(ctx.resolve(ClassTwo)).toBeInstanceOf(ClassTwo);

      expect(ctx.resolve(ClassThree)).toBeUndefined();
      expect(ctx.resolve(objectOne.token)).toBeUndefined();
      expect(ctx.resolve(objectTwo.token)).toBeUndefined();
    });

    it("Should resolve objects after they've been registered", () => {
      ctx.register(objectOne, objectOne.token);
      ctx.register(objectTwo, objectTwo.token);
      ctx.register(ClassThree);

      expect(ctx.resolve(objectOne.token)).toEqual(objectOne);
      expect(ctx.resolve(objectTwo.token)).toEqual(objectTwo);
      expect(ctx.resolve(ClassThree)).toBeDefined();
      expect(ctx.resolve(ClassThree)).toBeInstanceOf(ClassThree);
    });

    it("Should do nothing when initialized", () => {
      const numItems = ctx.repo["items"].length;

      ctx.initialize();

      expect(ctx.repo["items"].length).toEqual(numItems);
    });
  });
});
