# ADR-009: Scaffold once with a self-deleting CLI

**Date:** 2026-07-28

## Context

A template repo has to become a real repo. The names it cannot know in
advance (package, tag, GitHub owner, repo) appear in source, tests,
`package.json`, and the README. Substituting them by hand means editing
half a dozen files and missing one.

The scaffolding machinery is also not part of the component. Left in
place it ships Handlebars, globby, inquirer, and yargs to consumers of a
component that needs none of them.

## Decision

`bin/cli.js` prompts for four values, substitutes them as Handlebars
placeholders across `example/`, `src/`, `test/index.ts`,
`package.json`, and `README.example.md`, then removes itself.

Removal is thorough: it deletes `bin/`, drops `build-cli` from
`scripts`, and drops `globby`, `handlebars`, `yargs`, and
`@inquirer/prompts` from `devDependencies`. It renders
`README.example.md` over `README.md` and deletes the original, so the
template's own README does not survive into the generated repo.

The four values are defined in [the glossary](../GLOSSARY.md).

## Consequences

One command produces a consistently named repo, and the generated
project carries no scaffolding dependencies.

The operation runs exactly once and is destructive. There is no second
run to correct a typo, and no undo short of `git checkout`. Because the
step happens before `git init` in the documented flow, there may be no
commit to recover from.

The class name `Example` in `src/index.ts` is not a template variable,
so scaffolding leaves it in place. Renaming it is a manual follow-up.

Placeholders live in files that must stay syntactically valid before
substitution, which constrains where they can appear. `{{package-name}}`
works as a JSON string value; it could not be used as a bare identifier.
