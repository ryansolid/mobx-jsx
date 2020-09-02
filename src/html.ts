import { createHTML } from "lit-dom-expressions";
import { effect, style, insert, createComponent, delegateEvents, classList, dynamicProperty } from "./index";

export const html = createHTML({
  effect,
  style,
  insert,
  createComponent,
  delegateEvents,
  classList,
  dynamicProperty
});

export * from "./index";