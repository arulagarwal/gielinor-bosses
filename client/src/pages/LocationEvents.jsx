import { Link, useParams } from 'react-router'
import LocationsAPI from '../services/LocationsAPI.js'
import { useFetch } from '../hooks/useFetch.js'
import { useNow } from '../hooks/useNow.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import AsyncSection from '../components/AsyncSection.jsx'
import EventCard from '../components/EventCard.jsx'
import EventSkeletons from '../components/EventSkeletons.jsx'
import NotFound from './NotFound.jsx'
import { pluralMasses } from '../utils/time.js'

const LocationEvents = () => {
    const { slug } = useParams()
    const now = useNow()

    // The location and its events load together; the page needs both.
    const { status, data, error, retry } = useFetch(
        (signal) => Promise.all([
            LocationsAPI.getLocationBySlug(slug, { signal }),
            LocationsAPI.getLocationEvents(slug, { signal })
        ]).then(([location, events]) => ({ location, events })),
        [slug]
    )

    const location = data?.location
    const events = data?.events ?? []
    usePageTitle(location?.name ?? (status === 'error' ? 'Region not found' : 'Loading'))

    if (status === 'error' && error?.status === 404) {
        return <NotFound message="There's no region by that name on the map." />
    }

    return (
        <>
            <p className="breadcrumb"><Link to="/">← Back to the map</Link></p>

            {location ? (
                <header className="location-header">
                    <p className="eyebrow">{location.region}</p>
                    <h1>{location.name}</h1>
                    <p className="lede">{location.description}</p>
                </header>
            ) : (
                // Keeps a heading on the page (and its space in the layout) while loading.
                <header className="location-header">
                    <p className="eyebrow skeleton-line short" aria-hidden="true" />
                    <h1>{status === 'error' ? 'Region' : 'Loading region…'}</h1>
                </header>
            )}

            <AsyncSection
                label="Masses"
                status={status}
                error={error}
                retry={retry}
                isEmpty={events.length === 0}
                messages={{
                    loading: 'Loading masses…',
                    empty: `No masses scheduled at ${location?.name} yet.`,
                    success: `Showing ${pluralMasses(events.length)} at ${location?.name}, ${location?.upcomingCount} upcoming.`
                }}
                skeleton={<EventSkeletons count={3} />}
                empty={
                    <>
                        <h2>No masses scheduled at {location?.name} yet</h2>
                        <p>Nobody has planned a group kill here. See what's on elsewhere instead.</p>
                        <Link to="/events" role="button">Browse all events</Link>
                    </>
                }
            >
                <h2 className="section-title">
                    {pluralMasses(events.length)} <span className="muted">· upcoming first</span>
                </h2>
                <ul className="event-grid">
                    {events.map(event => <EventCard key={event.id} event={event} now={now} />)}
                </ul>
            </AsyncSection>
        </>
    )
}

export default LocationEvents
