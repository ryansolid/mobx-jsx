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

// ***************
// Selection handlers
// ***************
function shallowDiff(a, b) {
  let sa = new Set(a), sb = new Set(b);
  return [a.filter(i => !sb.has(i)), (b.filter(i => !sa.has(i)))];
}

export function selectWhen(obsv, handler) {
  return list => {
    let element = null;
    const dispose = autorun(() => {
      const model = obsv();
      if (element) handler(element, false);
      if (element = model && list.find(el => el.model === model)) handler(element, true);
    });
    cleanup(dispose);
    return list;
  }
}

export function selectEach(obsv, handler) {
  return list => {
    let elements = [];
    const dispose = autorun(() => {
      const models = obsv(),
        newElements = list.filter(el => models.indexOf(el.model) > -1),
        [additions, removals] = shallowDiff(newElements, elements);
      additions.forEach(el => handler(el, true));
      removals.forEach(el => handler(el, false));
      elements = newElements;
    });
    cleanup(dispose);
    return list;
  }
}