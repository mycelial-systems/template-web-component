# ADR-002: Register elements idempotently

**Date:** 2026-07-28

## Context

`customElements.define()` throws if a tag name is already registered.
A component that self-registers at import time will crash the page when
it gets imported twice, which happens easily with mixed ESM/CJS
resolution, duplicate versions in a dependency tree, or hot reload.

A published component cannot control how many times it is imported.

## Decision

Never call `customElements.define()` directly. Register through
`define(name, element)` from `@substrate-system/web-component/util`,
which checks `isRegistered(name)` first and returns without throwing if
the name is taken.

`Example.define()` on a class extending `WebComponent`
([ADR-001](ADR-001-web-component-base-class.md)) does the same check.

Registration happens as a side effect of importing the module, at the
bottom of `src/index.ts`.

## Consequences

Importing a component twice is safe.

The first registration wins silently. If two different implementations
claim the same tag name, the second is dropped with no error, which is
harder to debug than a throw. This is an accepted trade for import
safety.

Because registration is an import side effect, consumers get the element
by importing the module for effect, and `src/index.ts` cannot be treated
as side-effect-free by a bundler.
