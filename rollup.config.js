import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

const plugins = [
  nodeResolve({
    extensions: ['.js', '.ts']
  }),
  babel({
    extensions: ['.js', '.ts'],
    presets: ["@babel/preset-typescript"],
    exclude: 'node_modules/**',
    retainLines: true
  })
];

export default [{
  input: 'src/index.ts',
  output: [{
    format: 'cjs',
    file: 'lib/index.js'
  }, {
    format: 'es',
    file: 'dist/index.js'
  }],
  external: ['mobx', 'dom-expressions'],
  plugins
}, {
  input: 'src/html.ts',
  output: [{
    format: 'cjs',
    file: 'lib/html.js'
  }, {
    format: 'es',
    file: 'dist/html.js'
  }],
  external: ['./index', 'lit-dom-expressions'],
  plugins
}, {
  input: 'src/h.ts',
  output: [{
    format: 'cjs',
    file: 'lib/h.js'
  }, {
    format: 'es',
    file: 'dist/h.js'
  }],
  external: ['./index', 'hyper-dom-expressions'],
  plugins
}];