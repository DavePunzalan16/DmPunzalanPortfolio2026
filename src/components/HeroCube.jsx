/**
 * Decorative floating, slowly-rotating 3D cube — a nod to the Rubik's hobby.
 * Pure CSS 3D (no library), namespaced fx-*, pointer-events:none so it never
 * blocks hero content. Hidden on small screens, animation disabled under
 * prefers-reduced-motion (handled in index.css). Isolated: removing this one
 * component cleanly removes the feature.
 */
export const HeroCube = () => (
    <div className="fx-cube-wrap" aria-hidden="true">
        <div className="fx-cube">
            <span className="fx-cube__face" />
            <span className="fx-cube__face" />
            <span className="fx-cube__face" />
            <span className="fx-cube__face" />
            <span className="fx-cube__face" />
            <span className="fx-cube__face" />
        </div>
    </div>
);

export default HeroCube;
