module.exports = {
  output: 'src/runtime.js',
  includeTypes: true,
  variables: {
    imports: [
      `import { computed as wrap } from './core'`
    ],
    classComponents: true
  }
}