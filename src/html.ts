import { createHTML } from "lit-dom-expressions";
import {
  effect,
  style,
  insert,
  createComponent,
  delegateEvents,
  classList,
  dynamicProperty,
  setAttribute,
  setAttributeNS,
  addEventListener,
  Aliases,
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
  createComponent,
  delegateEvents,
  classList,
  dynamicProperty,
  setAttribute,
  setAttributeNS,
  addEventListener,
  Aliases,
  Properties,
  ChildProperties,
  DelegatedEvents,
  SVGElements,
  SVGNamespace
});

export { root, cleanup } from "./index";
