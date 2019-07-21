export * from './core'
export * from './runtime'
import { root } from './core';
import { insert } from './runtime';

export function render(code: () => any, mount: HTMLElement) {
  let dispose;
  root(disposer => {
    dispose = disposer;
    insert(mount, code());
  });
  return dispose;
}