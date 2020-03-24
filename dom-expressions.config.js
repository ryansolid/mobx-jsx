module.exports = {
  output: 'src/runtime.js',
  includeTypes: true,
  variables: {
    imports: [
      `import { effect as wrap } from './core';`,
      `import { untracked as ignore } from 'mobx';`
    ],
    classComponents: true
  }
}