import {
  autorun,
  computed,
  untracked,
  $mobx,
  IObservableArray,
  observable,
  action,
  IObservableValue
} from "mobx";
import type { JSX } from "./jsx";

type ContextOwner = {
  disposables: any[];
  owner: ContextOwner | null;
  context?: any;
};
export interface Context {
  id: symbol;
  Provider: (props: any) => any;
  defaultValue: unknown;
}

let globalContext: ContextOwner | null = null;

export class Component<T extends { children?: any }> {
  isClassComponent?: boolean;
  props: T;
  constructor(props: T) {
    this.props = props;
  }
  render(props: T) {
    return props.children;
  }
}
Component.prototype.isClassComponent = true;

export function root<T>(fn: (dispose: () => void) => T) {
  let d: any[], ret: T;
  globalContext = {
    disposables: (d = []),
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
}

export function cleanup(fn: () => void) {
  let ref;
  (ref = globalContext) != null && ref.disposables.push(fn);
}

export function effect<T>(fn: (prev?: T) => T, current?: T) {
  const context = {
      disposables: [] as (() => void)[],
      owner: globalContext
    },
    cleanupFn = (final: boolean) => {
      const d = context.disposables;
      context.disposables = [];
      for (let k = 0, len = d.length; k < len; k++) d[k]();
      final && dispose();
    },
    dispose = autorun(() => {
      cleanupFn(false);
      const prev = globalContext;
      globalContext = context;
      current = fn(current);
      globalContext = prev;
    });
  cleanup(() => cleanupFn(true));
}

// only updates when boolean expression changes
export function memo<T>(fn: () => T, equal?: boolean) {
  const o = observable.box(),
    update = action((r: T) => o.set(r));
  effect(prev => {
    const res = fn();
    (!equal || prev !== res) && update(res);
    return res;
  });
  return () => o.get();
}

export function createSelector<T, U extends T>(
  source: () => T,
  fn: (a: U, b: T) => boolean = (a, b) => a === b
) {
  let subs = new Map();
  let v: T;
  effect((p?: U) => {
    v = source();
    const keys = [...subs.keys()];
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      if (fn(key, v) || (p !== undefined && fn(key, p))) {
        const o = subs.get(key);
        o.set(null);
      }
    }
    return v as U;
  });
  return (key: U) => {
    let l: IObservableValue<U> & { _count?: number };
    if (!(l = subs.get(key)))
      subs.set(key, (l = observable.box<U>() as IObservableValue<U> & { _count?: number }));
    l.get();
    l._count ? l._count++ : (l._count = 1);
    cleanup(() => (l._count! > 1 ? l._count!-- : subs.delete(key)));
    return fn(key, v);
  };
}

type PropsWithChildren<P> = P & { children?: JSX.Element };
export type FunctionComponent<P = {}> = (props: PropsWithChildren<P>) => JSX.Element;
type ComponentConstructor<P> =
  | FunctionComponent<P>
  | (new (props: PropsWithChildren<P>) => JSX.Element);

export type ComponentProps<T extends keyof JSX.IntrinsicElements | ComponentConstructor<any>> =
  T extends ComponentConstructor<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : {};

export function createComponent<T extends { children?: JSX.Element }>(
  Comp: Component<T> & FunctionComponent<T>,
  props: T
): JSX.Element {
  if (Comp.prototype && Comp.prototype.isClassComponent) {
    return untracked(() => {
      const comp: Component<T> = new (Comp as any)(props as T);
      return comp.render(props as T);
    });
  }
  return untracked(() => Comp(props as T));
}

// dynamic import to support code splitting
export function lazy<T extends Function>(fn: () => Promise<{ default: T }>) {
  return (props: object) => {
    let Comp: T | undefined;
    const result = observable.box<T>(),
      update = action((component: { default: T }) => result.set(component.default));
    fn().then(update);
    const rendered = computed(() => (Comp = result.get()) && untracked(() => Comp!(props)));
    return () => rendered.get();
  };
}

export { untracked as untrack };

export function splitProps<T extends object, K1 extends keyof T>(
  props: T,
  ...keys: [K1[]]
): [Pick<T, K1>, Omit<T, K1>];
export function splitProps<T extends object, K1 extends keyof T, K2 extends keyof T>(
  props: T,
  ...keys: [K1[], K2[]]
): [Pick<T, K1>, Pick<T, K2>, Omit<T, K1 | K2>];
export function splitProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
  K3 extends keyof T
>(
  props: T,
  ...keys: [K1[], K2[], K3[]]
): [Pick<T, K1>, Pick<T, K2>, Pick<T, K3>, Omit<T, K1 | K2 | K3>];
export function splitProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
  K3 extends keyof T,
  K4 extends keyof T
>(
  props: T,
  ...keys: [K1[], K2[], K3[], K4[]]
): [Pick<T, K1>, Pick<T, K2>, Pick<T, K3>, Pick<T, K4>, Omit<T, K1 | K2 | K3 | K4>];
export function splitProps<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T,
  K3 extends keyof T,
  K4 extends keyof T,
  K5 extends keyof T
