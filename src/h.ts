import { createHyperScript } from "hyper-dom-expressions";
import { spread, assign, insert, createComponent, dynamicProperty } from "./index";

export const h = createHyperScript({
  spread,
  assign,
  insert,
  createComponent,
  dynamicProperty
});

export * from './index';