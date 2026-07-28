# ADR-008: Run tests in a real browser

**Date:** 2026-07-28

## Context

Custom elements depend on the browser's custom element registry, upgrade
timing, and lifecycle callbacks. A DOM emulation layer such as jsdom
approximates these, and the approximation is thin exactly where web
components are interesting: upgrade order, `:defined` matching, and when
`connectedCallback` fires relative to parsing.

A test suite that passes under emulation but not in a browser is worse
than no suite.

## Decision

Tests run in a real browser. `npm test` bundles `test/index.ts` with
`esbuild` and pipes it to `tapout`, which runs it in a browser and
reports TAP.

`--bundle` is required, not incidental. Without it `esbuild` only
transpiles, leaving bare specifiers like `@substrate-system/tapzero` in
the output, and the browser refuses to resolve them.

Assertions use `@substrate-system/tapzero`. Timing-dependent lookups use
`waitFor` from `@substrate-system/dom` rather than a fixed delay,
because element upgrade is asynchronous:

```ts
const el = await waitFor('example-component')
```

Tests import from `src`, not `dist`, so the suite runs without a build.

## Consequences

Lifecycle behavior is tested against the real implementation, including
the upgrade timing that emulation gets wrong.

Tests need a browser present, which makes CI heavier than a Node-only
runner and makes the suite unusable in environments without one.

`waitFor` is required rather than merely preferred. Querying immediately
after inserting markup races element upgrade, and the resulting failure
is intermittent.
