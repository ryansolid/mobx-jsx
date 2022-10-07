import { createHTML } from "lit-dom-expressions";
import {
  effect,
  style,
  insert,
  untrack,
  spread,
  createComponent,
  delegateEvents,
  classList,
  dynamicProperty,
  mergeProps,
  setAttribute,
  setAttributeNS,
  addEventListener,
  Aliases,
  PropAliases,
  Properties,
  ChildProperties,
  DelegatedEvents,
  SVGElements,
  SVGNamespace
} from "./index.js";

export const html = createHTML({
  effect,
  style,
  insert,
  untrack,
  spread,
  createComponent,
  delegateEvents,
  classList,
  mergeProps,
  dynamicProperty,
  setAttribute,
  setAttributeNS,
  addEventListener,
  Aliases,
  PropAliases,
  Properties,
  ChildProperties,
  DelegatedEvents,
  SVGElements,
  SVGNamespace
});

export { root, cleanup } from "./index";
