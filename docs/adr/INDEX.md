# Architecture Decision Records

Conventions for components built from this template. Most of these
follow [`@substrate-system/web-component`](https://github.com/substrate-system/web-component);
that README is the upstream source, these records say which of its
options this template picked and why.

| # | Decision | Date |
|---|----------|------|
| [ADR-001](ADR-001-web-component-base-class.md) | Build on the `WebComponent` base class | 2026-07-28 |
| [ADR-002](ADR-002-idempotent-registration.md) | Register elements idempotently | 2026-07-28 |
| [ADR-003](ADR-003-light-dom.md) | Render into light DOM | 2026-07-28 |
| [ADR-004](ADR-004-attributes-as-state.md) | Attributes are the public state interface | 2026-07-28 |
| [ADR-005](ADR-005-namespaced-events.md) | Emit namespaced custom events | 2026-07-28 |
| [ADR-006](ADR-006-fouce-mitigation.md) | Mitigate FOUCE in two layers | 2026-07-28 |
| [ADR-007](ADR-007-dual-format-distribution.md) | Ship ESM and CJS, keep compiled output out of git | 2026-07-28 |
| [ADR-008](ADR-008-browser-tests.md) | Run tests in a real browser | 2026-07-28 |
| [ADR-009](ADR-009-self-deleting-scaffold.md) | Scaffold once with a self-deleting CLI | 2026-07-28 |

These describe `@substrate-system/web-component` `^0.0.56`. That version
is required, not incidental: reflected attributes (ADR-004) are absent
in 0.0.46, and the `./wildcard` subpath (ADR-005) first appears in
0.0.54. Note that a `^` range on a `0.0.x` version pins exactly, so
moving between these is always a deliberate edit.

See also [the glossary](../GLOSSARY.md).
