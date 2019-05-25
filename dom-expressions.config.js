module.exports = {
  output: 'src/runtime.js',
  includeTypes: true,
  variables: {
    imports: [
      `import { untracked as sample } from 'mobx'`,
      `import {
        root, cleanup, computed as wrap, setContext,
        registerSuspense, getContextOwner as currentContext
      } from './core'`
    ],
    includeContext: true
  }
}