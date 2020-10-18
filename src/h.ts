import { createHyperScript } from "hyper-dom-expressions";
import { spread, assign, insert, createComponent, dynamicProperty, SVGElements } from "./index.js";

export const h = createHyperScript({
  spread,
  assign,
  insert,
  createComponent,
  dynamicProperty,
  SVGElements
});

export * from './index';