import { autorun, untracked, observable, IObservableValue } from 'mobx'

type ContextOwner = { disposables: any[], owner: ContextOwner | null, context?: any };
interface Context { id: symbol, initFn: Function };

let globalContext: ContextOwner | null = null;

export function getContextOwner() { return globalContext; }

export function root<T>(fn: (dispose: () => void) => T) {
  let d: any[], ret: T;
  globalContext = {
    disposables: d = [],
    owner: globalContext
  };
  ret = untracked(() =>
    fn(() => {
      let k, len: number;
      for (k = 0, len = d.length; k < len; k++) d[k]();
      d = [];
    })
  );
  globalContext = globalContext.owner;
  return ret;
};

export function cleanup(fn: () => void) {
  let ref;
  (ref = globalContext) != null && ref.disposables.push(fn);
}

export function computed<T>(fn: (prev?: T) => T) {
  let current: T, d: any[];
  const context = {
      disposables: d = [],
      owner: globalContext
    },
    dispose = autorun(() => {
      for (let k = 0, len = d.length; k < len; k++) d[k]();
      d = [];
      globalContext = context;
      current = fn(current)
      globalContext = globalContext.owner;
    });
  cleanup(() => {
    for (let k = 0, len = d.length; k < len; k++) d[k]();
    dispose();
  });
}

function lookup(owner: ContextOwner, key: symbol | string): any {
  return (owner && owner.context && owner.context[key]) || (owner.owner && lookup(owner.owner, key));
}

export function setContext(key: symbol | string, value: any) {
  if (globalContext === null) return console.warn("Context keys cannot be set without a root or parent");
  const context = globalContext.context || (globalContext.context = {});
  context[key] = value;
}

export function createContext(initFn: any) {
  const id = Symbol('context');
  return { id, initFn };
}

export function useContext(context: Context) {
  if (globalContext === null) return console.warn("Context keys cannot be looked up without a root or parent");
  return lookup(globalContext, context.id);
}

// Suspense Context
export const SuspenseContext = createContext(() => {
  let counter = 0;
  const obsv = observable.box(0),
    store = {
      increment: () => ++counter === 1 && !store.initializing && obsv.set(counter),
      decrement: () => --counter === 0 && obsv.set(counter),
      suspended: () => {
        obsv.get();
        return !!counter;
      },
      initializing: true
    }
  return store;
});

// used in the runtime to seed the Suspend control flow
export function registerSuspense(fn: (o: { suspended: () => any, initializing: boolean }) => void) {
  computed(() => {
    const c = SuspenseContext.initFn();
    setContext(SuspenseContext.id, c);
    fn(c);
    c.initializing = false;
  });
};

// lazy load a function component asyncronously
export function lazy<T extends Function>(fn: () => Promise<{default: T}>) {
  return (props: object) => {
    const getComp = loadResource(fn().then(mod => mod.default))
    let Comp: T | undefined;
    return () => (Comp = getComp()) && untracked(() => (Comp as T)(props));
  }
}

// load any async resource and return an accessor
export function loadResource<T>(p: Promise<T>) {
  const { increment, decrement } = useContext(SuspenseContext) || { increment: undefined, decrement: undefined};
  const results = observable.box<T | undefined>(),
    error = observable.box<any>();
  increment && increment();
  p.then(data => results.set(data))
    .catch(err => error.set(err))
    .finally(() => decrement && decrement());
  (results as (any & { error: () => any})).error = error;
  return results.get.bind(results);
}