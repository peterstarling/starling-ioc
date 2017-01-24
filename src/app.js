function IoC() {
	this.modules = {};
};

const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
  	const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  	const result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  	
  	if(result === null)
    	return [];

 	const args = Array.prototype.slice.call(result);

  	return args;
}

IoC.prototype.register = function(name, module) {
	this.modules[name] = module;
};

IoC.prototype.resolve = function resolve(module) {

	if (typeof module === 'string') {

		if (typeof this.modules[module] === 'undefined') {
			throw new Error(`Module "${module}" is not registered`);
		}

		if (typeof this.modules[module] === 'object') {
			return this.modules[module];
		}

		return (resolve.call(this, this.modules[module]));
		// return new this.modules[module];
	}

	if (typeof module === 'function') {
		return new module(...(getParamNames(module).map(d => resolve.call(this, d))));
	}
};

// let's instantiate the class (function) so that
// the module will be a singleton
export default (new IoC);