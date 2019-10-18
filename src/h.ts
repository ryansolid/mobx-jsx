/// <reference path="../node_modules/dom-expressions/runtime.d.ts" />
import { createHyperScript } from 'hyper-dom-expressions';
import * as r from './index';

export * from './index';
export const h = createHyperScript(r);