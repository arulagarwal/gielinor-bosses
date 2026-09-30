// Placeholder cards shown while events load, shaped like the real cards so
// the layout doesn't jump when they arrive. Hidden from assistive tech; the
// live region in AsyncSection says "Loading" instead.
const EventSkeletons = ({ count = 6 }) => (
    <ul className="event-grid" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
            <li key={index} className="event-card skeleton">
                <div className="event-art" />
                <div className="event-body">
                    <span className="skeleton-line wide" />
                    <span className="skeleton-line" />
                    <span className="skeleton-line short" />
                </div>
            </li>
        ))}
    </ul>
)

export default EventSkeletons
