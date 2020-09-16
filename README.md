# MobX JSX

This library is a demonstration of how MobX fine grain control can be leveraged directly in JSX for considerably better performance than pairing it with a Virtual DOM library. Even the fastest Virtual DOM library will have overhead when reconciling many small discreet changes into a scheduled render and patch.

Check out MobX JSX performance near the top of the charts on the [JS Frameworks Benchmark](https://github.com/krausest/js-framework-benchmark).

It accomplishes this with using [Babel Plugin JSX DOM Expressions](https://github.com/ryansolid/babel-plugin-jsx-dom-expressions). It compiles JSX to DOM statements and wraps expressions in functions that can be called by the library of choice. In this case `autorun` wraps these expressions ensuring the view stays up to date. Unlike Virtual DOM only the changed nodes are affected and the whole tree is not re-rendered over and over.

To use call render:

```js
import { render } from 'mobx-jsx';

render(App, document.getElementById('main'));
```

And include 'babel-plugin-jsx-dom-expressions' in your babelrc, webpack babel loader, or rollup babel plugin.

```js
"plugins": [["jsx-dom-expressions", {moduleName: 'mobx-jsx'}]]
```

## Installation

```sh
> npm install mobx-jsx babel-plugin-jsx-dom-expressions
```

## Examples

[Mobx Counter(Functions)](https://codesandbox.io/s/mobx-counterfunctions-3sqv1)

[MobX Counter(Classes)](https://codesandbox.io/s/mobx-counterclasses-uz7g9) [Note: Due to updates the implementation with classes is partial and the future of it uncertain. (see  https://github.com/ryansolid/mobx-jsx/issues/31 )]

[MobX Lazy](https://codesandbox.io/s/mobx-lazy-demo-ev95s)

[Mobx Context](https://codesandbox.io/s/mobx-counter-context-wlu1x)

## API

MobX JSX works both with function and class components(extend Component from this library).

### Note on observable arrays

It also ships a specialize map function for optimal list rendering that takes an observable array as it's first argument. To avoid re-rendering the complete list on changes.

```jsx
import { map } from "mobx-jsx";

const list = observable(["Alpha", "Beta", "Gamma"]);

<ul>{
  map(list, item => <li>{item}</li>)
}</ul>
```

### MobX JSX also supports a Context API.

### Components can be loaded lazily

```jsx
import { render, lazy } from "mobx-jsx";

// use lazy to allow code splitting
const SomeComponent = lazy(() => import("./SomeComponent"));

function App() {
  return (
    <>
      <SomeComponent name={"John"} />
    </>
  );
}

render(App, document.body);
```

### Non-precompiled environments

Alternatively this library supports Tagged Template Literals or HyperScript for non-precompiled environments by installing the companion library and including variants:
```js
import { html } from 'mobx-jsx/html'; // or
import { h } from 'mobx-jsx/h';
```
There is a small performance overhead of using these runtimes but the performance is still very impressive. Tagged Template solution is much more performant that the HyperScript version, but HyperScript opens up compatibility with some companion tooling like:

* [HyperScript Helpers](https://github.com/ohanhi/hyperscript-helpers) Use an element as functions DSL
* [Babel Plugin HTM](https://github.com/developit/htm/tree/master/packages/babel-plugin-htm) Transpile Tagged Template Literals to HyperScript for IE11 compatibility

Further documentation available at: [Lit DOM Expressions](https://github.com/ryansolid/lit-dom-expressions) and [Hyper DOM Expressions](https://github.com/ryansolid/hyper-dom-expressions).
