import { createHyperScript } from "hyper-dom-expressions";
import { spread, assign, insert, createComponent, delegateEvents } from "./index";

export const h = createHyperScript({
  spread,
  assign,
  insert,
  createComponent,
  delegateEvents
});

export * from './index';