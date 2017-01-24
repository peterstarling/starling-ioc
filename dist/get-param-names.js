"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ARROW_ARG = /^([^(]+?)=>/;
const FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const extractArgs = (fn) => {
    const fnText = fn.toString().replace(STRIP_COMMENTS, "");
    const args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
    return args;
};
exports.getParamNames = (fn) => {
    const $inject = [];
    if (fn.length) {
        const argDecl = extractArgs(fn);
        argDecl[1].split(FN_ARG_SPLIT).forEach(arg => arg.replace(FN_ARG, (_1, _2, name) => {
            $inject.push(name);
        }));
    }
    return $inject;
};
