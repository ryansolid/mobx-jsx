import { autorun, untracked, $mobx, IObservableArray } from 'mobx'

type ContextOwner = { disposables: any[], owner: ContextOwner | null, context?: any };
export interface Context { id: symbol, Provide: (props: any) => any };

let globalContext: ContextOwner | null = null;

export class Component {
  isClassComponent?: boolean;
}
Component.prototype.isClassComponent = true;

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

export function createContext(initFn?: Function): Context {
  const id = Symbol('context');
  return { id, Provide: createProvider(id, initFn) };
}

export function useContext(context: Context) {
  if (globalContext === null) return console.warn("Context keys cannot be looked up without a root or parent");
  return lookup(globalContext, context.id);
}

function lookup(owner: ContextOwner, key: symbol | string): any {
  return (owner && owner.context && owner.context[key]) || (owner.owner && lookup(owner.owner, key));
}

function createProvider(id: symbol, initFn?: Function) {
  return (props: any) => {
    let rendered;
    computed(() => {
      untracked(() => {
        const context = globalContext!.context || (globalContext!.context = {});
        context[id] = initFn ? initFn(props.value) : props.value;
        rendered = props.children;
      });
    });
    return rendered;
  }
}

// Modified version of mapSample from S-array[https://github.com/adamhaile/S-array] by Adam Haile
export function map<T, U>(
  list: IObservableArray<T> & {[$mobx]: any},
  mapFn: (v: T, i: number) => U | any,
) {
  let items = [] as T[],
    mapped = [] as U[],
    disposers = [] as (() => void)[],
    len = 0;
  cleanup(() => {
    for (let i = 0, length = disposers.length; i < length; i++) disposers[i]();
  })
  return () => {
    list[$mobx].atom.reportObserved();
    let newItems = list,
      i: number,
      j: number;
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
      }
      else if (len === 0) {
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = root(mapper);
        }
        len = newLen;
      }
      else {
        // skip common prefix
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++)
        ;
        // fast path for addition
        if (start >= len && len <= newLen) {
          for (j = start; j < newLen; j++) {
            items[j] = newItems[j];
            mapped[j] = root(mapper);
          }
          len = newLen;
          return mapped;
        }

        newIndices = new Map<T, number>();
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);

        for (end = len - 1, newEnd = newLen - 1; end >= 0 && newEnd >= 0 && items[end] === newItems[newEnd]; end-- , newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
        }
        // 0) prepare a map of all indices in newItems, scanning backwards so we encounter them in natural order
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
          }
          else disposers[i]();
        }
        // 2) set all the new values, pulling from the temp array if copied, otherwise entering the new value
        for (j = start; j < newLen; j++) {
          if (temp.hasOwnProperty(j)) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
          }
          else mapped[j] = root(mapper);
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
