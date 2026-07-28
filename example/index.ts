import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', '{{component-name}}')
} else {
    localStorage.removeItem('DEBUG')
}

// `document.body.innerHTML +=` would serialize and re-parse the whole
// body, destroying and recreating every element already on the page.
// Custom elements would lose their state and re-capture their own
// rendered output as if it were authored content.
document.body.insertAdjacentHTML(
    'beforeend',
    '<{{component-name}}></{{component-name}}>'
)

/**
 * Page level FOUCE guard -- reveal the page once every component is
 * defined, so they appear together instead of one at a time.
 *
 * The timeout is not optional. Without it, a component that fails to
 * define leaves the page blank forever.
 *
 * @see docs/adr/ADR-006-fouce-mitigation.md
 */
await Promise.race([
    Promise.allSettled([
        customElements.whenDefined('{{component-name}}')
    ]),
    new Promise(resolve => {
        setTimeout(resolve, 2000)
    })
])

document.documentElement.classList.remove('reduce-fouce')
