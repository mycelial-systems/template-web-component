# ADR-001: Build on the `WebComponent` base class

**Date:** 2026-07-28

## Context

A custom element can extend `HTMLElement` directly, but every component
then re-implements the same three things: namespaced event plumbing,
`querySelector` shortcuts, and attribute-to-property reflection. Written
by hand, each component drifts from the others.

`@substrate-system/web-component` is a dependency of this template (not a
dev dependency) and supplies those as a base class.

## Decision

Components extend `WebComponent`, through the `create()` factory:

```ts
import { WebComponent } from '@substrate-system/web-component'

export class Example extends WebComponent.create('example-component') {
    render () { /* ... */ }
}

Example.define()
```

Use the factory, not `class Example extends WebComponent` with
`static TAG`. The two are not equivalent, despite both appearing in the
upstream README.

`WebComponent` declares `TAG` twice: as a static, and as an instance
field defaulting to `''`. `emit()` and `on()` namespace from the
instance field; `static event()` reads the static one. Setting only
`static TAG` leaves the instance field empty, so `el.emit('hello')`
dispatches `':hello'` while a listener registered with
`Example.event('hello')` waits for `'example-component:hello'`. The
event never arrives, and nothing errors. `create()` assigns both.

Tag names are kebab-case, per the custom element naming rules.

## Consequences

Event helpers ([ADR-005](ADR-005-namespaced-events.md)), `qs`/`qsa`, and
reflected attributes ([ADR-004](ADR-004-attributes-as-state.md)) come for
free and behave the same in every component built from this template.

The component gains a runtime dependency. This is deliberate:
`@substrate-system/web-component` sits in `dependencies`, so consumers
install it transitively.

`render()` is abstract on the base class, so every component must
implement it. The base `connectedCallback()` calls it; a subclass that
overrides `connectedCallback` must call `super.connectedCallback()` or
nothing renders.

Unlike `connectedCallback`, `attributeChangedCallback` does not
re-render. Attribute changes update the DOM through their
`handleChange_*` method instead
([ADR-004](ADR-004-attributes-as-state.md)).
