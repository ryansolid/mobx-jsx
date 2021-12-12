# MobX JSX

This library is a demonstration of how MobX fine grain control can be leveraged directly in JSX for considerably better performance than pairing it with a Virtual DOM library. Even the fastest Virtual DOM library will have overhead when reconciling many small discrete changes into a scheduled render and patch.

Check out MobX JSX performance near the top of the charts on the [JS Frameworks Benchmark](https://github.com/krausest/js-framework-benchmark).

It accomplishes this with using [Babel Plugin JSX DOM Expressions](https://github.com/ryansolid/dom-expressions/tree/master/packages/babel-plugin-jsx-dom-expressions). It compiles JSX to DOM statements and wraps expressions in functions that can be called by the library of choice. In this case `autorun` wraps these expressions ensuring the view stays up to date. Unlike Virtual DOM only the changed nodes are affected and the whole tree is not re-rendered over and over.

## Usage

To use call render as follow

```js
import { render } from "mobx-jsx";

render(App, document.getElementById("main"));
```

And include 'babel-plugin-jsx-dom-expressions' in your babelrc, webpack babel loader, or rollup babel plugin.

```js
"plugins": [["babel-plugin-jsx-dom-expressions", {moduleName: 'mobx-jsx'}]]
```

See [plugin options](https://github.com/ryansolid/dom-expressions/tree/master/packages/babel-plugin-jsx-dom-expressions#plugin-options)

For TS JSX types add to your `tsconfig.json`:

```js
"jsx": "preserve",
"jsxImportSource": "mobx-jsx"
```

## Installation

```sh
> npm install mobx-jsx babel-plugin-jsx-dom-expressions
```

## Examples

- [Counter Using Functions](https://codesandbox.io/s/mobx-counterfunctions-3sqv1)
- [Counter Using Classes](https://codesandbox.io/s/mobx-counterclasses-uz7g9)
- [Lazy Loading](https://codesandbox.io/s/mobx-lazy-demo-ev95s)
- [Context](https://codesandbox.io/s/mobx-counter-context-wlu1x)

## API

MobX JSX works both with function and Class components (extend Component from this library).

### Map For Observable Arrays

Ships a specialize map function for optimal list rendering that takes an observable array as it's first argument. To avoid re-rendering the complete list on changes.

```jsx
import { map } from "mobx-jsx";

const list = observable(["Alpha", "Beta", "Gamma"]);

<ul>
  {map(list, item => (
    <li>{item}</li>
  ))}
</ul>;
```

### Lifecycles

Unlike React `render` only runs once, so you may not need to split in functions or methods your Lifecycles, all the initialization code could be set on `render`. See the issue [Lifecycles](https://github.com/ryansolid/mobx-jsx/issues/23) for furter information.

However, you may emulate `componentDidMount` and `componentWillUnmount`. The microtak`Promise` resolution will be after mount and `cleanup` runs at the beginning of re-evaluation so the elements aren't removed yet.

#### Example

```jsx
import { render, cleanup, Component as _Component } from "mobx-jsx";

class Component extends _Component {
  constructor(props) {
    super(props);
    if (this.componentDidMount) {
      Promise.resolve().then(() => this.componentDidMount());
    }
    if (this.componentWillUnmount) {
      cleanup(() => this.componentWillUnmount());
    }
  }
}

class App extends Component {
  componentDidMount() {
    console.log("componentDidMount");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
}
```

### Mounting

Mounting can be done by functions and not class components. However you may use an arrow function as follows:

```jsx
import { render, Component } from "mobx-jsx";

class App extends Component {
  render() {
    return <div>Mounted</div>
  }
}

render(() => <App />, document.body);
```

### References

`ref` assigns to a variable and `forwardRef` uses a function form. 


```jsx
let elRef;
Promise.resolve().then(() => elRef.clientWidth);
<div ref={elRef} />
```

or 

```jsx
let elRef;
Promise.resolve().then(() => elRef.clientWidth);
<div forwardRef={ref => elRef = ref} />
```

Note: Promise.resolve().then is used as `mount` see the issue [Lifecycles](https://github.com/ryansolid/mobx-jsx/issues/23) for furter information.

### Lazily Loading a Component

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

### MobX JSX also supports a Context API.

## Non-precompiled environments

Alternatively supports Tagged Template Literals or HyperScript for non-precompiled environments by installing the companion library and including variants:

```js
import { html } from "mobx-jsx/html"; // or
import { h } from "mobx-jsx/h";
```

There is a small performance overhead of using these runtimes but the performance is still very impressive. Tagged Template solution is much more performant that the HyperScript version, but HyperScript opens up compatibility with some companion tooling like:

- [HyperScript Helpers](https://github.com/ohanhi/hyperscript-helpers) Use an element as functions DSL
- [Babel Plugin HTM](https://github.com/developit/htm/tree/master/packages/babel-plugin-htm) Transpile Tagged Template Literals to HyperScript for IE11 compatibility

Further documentation available at: [Lit DOM Expressions](https://github.com/ryansolid/lit-dom-expressions) and [Hyper DOM Expressions](https://github.com/ryansolid/hyper-dom-expressions).
