# ADR-005: Emit namespaced custom events

**Date:** 2026-07-28

## Context

Components communicate outward by dispatching events. Plain names like
`change` or `close` collide with native events and with other
components' events once several are on the same page, and a listener
cannot tell which component a bare `change` came from.

## Decision

Emit namespaced events by default, using the base class helpers from
[ADR-001](ADR-001-web-component-base-class.md). The namespace is the tag
name, joined with a colon:

```ts
el.emit('hello', { detail: 'some data' })   // => 'example-component:hello'
```

Get the namespaced name with the static `event()` helper rather than
building the string by hand, so the tag name is never duplicated:

```ts
el.addEventListener(Example.event('hello'), ev => { /* ... */ })
el.on('hello', ev => { /* ... */ })   // shorthand for the same thing
```

`emit`/`on`/`off`/`event` are the namespaced set. `dispatch(type, opts)`
emits a non-namespaced event and is the deliberate exception, for cases
where a bare native-style name is wanted.

Wildcard listeners are not available on the plain base class. They live
in `@substrate-system/web-component/wildcard`; a component that needs
them extends `WildcardComponent` or wraps its base with
`withWildcards()`.

## Consequences

Event names are unambiguous on a page with many components, and a
listener never has to guess the source.

Consumers cannot listen for `'hello'`; they must use
`Example.event('hello')` or the `on()` shorthand, which means importing
the class. This is documented in the component's README rather than
being discoverable from the markup.

Renaming a component's tag renames every event it emits. That is a
breaking change for consumers even though no event name was edited.

Keeping wildcards in a separate module keeps the core small, at the cost
of an extra decision when a component needs them.
