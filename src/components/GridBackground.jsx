/**
 * Subtle animated grid background.
 * Fixed, full-screen, pointer-events-none, sits behind all content (z-0) and on
 * top of the base background. Styling + animation + theming live in index.css
 * (.grid-bg / .grid-bg__layer / .grid-bg__wash). The starfield is unaffected.
 */
export const GridBackground = () => (
    <div className="grid-bg" aria-hidden="true">
        <div className="grid-bg__wash" />
        <div className="grid-bg__layer" />
    </div>
);
