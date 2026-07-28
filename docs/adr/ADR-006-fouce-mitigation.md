# ADR-006: Mitigate FOUCE in two layers

**Date:** 2026-07-28

## Context

A custom element is inert markup until its JS runs and calls
`customElements.define()`. Between first paint and definition the
browser renders the element's raw children with no component styling.
This is a FOUCE, a flash of undefined custom element.

The CSS `:defined` pseudo-class solves the single-element case, but it
has a failure mode: if JS never runs, the element stays hidden forever.
It also does not coordinate across a page of several components, where
each one appears independently and the layout shifts repeatedly.

## Decision

Two layers, at two different scopes.

**Component level, shipped in `src/index.css`.** Each component hides
itself until defined. This travels with the component, so a consumer
who imports the stylesheet gets it without doing anything:

```css
example-component:not(:defined) {
    display: none;
}
```

**Page level, demonstrated in `example/`.** The page hides itself until
the components it uses are defined, then reveals everything at once:

```html
<html class="reduce-fouce">
```

```css
html.reduce-fouce { opacity: 0; }
```

```js
await Promise.race([
    Promise.allSettled([
        customElements.whenDefined('example-component')
    ]),
    new Promise(resolve => setTimeout(resolve, 2000))
])

document.documentElement.classList.remove('reduce-fouce')
```

Two safeguards are required, not optional. The `Promise.race` timeout
reveals the page after two seconds even if a component never defines. A
`<noscript>` block reveals it when JS is disabled entirely:

```html
<noscript>
    <style>html.reduce-fouce { opacity: 1 !important; }</style>
</noscript>
```

## Consequences

No flash of unstyled children, and one coordinated reveal instead of
components popping in one at a time.

The page-level layer is the one that can hide content permanently, which
is why the timeout and the `noscript` fallback are mandatory. Omitting
either turns a cosmetic problem into a blank page.

The page-level pattern cannot ship with the component, since it belongs
to the host document. The template demonstrates it in `example/` and the
component's README has to tell consumers to adopt it.

Component-level `:not(:defined)` uses `display: none` here rather than
`visibility: hidden`, so undefined elements take up no space. That
trades a possible layout shift on definition for not reserving space for
something that may never appear.
