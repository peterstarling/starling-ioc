'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function IoC() {
	this.modules = {};
};

var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);

	if (result === null) return [];

	var args = Array.prototype.slice.call(result);

	return args;
}

IoC.prototype.register = function (name, module) {
	this.modules[name] = module;
};

IoC.prototype.resolve = function resolve(module) {
	var _this = this;

	if (typeof module === 'string') {

		if (typeof this.modules[module] === 'undefined') {
			throw new Error('Module "' + module + '" is not registered');
		}

		if ((0, _typeof3.default)(this.modules[module]) === 'object') {
			return this.modules[module];
		}

		return resolve.call(this, this.modules[module]);
		// return new this.modules[module];
	}

	if (typeof module === 'function') {
		return new (Function.prototype.bind.apply(module, [null].concat((0, _toConsumableArray3.default)(getParamNames(module).map(function (d) {
			return resolve.call(_this, d);
		})))))();
	}
};

// let's instantiate the class (function) so that
// the module will be a singleton
exports.default = new IoC();