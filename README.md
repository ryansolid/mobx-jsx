# MobX JSX

This library is a demonstration of how MobX fine grain control can be leveraged directly in JSX for considerably better performance than pairing it with a Virtual DOM library. Even the fastest Virtual DOM library will have overhead when reconciling many small discreet changes into a scheduled render and patch.

Check out MobX JSX performance near the top of the charts on the [JS Frameworks Benchmark](https://github.com/krausest/js-framework-benchmark).

It accomplishes this with using [Babel Plugin JSX DOM Expressions](https://github.com/ryansolid/babel-plugin-jsx-dom-expressions). It compiles JSX to DOM statements and by using inner parenthesis syntax ```{( )}``` wraps expressions in functions that can be called by the library of choice. In this case autorun wrap these expressions ensuring the view stays up to date. Unlike Virtual DOM only the changed nodes are affected and the whole tree is not re-rendered over and over.

To use simply wrap your code in a root:

```js
import { root } from 'mobx-jsx';

root(() => document.body.appendChild(<App />))
```

And include 'babel-plugin-jsx-dom-expressions' in your babelrc, webpack babel loader, or rollup babel plugin.

```js
"plugins": [["jsx-dom-expressions", {moduleName: 'mobx-jsx'}]]
```

# Installation

```sh
> npm install mobx-jsx babel-plugin-jsx-dom-expressions
```

## API

Control flow is handled through a special $ JSX element that compiles down to optimized reconciled code that supports conditionals `when`, loops `each`, separate render trees `portal`, and async offscreen rendering `suspend`. Example:

```jsx
const list = observable(["Alpha", "Beta", "Gamma"]);

<ul>
  <$ each={state.list}>{item => <li>{item}</li>}</$>
</ul>
```

Alternatively this library supports Tagged Template Literals or HyperScript for non-precompiled environments by installing the companion library and including variants:
```js
import { html } from 'mobx-jsx/html'; // or
import { h } from 'mobx-jsx/h';
```
There is a small performance overhead of using these runtimes but the performance is still very impressive. Tagged Template solution is much more performant that the HyperScript version, but HyperScript opens up compatibility with some companion tooling like:

* [HyperScript Helpers](https://github.com/ohanhi/hyperscript-helpers) Use an element as functions DSL
* [Babel Plugin HTM](https://github.com/developit/htm/tree/master/packages/babel-plugin-htm) Transpile Tagged Template Literals to HyperScript for IE11 compatibility

Further documentation available at: [Lit DOM Expressions](https://github.com/ryansolid/lit-dom-expressions) and [Hyper DOM Expressions](https://github.com/ryansolid/hyper-dom-expressions).
