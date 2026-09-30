import { Link } from 'react-router'
import { formatCountdown, formatStart, isPast } from '../utils/time.js'

// One event. `now` comes from the list's shared clock so every countdown
// ticks together. Past events keep their card but are dimmed, struck through
// and labelled, so the difference doesn't rely on colour alone.
const EventCard = ({ event, now, showLocation = false }) => {
    const past = isPast(event.startsAt, now)

    return (
        <li className={past ? 'event-card is-past' : 'event-card'} data-tier={event.bossTier ?? undefined}>
            <div className="event-art">
                {event.bossImage
                    ? <img src={event.bossImage} alt="" className="event-image" loading="lazy" />
                    : <span className="image-missing">No artwork</span>}
                {past && <span className="past-badge">Ended</span>}
            </div>

            <div className="event-body">
                <h3>{event.title}</h3>
                {event.bossName && <p className="event-boss">{event.bossName}</p>}

                <p className="event-time">
                    <time dateTime={event.startsAt}>{formatStart(event.startsAt)}</time>
                </p>
                <p className="countdown">{formatCountdown(event.startsAt, now)}</p>

                <dl className="event-meta">
                    <dt>Host</dt><dd>{event.host}</dd>
                    <dt>World</dt><dd>{event.world}</dd>
                    {showLocation && (
                        <>
                            <dt>Where</dt>
                            <dd><Link to={`/locations/${event.locationSlug}`}>{event.locationName}</Link></dd>
                        </>
                    )}
                </dl>

                <p className="event-description">{event.description}</p>
            </div>
        </li>
    )
}

export default EventCard
