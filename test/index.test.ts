import { Container } from "../src/index";

describe("IoC container", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it("should inject dependencies into constructor function (class) when resolving by string", async () => {
    container.bind(TestClassA, "testClassA");
    container.bind(TestClassB, "testClassB");
    container.bind(TestClassC, "testClassC");

    const testClassC = await container.resolve<TestClassC>("testClassC");

    expect(testClassC.output()).toBe("test output class A test output class B");
  });

  it("should inject dependencies into constructor function (class) when resolving by class", async () => {
    container.bind(TestClassA, "testClassA");
    container.bind(TestClassB, "testClassB");
    container.bind(TestClassC, "testClassC");

    const testClassC = await container.resolve<TestClassC>(TestClassC);

    expect(testClassC.output()).toBe("test output class A test output class B");
  });

  it("should inject dependencies as singletons if they are objects", async () => {
    const testSingleton = {
      output: () => "test object output"
    };

    container.bind(testSingleton, "testClassA");
    container.bind(testSingleton, "testClassB");
    container.bind(TestClassC, "testClassC");

    const testClassC = await container.resolve<TestClassC>("testClassC");

    expect(testClassC.output()).toBe("test object output test object output");
  });

  it("should resolve nested dependencies", async () => {
    container.bind(TestClassF, "testClassF");
    container.bind(TestClassG, "testClassG");

    const testClassE = await container.resolve<TestClassE>(TestClassE);

    expect(testClassE.output()).toBe("test class g property");
  });

  it("should inject a factory function", async () => {
    container.bind(
      () => ({ output: () => "test factory function output" }),
      "factoryFunction"
    );

    const testClassD = await container.resolve<TestClassD>(TestClassD);

    expect(testClassD.output()).toBe("test factory function output");
  });

  it("should inject dependencies into a factory function", async () => {
    container.bind(TestClassA, "testClassA");
    container.bind(TestClassB, "testClassB");
    const factoryFunction = (
      testClassA: TestClassA,
      testClassB: TestClassB
    ): FactoryProduct => ({
      output: () => `${testClassA.output()} ${testClassB.output()}`
    });

    const factoryProduct = await container.resolve<FactoryProduct>(
      factoryFunction
    );

    expect(factoryProduct.output()).toBe(
      "test output class A test output class B"
    );
  });

  it("should throw when dependency not available", () => {
    expect(container.resolve("notAvailable")).rejects.toThrow(
      'Module "notAvailable" is not registered'
    );
  });

  it("should throw when resolving an invalid type", async () => {
    expect(container.resolve(1231 as any)).rejects.toThrow(
      "Invalid module type"
    );
  });

  it("should resolve a simple factory to itself", async () => {
    const factory = () => ({ output: () => "test simple output" });
    const resolvedFactory = await container.resolve<FactoryProduct>(factory);

    expect(resolvedFactory.output()).toBe("test simple output");
  });

  it("should inject resolved promise from an async factory into a class", async () => {
    const factory = (): Promise<FactoryProduct> =>
      Promise.resolve({ output: () => "test async output" });

    container.bind(factory, "factoryFunction");

    const testClassD = await container.resolve<TestClassD>(TestClassD);

    expect(testClassD.output()).toBe("test async output");
  });

  it("should inject resolved promise from an async factory into another factory", async () => {
    const factory = (): Promise<FactoryProduct> =>
      Promise.resolve({ output: () => "test nested async output" });
    const anotherFactory = (
      factoryFunction: FactoryProduct
    ): Promise<FactoryProduct> =>
      Promise.resolve({ output: () => factoryFunction.output() });

    container.bind(factory, "factoryFunction");

    const anotherFactoryProduct = await container.resolve<FactoryProduct>(
      anotherFactory
    );

    expect(anotherFactoryProduct.output()).toBe("test nested async output");
  });
});

class TestClassA {
  output() {
    return "test output class A";
  }
}

class TestClassB {
  output() {
    return "test output class B";
  }
}

class TestClassC {
  constructor(private testClassA: TestClassA, private testClassB: TestClassB) {}

  output() {
    return `${this.testClassA.output()} ${this.testClassB.output()}`;
  }
}

class TestClassD {
  factoryFunction: FactoryProduct;

  constructor(factoryFunction: FactoryProduct) {
    this.factoryFunction = factoryFunction;
  }

  output() {
    return this.factoryFunction.output();
  }
}

class TestClassE {
  constructor(private testClassF: TestClassF) {}

  output() {
    return this.testClassF.output();
  }
}

class TestClassF {
  constructor(private testClassG: TestClassG) {}

  output() {
    return this.testClassG.someProperty;
  }
}

class TestClassG {
  someProperty = "test class g property";
}

type FactoryProduct = { output: () => string };
