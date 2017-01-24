import { getParamNames } from "./get-param-names";

export class Container {
  private modules: { [moduleName: string]: any } = {};

  bind<T>(module: T, name: string) {
    this.modules[name] = module;
  }

  resolve<T>(module: string | Constructable<T> | Factory<T>): Promise<T> {
    if (typeof module === "string") {
      if (typeof this.modules[module] === "undefined") {
        return Promise.reject(
          new Error(`Module "${module}" is not registered`)
        );
      }

      if (typeof this.modules[module] === "object") {
        return Promise.resolve(this.modules[module] as T);
      }

      return Promise.resolve(this.resolve(this.modules[module]));
    }

    if (typeof module === "function") {
      const dependencies = getParamNames(module).map(d => this.resolve(d));

      if (module.prototype && module.prototype.constructor.name) {
        return Promise.all(dependencies).then(
          awaitedDependencies =>
            new (module as Constructable<T>)(...awaitedDependencies)
        );
      }
      return Promise.all(dependencies).then(awaitedDependecies =>
        (module as Factory<T>)(...awaitedDependecies)
      );
    }

    return Promise.reject(new Error("Invalid module type"));
  }
}

type Constructable<T> = {
  new (...args: any[]): T;
};

type Factory<T> = {
  (...args: any[]): T | Promise<T>;
};
