import { createRuntime } from 'babel-plugin-jsx-dom-expressions'
import { autorun } from 'mobx'

let globalContext = null;
export const r = createRuntime({
  wrap(fn) {
    let dispose;
    if (fn.length) {
      let current;
      dispose = autorun(() => current = fn(current))
    } else dispose = autorun(fn);
    cleanup(dispose);
  }
})

export function root(fn) {
  let context, d, ret;
  context = globalContext;
  globalContext = {
    disposables: d = []
  };
  ret = fn(function() {
    let disposable, k, len;
    for (k = 0, len = d.length; k < len; k++) {
      disposable = d[k];
      disposable();
    }
    d = [];
  });
  globalContext = context;
  return ret;
};

export function cleanup(fn) {
  let ref;
  return (ref = globalContext) != null ? ref.disposables.push(fn) : void 0;
}