const ARROW_ARG = /^([^(]+?)=>/;
const FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

const extractArgs = (fn: Function) => {
  const fnText = fn.toString().replace(STRIP_COMMENTS, "");
  const args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);

  return args;
};

export const getParamNames = (fn: Function): string[] => {
  const $inject: string[] = [];

  if (fn.length) {
    const argDecl = extractArgs(fn);

    argDecl![1].split(FN_ARG_SPLIT).forEach(arg =>
      arg.replace(
        FN_ARG,
        (_1: any, _2: any, name: string): any => {
          $inject.push(name);
        }
      )
    );
  }

  return $inject;
};
