"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_param_names_1 = require("./get-param-names");
class Container {
    constructor() {
        this.modules = {};
    }
    bind(module, name) {
        this.modules[name] = module;
    }
    resolve(module) {
        if (typeof module === "string") {
            if (typeof this.modules[module] === "undefined") {
                return Promise.reject(new Error(`Module "${module}" is not registered`));
            }
            if (typeof this.modules[module] === "object") {
                return Promise.resolve(this.modules[module]);
            }
            return Promise.resolve(this.resolve(this.modules[module]));
        }
        if (typeof module === "function") {
            const dependencies = get_param_names_1.getParamNames(module).map(d => this.resolve(d));
            if (module.prototype && module.prototype.constructor.name) {
                return Promise.all(dependencies).then(awaitedDependencies => new module(...awaitedDependencies));
            }
            return Promise.all(dependencies).then(awaitedDependecies => module(...awaitedDependecies));
        }
        return Promise.reject(new Error("Invalid module type"));
    }
}
exports.Container = Container;
