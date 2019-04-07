# MobX JSX

This library is a demonstration of how MobX fine grain control can be leveraged directly in JSX for considerably better performance than pairing it with a Virtual DOM library. Even the fastest Virtual DOM library will have overhead when reconciling many small discreet changes into a scheduled render and patch.

It accomplishes this with using [Babel Plugin JSX DOM Expressions](https://github.com/ryansolid/babel-plugin-jsx-dom-expressions). It compiles JSX to DOM statements and by using inner parenthesis syntax ```{( )}``` wraps expressions in functions that can be called by the library of choice. In this case autorun wrap these expressions ensuring the view stays up to date. Unlike Virtual DOM only the changed nodes are affected and the whole tree is not re-rendered over and over.

To use simply import r:

```js
import { r } from 'mobx-jsx'
```

And include 'babel-plugin-jsx-dom-expressions' in your babelrc, webpack babel loader, or rollup babel plugin.

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
This library supports HyperScript instead of JSX albeit at a performance cost include by:
```js
import { h } from 'mobx-jsx'
```

Further documentation available at: [DOM Expressions](https://github.com/ryansolid/dom-expressions)
