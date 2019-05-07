import { autorun, untracked } from 'mobx'

type Context = { disposables: any[] };
let globalContext: Context;

export function root<T>(fn: (dispose: () => void) => T) {
  let context, d: any[], ret: T;
  context = globalContext;
  globalContext = {
    disposables: d = []
  };
  ret = untracked(() =>
    fn(() => {
      let disposable, k, len: number;
      for (k = 0, len = d.length; k < len; k++) {
        disposable = d[k];
        disposable();
      }
      d = [];
    })
  );
  globalContext = context;
  return ret;
};

export function cleanup(fn: () => void) {
  let ref;
  (ref = globalContext) != null && ref.disposables.push(fn);
}

export function computed<T>(fn: (prev?: T) => T) {
  let current: T,
    dispose = autorun(() => current = fn(current));
  cleanup(dispose);
}