# svelte-action-touch-to-mouse #

Svelte action that maps touch events to mouse events.

**NPM users**: please consider the [Github README](https://github.com/Egnus/svelte-action-touch-to-mouse/blob/main/README.md) for the latest description of this package (as updating the docs would otherwise always require a new NPM package version)

> Note: this code generates events of type `mousemove`, `mousedown` and `mouseup` - it does _not_ (yet) generate `mouseenter`, `mouseleave`, `mouseover` or `mouseout` events. Additionally, `mousemove` events continue to fire even after the touchpoint has left the HTML element where the touch started

> Just a small note: if you like this module and plan to use it, consider "starring" this repository (you will find the "Star" button on the top right of this page), so that I know which of my repositories to take most care of.

## Installation ##

`svelte-action-touch-to-mouse` may be used as an ECMAScript module (ESM) or CommonJS **Svelte uses modules, it is highly recommended to use ESM**.

You may either install the package into your build environment using NPM, Yarn or PNPM

```
npm install svelte-action-touch-to-mouse
// or
yarn add svelte-action-touch-to-mouse
// or
pnpm add svelte-action-touch-to-mouse
```


## Access ##

How to access the package depends on the type of module you prefer

* ESM (or Svelte): `import { touchToMouse } from 'svelte-action-touch-to-mouse';`
* CommonJS: `const { touchToMouse } = require('svelte-action-touch-to-mouse')`

## Usage within Svelte ##

For Svelte, it is recommended to import the package in a module context. From then on, its exports may be used as usual:

```html
<script lang="ts">
  import { touchToMouse } from 'svelte-action-touch-to-mouse';
  let dragging = false;
  const onMouseMove = (event: MouseEvent) => {
    // we are capturing touch events as well, mapped to mouse events
  }
  const onMouseDown = (event: MouseEvent) => (dragging = true)
  const onMouseUp = (event: MouseEvent) => (dragging = false)
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<button use:touchToMouse on:mousedown={onMouseDown}>
  it doesn't have to be a button, it just works.
</button>
```

## Parameters
`touchToMouse` can accept `deep` as a parameter, a bolean defaulting to `false`.

This allows to track down inner elements that are contained in the desired Element and trigger the click action with it as well.

This is normally not necessary but iOS devices might be unable to untrack touch events from inner elements even if `pointer-events:none;` has been set in the inner components to avoid undesired clicks in those elements.

An example of a suitable moment to use it can be shown here:
```html
<script lang="ts">
  ...
</script>
...
<button use:touchToMouse on:mousedown={onMouseDown}>
  <span style="pointer-events:none;">We want to ignore if we touch this, but still it gets clicked as target on iOS devices</span>
  <span style="pointer-events:none;">or this <img src="/drag-icon.svg" /></span>
</button>
```
To solve this you can use `use:touchToMouse={{deep: true}}` like this:
```html
<button use:touchToMouse={{deep: true}} on:mousedown={onMouseDown}>
  <span style="pointer-events:none;">Now it works as expected</span>
  <span style="pointer-events:none;"><img src="/drag-icon.svg" /></span>
</button>
```

## Examples ##

If you want more examples let me know and I will add some fully working examples.

## Background Information ##

There still exist numerous JavaScript libraries and frameworks dealing with `MouseEvent`s only - ignoring the `TouchEvent`s used on mobile devices. This simple module maps `TouchEvent`s to corresponding `MouseEvent`s and, thus, allows such libraries to be used on mobile devices as well.

It does so by mapping events for certain HTML elements only in order to avoid undesired side effects on other elements.

`<element use:touchToMouse use:otherLibrariesWithOnlyMouseEvents on:mousedown={onlyMouseEvents}></element>`

**Important Note**

This Svelte action will add some classes to the element to avoid the entire web-app to be dragging with it or for the `MouseEvent` consumers to work as expected.

```
-webkit-touch-callout:none;
-ms-touch-action:none;
touch-action:none;
```

Also, consider adding `touch-action:none` to any nested element that also contains `pointer-events:none` for iOS compatibility.

## Build Instructions ##

You may easily build this package yourself.

Just install [NPM](https://docs.npmjs.com/) according to the instructions for your platform and follow these steps:

1. either clone this repository using [git](https://git-scm.com/) or [download a ZIP archive](https://github.com/Egnus/svelte-action-touch-to-mouse/archive/refs/heads/main.zip) with its contents to your disk and unpack it there
2. open a shell and navigate to the root directory of this repository
3. run `npm install` in order to install the complete build environment
4. execute `npm run build` to create a new build


## License ##

[MIT License](LICENSE.md)
