# ADR-004: Attributes are the public state interface

**Date:** 2026-07-28

## Context

A component's state can live in JS properties, in HTML attributes, or
both. Attributes are the interface that works from static HTML, from
server-rendered markup, and from the devtools inspector.

But frameworks set non-string values by property assignment
(`el.disabled = true`), not `setAttribute`. Native elements handle this
through built-in IDL reflection; custom elements have to opt in, or they
silently ignore framework-set values.

## Decision

Attributes are the source of truth. Declare them with the base class's
static arrays rather than hand-writing `observedAttributes` and
accessors:

```ts
class Example extends WebComponent {
    static reflectedBooleanAttributes = ['disabled']
    static reflectedStringAttributes = ['type', 'name']

    declare disabled:boolean
    declare type:string|null
}
```

The base class generates getters and setters and derives
`observedAttributes` automatically. Use `declare` for the TypeScript
types: reflected properties are installed at runtime and are otherwise
invisible to the compiler.

React to changes in a `handleChange_<attribute>` method. The base class
routes `attributeChangedCallback` to it by name:

```ts
handleChange_disabled (oldValue:string|null, newValue:string|null) {
    this.qs('button')?.toggleAttribute('disabled', newValue !== null)
}
```

To observe an attribute that does not need property reflection, extend
the derived list rather than replacing it:

```ts
static get observedAttributes () {
    return [...super.observedAttributes, 'role']
}
```

## Consequences

The component works from plain HTML and from a framework that assigns
properties, without a separate adapter.

Dispatch is by naming convention, not registration. Adding an attribute
means declaring it *and* adding the matching method; a missing handler
is silently skipped. See the Change Handler entry in
[the glossary](../GLOSSARY.md).

A hand-written setter with side effects beyond `toggleAttribute` is
detected and left alone by the base class, so custom logic is still
possible where reflection is not enough.
