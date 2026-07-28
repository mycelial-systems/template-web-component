import { WebComponent } from '@substrate-system/web-component'
import Debug from '@substrate-system/debug'
const debug = Debug('{{component-name}}')

// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        '{{component-name}}': Example
    }
}

/**
 * Use the `create` factory rather than `class Example extends
 * WebComponent` with `static TAG`. The base class declares `TAG` as an
 * *instance* field defaulting to `''`, and `emit`/`on` namespace from
 * that instance field while `static event()` reads the static one.
 * Setting only `static TAG` therefore emits `':hello'` while listeners
 * built from `Example.event('hello')` expect `'{{component-name}}:hello'`,
 * and nothing fires. `create` sets both.
 */
export class Example extends WebComponent.create('{{component-name}}') {
    /**
     * Attributes that reflect to properties. The base class generates
     * the getters and setters, and derives `observedAttributes` from
     * these, so there is no `static observedAttributes` to maintain.
     *
     * @see docs/adr/ADR-004-attributes-as-state.md
     */
    static reflectedStringAttributes = ['example']

    /**
     * Reflected properties are installed at runtime, so `declare` gives
     * them a type without emitting a field that would shadow the
     * generated accessor.
     */
    declare example:string|null

    /**
     * The light DOM children as they were authored, captured before the
     * first render replaces them.
     */
    #slotted:string[] = []

    #observer:MutationObserver|null = null

    connectedCallback () {
        debug('connected')

        // Capture the authored children before `render` overwrites them.
        // Reading these in the constructor is not reliable: an element
        // created by the parser has no children yet at that point.
        if (!this.#slotted.length) {
            this.#slotted = Array.from(this.children).map(node => {
                return node.outerHTML
            })
        }

        // The base class calls `render` for us.
        super.connectedCallback()

        this.#observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    debug('Node added: ', mutation.addedNodes)
                }
            })
        })

        this.#observer.observe(this, { childList: true })
    }

    disconnectedCallback () {
        debug('disconnected')
        this.#observer?.disconnect()
        this.#observer = null
    }

    /**
     * Handle 'example' attribute changes.
     *
     * `attributeChangedCallback` routes here by name. Update the DOM in
     * place rather than re-rendering, so the component does not throw
     * away nodes on every attribute change.
     *
     * Note this can run before `connectedCallback`, when the attribute
     * is present in the parsed markup, so there may be nothing to
     * query yet.
     *
     * @param  {string|null} oldValue The old attribute value
     * @param  {string|null} newValue The new attribute value
     */
    handleChange_example (oldValue:string|null, newValue:string|null) {
        debug('handling example change', oldValue, newValue)

        const p = this.qs('p')
        if (!p) return  // not rendered yet

        p.textContent = newValue ?? 'example'
    }

    render () {
        this.innerHTML = `<div>
            <p>${this.example ?? 'example'}</p>
            <ul>
                ${this.#slotted.map(html => `<li>${html}</li>`).join('')}
            </ul>
        </div>`
    }
}

Example.define()