>(
  props: T,
  ...keys: [K1[], K2[], K3[], K4[], K5[]]
): [
  Pick<T, K1>,
  Pick<T, K2>,
  Pick<T, K3>,
  Pick<T, K4>,
  Pick<T, K5>,
  Omit<T, K1 | K2 | K3 | K4 | K5>
];
export function splitProps<T>(props: T, ...keys: [(keyof T)[]]) {
  const descriptors = Object.getOwnPropertyDescriptors(props),
    split = (k: (keyof T)[]) => {
      const clone: Partial<T> = {};
      for (let i = 0; i < k.length; i++) {
        const key = k[i];
        if (descriptors[key]) {
          Object.defineProperty(clone, key, descriptors[key]);
          delete descriptors[key];
        }
      }
      return clone;
    };
  return keys.map(split).concat(split(Object.keys(descriptors) as (keyof T)[]));
}

// context api
export function createContext(defaultValue?: unknown): Context {
  const id = Symbol("context");
  return { id, Provider: createProvider(id), defaultValue };
}

export function useContext(context: Context) {
  return lookup(globalContext, context.id) || context.defaultValue;
}

function lookup(owner: ContextOwner | null, key: symbol | string): any {
  return (
    owner && ((owner.context && owner.context[key]) || (owner.owner && lookup(owner.owner, key)))
  );
}

function resolveChildren(children: any): any {
  if (typeof children === "function") {
    const c = observable.box(),
      update = action((child: any) => c.set(child));
    effect(() => update(children()));
    return () => c.get();
  }
  if (Array.isArray(children)) {
    const results: any[] = [];
    for (let i = 0; i < children.length; i++) {
      let result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}

function createProvider(id: symbol) {
  return function provider(props: { value: unknown; children: any }) {
    let rendered = observable.box(),
      update = action(() => rendered.set(resolveChildren(props.children)));
    effect(() => {
      globalContext!.context = { [id]: props.value };
      update();
    });
    return () => rendered.get();
  };
}

// Modified version of mapSample from S-array[https://github.com/adamhaile/S-array] by Adam Haile
export function map<T, U>(
  list: (IObservableArray<T> & { [$mobx]: any }) | (() => Array<T>),
  mapFn: (v: T, i: number) => U | any
) {
  let items = [] as T[],
    mapped = [] as U[],
    disposers = [] as (() => void)[],
    fn = typeof list === "function",
    len = 0;
  cleanup(() => {
    for (let i = 0, length = disposers.length; i < length; i++) disposers[i]();
  });
  return () => {
    let newItems = fn ? (list as () => Array<T>)() : (list as T[]),
      i: number,
      j: number;
    !fn && (list as IObservableArray<T> & { [$mobx]: any })[$mobx].atom_.reportObserved();
    return untracked(() => {
      let newLen = newItems.length,
        newIndices: Map<T, number>,
        newIndicesNext: number[],
        temp: U[],
        tempdisposers: (() => void)[],
        start: number,
        end: number,
        newEnd: number,
        item: T;

      // fast path for empty arrays
      if (newLen === 0) {
        if (len !== 0) {
          for (i = 0; i < len; i++) disposers[i]();
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
        }
      } else if (len === 0) {
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = root(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);

        // skip common prefix
        for (
          start = 0, end = Math.min(len, newLen);
          start < end && items[start] === newItems[start];
          start++
        );

        // common suffix
        for (
          end = len - 1, newEnd = newLen - 1;
          end >= start && newEnd >= start && items[end] === newItems[newEnd];
          end--, newEnd--
        ) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
        }

        // remove any remaining nodes and we're done
        if (start > newEnd) {
          for (j = end; start <= j; j--) disposers[j]();
          const rLen = end - start + 1;
          if (rLen > 0) {
            mapped.splice(start, rLen);
            disposers.splice(start, rLen);
          }
          items = newItems.slice(0);
          len = newLen;
          return mapped;
        }

        // insert any remaining updates and we're done
        if (start > end) {
          for (j = start; j <= newEnd; j++) mapped[j] = root(mapper);
          for (; j < newLen; j++) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
          }
          items = newItems.slice(0);
          len = newLen;
          return mapped;
        }

        // 0) prepare a map of all indices in newItems, scanning backwards so we encounter them in natural order
        newIndices = new Map<T, number>();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item)!;
          newIndicesNext[j] = i === undefined ? -1 : i;
          newIndices.set(item, j);
        }
        // 1) step through all old items and see if they can be found in the new set; if so, save them in a temp array and mark them moved; if not, exit them
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item)!;
          if (j !== undefined && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        // 2) set all the new values, pulling from the temp array if copied, otherwise entering the new value
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
          } else mapped[j] = root(mapper);
        }
        // 3) in case the new set is shorter than the old, set the length of the mapped array
        len = mapped.length = newLen;
        // 4) save a copy of the mapped items for the next update
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer: () => void) {
      disposers[j] = disposer;
      return mapFn(newItems[j], j);
    }
  };
}
