module.exports = {
  output: 'src/runtime.js',
  includeTypes: true,
  variables: {
    imports: [
      `import { effect as wrap, condition as wrapCondition } from './core';`,
      `import { untracked as ignore } from 'mobx';`
    ],
    classComponents: true,
    wrapNested: true,
    wrapConditionals: true
  }
}