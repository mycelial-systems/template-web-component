# Glossary

The vocabulary specific to this template. Standard web-component terms
(`connectedCallback`, `observedAttributes`, Shadow DOM, ESM/CJS) are not
defined here -- see
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

## Template

Words used while turning this repo into a new component repo.

**Scaffold** -- The one-shot `node ./bin/cli.js` run that prompts for the
four template variables, substitutes them across the tracked source, and
then deletes `bin/` along with its own dev dependencies from
`package.json`. It cannot be run twice.

**Template Variable** -- A Handlebars placeholder such as
`{{component-name}}` that Scaffold replaces. Substitution covers
`example/`, `src/`, `test/index.ts`, `package.json`, and
`README.example.md`.

**`package-name`** -- The npm package name, including any namespace.
Example: `@alice/cool-component`.

**`component-name`** -- The custom element name as written in HTML, and
the key registered in `HTMLElementTagNameMap`. Example: `cool-component`.

**`gh-namespace`** -- The GitHub user or org, the first path segment of
the repository URL. Example: `alice`.

**`repo-name`** -- The GitHub repository name, the last path segment of
the repository URL. Example: `cool-component`.

**Example README** -- `README.example.md`, the README for the *generated*
component. Scaffold renders it over `README.md` and removes the original,
so the template's own README does not survive scaffolding.

## Component

Words used while writing the component itself.

**`Example`** -- The placeholder class name exported from `src/index.ts`.
Scaffold does not rename it, since the class name is not a template
variable. Rename it by hand after scaffolding.

**Change Handler** -- A method named `handleChange_<attribute>`, called by
`attributeChangedCallback` when that attribute changes. The dispatch is
by convention, not registration: adding an attribute means listing it in
`static observedAttributes` *and* adding the matching method. A missing
handler is silently skipped, and the component still re-renders.
