# template web component

A template for vanilla web components.

## see also

* [Web Component lifecycle methods](https://gomakethings.com/the-web-component-lifecycle-methods/)
* [How to detect when attributes change on a Web Component](https://gomakethings.com/how-to-detect-when-attributes-change-on-a-web-component/)

## use

1. Use the template button in github. Or clone this then
`rm -rf .git && git init`. Then `npm i && npm init`.

* Use the template system to re-name this module and start the docs:
```sh
node ./bin/cli.js
```

__The CLI prompts for several variables__

* `gh-namespace` -- first path segment on github
* `package-name` -- package name, including any namespace.
  eg, `@alice/package`
* `component-name` -- the name of the web component, as used in HTML,
  eg `cool-example`
* `repo-name` -- repository name, the last segment in github URL,
  eg, `github.com/user/repo-name-here`


2. Edit the source code in `src/index.ts`.

3. __Edit things__
    * edit the [build-example](https://github.com/nichoth/template-web-component/blob/c580636f1c912fe2633f7c2478f28b11729c9b80/package.json#L20)
      command in `package.json` so that it has the right path for github pages

## featuring

* compile the source to both ESM and CJS format, and put compiled files in `dist`.
* ignore `dist` and `*.js` in git, but don't ignore them in npm. That way we
  don't commit any compiled code to git, but it is available to consumers.
* use npm's `prepublishOnly` hook to compile the code before publishing to npm.
* use [exports](./package.json#L41) field in `package.json` to make sure the
  right format is used by consumers.
* `preversion` npm hook -- lint
* `version` npm hook -- generate a TOC for the README, and create and add a
  changelog
* `postversion` npm hook -- `git push --follow-tags && npm publish`
* eslint -- `npm run lint`
* tests run in a real browser via
  [tapout](https://github.com/substrate-system/tapout) -- see
  [`npm test`](./package.json#L12). Assertions come from
  [tapzero](https://github.com/bicycle-codes/tapzero). The test bundle
  needs `--bundle`, or bare module specifiers will not resolve in the
  browser.
* CI via github actions
* [stylelint](https://stylelint.io/) -- see
  [preversion npm hook](https://github.com/nichoth/template-web-component/blob/main/package.json#L25)

## the component

The component extends
[`@substrate-system/web-component`](https://github.com/substrate-system/web-component),
which supplies namespaced events, `qs`/`qsa`, and attribute reflection.
The conventions are recorded as
[architecture decision records](./docs/adr/INDEX.md); the vocabulary is
in [the glossary](./docs/GLOSSARY.md).

### attributes

Declare attributes with the static arrays. The base class generates the
getters and setters and derives `observedAttributes` from them, so there
is no `static observedAttributes` to maintain:

```ts
static reflectedStringAttributes = ['example']
static reflectedBooleanAttributes = ['disabled']

declare example:string|null
declare disabled:boolean
```

React to a change in a `handleChange_<attribute>` method.
`attributeChangedCallback` routes to it by name. Dispatch is by
convention, so adding an attribute means declaring it *and* adding the
method -- a missing handler is skipped silently.
See [ADR-004](./docs/adr/ADR-004-attributes-as-state.md).

### events

Emit namespaced events with `emit`, listen with `on`, and build the
event name with the static `event()` helper:

```ts
el.emit('hello', { detail: 'some data' })   // 'cool-example:hello'
el.on('hello', ev => { /* ... */ })
el.addEventListener(Example.event('hello'), ev => { /* ... */ })
```

See [ADR-005](./docs/adr/ADR-005-namespaced-events.md).

### rendering

`render()` is abstract, so every component implements it. The base
`connectedCallback()` calls it; if you override `connectedCallback`,
call `super.connectedCallback()` or nothing renders.

Attribute changes do *not* re-render. Update the DOM in place from the
`handleChange_*` method instead.

### FOUCE

A custom element is inert markup until its JS defines it, which shows up
as a flash of undefined custom element. This template handles it in two
layers, described in
[ADR-006](./docs/adr/ADR-006-fouce-mitigation.md).

`src/index.css` hides the element until it is defined. This ships with
the component:

```css
cool-example:not(:defined) {
    display: none;
}
```

`example/` demonstrates the page-level pattern: a `reduce-fouce` class
on `<html>`, removed once `customElements.whenDefined` resolves for
every component on the page. Two safeguards are required, not optional
-- a `Promise.race` timeout, and a `<noscript>` override. Without them,
a component that never defines leaves the page permanently blank.
