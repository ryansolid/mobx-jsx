import nodeResolve from 'rollup-plugin-node-resolve';

export default [{
  input: 'src/index.js',
  output: {
    format: 'cjs',
    file: 'lib/index.js'
  },
  external: ['mobx', 'dom-expressions'],
  plugins: [ nodeResolve() ]
}, {
  input: 'src/html.js',
  output: {
    format: 'cjs',
    file: 'lib/html.js'
  },
  external: ['mobx-jsx', 'lit-dom-expressions'],
  plugins: [ nodeResolve() ]
}, {
  input: 'src/h.js',
  output: {
    format: 'cjs',
    file: 'lib/h.js'
  },
  external: ['mobx-jsx', 'hyper-dom-expressions'],
  plugins: [ nodeResolve() ]
}];