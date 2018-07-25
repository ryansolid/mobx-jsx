import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    format: 'cjs',
    file: 'lib/index.js'
  },
  external: ['mobx', 'babel-plugin-jsx-dom-expressions'],
  plugins: [
    nodeResolve({ extensions: ['.js'] })
  ]
};