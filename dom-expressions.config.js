module.exports = {
  output: 'src/runtime.js',
  includeTypes: true,
  variables: {
    imports: [
      `import { untracked } from 'mobx'`,
      `import { root as mRoot, cleanup as mCleanup, computed as mComputed } from './core'`
    ],
    computed: 'mComputed',
    sample: 'untracked',
    root: 'mRoot',
    cleanup: 'mCleanup'
  }
}