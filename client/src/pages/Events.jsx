import { useSearchParams } from 'react-router'
import EventsAPI from '../services/EventsAPI.js'
import LocationsAPI from '../services/LocationsAPI.js'
import { useFetch } from '../hooks/useFetch.js'
import { useNow } from '../hooks/useNow.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import AsyncSection from '../components/AsyncSection.jsx'
import EventCard from '../components/EventCard.jsx'
import EventSkeletons from '../components/EventSkeletons.jsx'
import { pluralMasses } from '../utils/time.js'

// The keys match the server's whitelist in controllers/events.js.
const SORT_OPTIONS = [
    { value: 'upcoming', label: 'Upcoming first' },
    { value: 'earliest', label: 'Date, earliest first' },
    { value: 'latest', label: 'Date, latest first' }
]

const Events = () => {
    usePageTitle('All events')
    const now = useNow()

    // The filters live in the URL (/events?location=wilderness&sort=latest),
    // so a filtered view can be bookmarked or shared and Back undoes a change.
    const [searchParams, setSearchParams] = useSearchParams()
    const location = searchParams.get('location') ?? ''
    const sort = searchParams.get('sort') ?? 'upcoming'

    const locations = useFetch((signal) => LocationsAPI.getAllLocations({ signal }), [])
    const events = useFetch(
        (signal) => EventsAPI.getAllEvents({ location, sort }, { signal }),
        [location, sort]
    )

    const updateParam = (key, value, fallback) => {
        const next = new URLSearchParams(searchParams)
        if (value && value !== fallback) next.set(key, value)
        else next.delete(key)
        setSearchParams(next)
    }

    const locationName = locations.data?.find(entry => entry.slug === location)?.name
    const where = location ? ` at ${locationName ?? location}` : ''
    const list = events.data ?? []

    return (
        <>
            <h1>All events</h1>
            <p className="lede">Every mass on the calendar, across every region.</p>

            <form className="event-filters" onSubmit={(event) => event.preventDefault()}>
                <label>
                    Region
                    <select
                        value={location}
                        onChange={(event) => updateParam('location', event.target.value, '')}
                    >
                        <option value="">All regions</option>
                        {(locations.data ?? []).map(entry => (
                            <option key={entry.slug} value={entry.slug}>{entry.name}</option>
                        ))}
                        {/* Keep an unknown ?location= visible instead of silently showing "All". */}
                        {location && locations.status === 'success' && !locationName && (
                            <option value={location}>{location} (unknown)</option>
                        )}
                    </select>
                </label>

                <label>
                    Sort by
                    <select value={sort} onChange={(event) => updateParam('sort', event.target.value, 'upcoming')}>
                        {SORT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
            </form>

            <AsyncSection
                label="Events"
                status={events.status}
                error={events.error}
                retry={events.retry}
                isEmpty={list.length === 0}
                messages={{
                    loading: 'Loading events…',
                    empty: `No events${where}.`,
                    success: `Showing ${pluralMasses(list.length)}${where}.`
                }}
                skeleton={<EventSkeletons />}
                empty={
                    <>
                        <h2>No events{where}</h2>
                        <p>Try another region, or check back once a clan schedules something.</p>
                        {location && <button type="button" onClick={() => updateParam('location', '')}>Show all regions</button>}
                    </>
                }
                errorExtra={
                    (location || sort !== 'upcoming') && (
                        <button type="button" className="secondary" onClick={() => setSearchParams({})}>
                            Clear filters
                        </button>
                    )
                }
            >
                <h2 className="section-title">{pluralMasses(list.length)}{where}</h2>
                <ul className="event-grid">
                    {list.map(event => <EventCard key={event.id} event={event} now={now} showLocation />)}
                </ul>
            </AsyncSection>
        </>
    )
}

export default Events
