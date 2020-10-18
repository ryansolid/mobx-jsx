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
  Aliases,
  Properties,
  ChildProperties,
  NonComposedEvents,
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
  Aliases,
  Properties,
  ChildProperties,
  NonComposedEvents,
  SVGElements,
  SVGNamespace
});

export * from "./index";