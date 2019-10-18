export * from './core'
export * from './runtime'
import { root } from './core';
import { insert, hydration, startSSR } from "./runtime";

type MountableElement = Element | Document | ShadowRoot | DocumentFragment;


export function render(code: () => any, mount: MountableElement): () => void {
  let dispose: () => void;
  root(disposer => {
    dispose = disposer;
    insert(mount, code());
  });
  return dispose!;
}

export function renderSSR(code: () => any, element: MountableElement): () => void {
  startSSR();
  return render(code, element);
}

export function hydrate(code: () => any, element: MountableElement): () => void {
  let disposer: () => void;
  hydration(() => {
    disposer = render(code, element);
  }, element);
  return disposer!;
}