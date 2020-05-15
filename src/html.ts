import { createHTML } from 'lit-dom-expressions';
import { effect, style, insert, createComponent, delegateEvents, classList } from "./index";

export const html = createHTML({
  effect,
  style,
  insert,
  createComponent,
  delegateEvents,
  classList
});

export * from './index';