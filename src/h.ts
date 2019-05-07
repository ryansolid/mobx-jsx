import { createHyperScript } from 'hyper-dom-expressions';
import * as r from './index';

export { root, cleanup, selectWhen, selectEach } from './index';
export const h = createHyperScript(r);