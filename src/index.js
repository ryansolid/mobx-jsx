import { createRuntime } from 'babel-plugin-jsx-dom-expressions'
import { autorun, isObservable } from 'mobx'

export default createRuntime({
  wrap(elem, accessor, isAttr, fn) {
    return autorun(() => {
      let value = accessor();
      if (isObservable(value)) {
        return autorun(() => fn(elem, value.get()));
      }
      fn(elem, value);
    });
  }
})