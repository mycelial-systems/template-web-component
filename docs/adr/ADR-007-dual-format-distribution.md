# ADR-007: Ship ESM and CJS, keep compiled output out of git

**Date:** 2026-07-28

## Context

Consumers resolve packages differently. A bundler wants ESM, a Node
script may still `require()`, and a plain `<script type="module">` wants
a pre-bundled minified file. Publishing one format forces the others to
work around it.

Separately, compiled output in git makes every build produce a diff and
every merge produce a conflict, over files nobody reads.

## Decision

Build to `dist/` in four variants: CJS (`.cjs`), ESM (`.js`) with
`.d.ts` declarations, minified bundled ESM (`.min.js`), and compiled CSS
(`index.css`, `index.min.css`). `esbuild` does the JS,
`tsc --emitDeclarationOnly` the types, `lightningcss` the CSS.

Route consumers with the `exports` field rather than `main`, so the
right format is picked automatically. `./css` and `./min/*` are
subpath exports.

`dist` and `*.js` are in `.gitignore` but not in `.npmignore`; `files`
limits the published tarball to `./dist/*`. Compiled code reaches npm
and never reaches git.

The npm lifecycle hooks enforce the sequence:

- `preversion` runs `eslint` and `stylelint`
- `version` regenerates the README TOC and the changelog, and stages them
- `postversion` pushes with tags and publishes
- `prepublishOnly` runs the build

## Consequences

`npm version` alone performs a full release: lint, document, tag, push,
build, publish. There is no separate release script to remember, and
publishing unlinted or unbuilt code takes deliberate effort.

A fresh clone has no `dist`, so anything reading from it fails until
`npm run build` runs. Tests avoid this by importing from `src`.

The four build variants are four chances to misconfigure `exports`. A
broken subpath only shows up when a consumer resolves it, not at build
time.
