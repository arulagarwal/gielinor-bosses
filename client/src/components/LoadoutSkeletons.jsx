// Placeholders shaped like loadout cards, shown while the list loads. Hidden
// from assistive tech; AsyncSection's live region says "Loading" instead.
export const LoadoutSkeletons = ({ count = 4 }) => (
    <ul className="loadout-grid" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
            <li key={index} className="loadout-card skeleton">
                <div className="loadout-card-art" />
                <div className="loadout-card-body">
                    <span className="skeleton-line wide" />
                    <span className="skeleton-line" />
                    <span className="skeleton-line short" />
                </div>
            </li>
        ))}
    </ul>
)

// Stand-in for the builder (preview plus a few slot groups) while gear loads.
export const BuilderSkeleton = () => (
    <div className="loadout-builder skeleton" aria-hidden="true">
        <div className="builder-preview"><div className="loadout-preview skeleton-block" /></div>
        <div className="builder-fields">
            {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="slot-group">
                    <span className="skeleton-line short" />
                    <div className="option-grid">
                        {Array.from({ length: 4 }, (_, i) => <span key={i} className="option-card skeleton-block" />)}
                    </div>
                </div>
            ))}
        </div>
    </div>
)
