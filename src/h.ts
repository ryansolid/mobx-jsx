/// <reference path="../node_modules/dom-expressions/runtime.d.ts" />
import { createHyperScript } from 'hyper-dom-expressions';
import {
  wrap,
  insert,
  createComponent,
  delegateEvents,
  classList
} from './index';

export * from './index';
export const h = createHyperScript({
  wrap,
  insert,
  createComponent,
  delegateEvents,
  classList
});