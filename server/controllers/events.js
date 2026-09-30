import { pool } from '../config/database.js'
import { findLocationBySlug } from './locations.js'

// Every event query selects through this list, so the frontend reads the same
// camelCase keys everywhere. The joins bring along what a card needs to render
// on its own (location name and link, boss name and artwork). boss is a LEFT
// JOIN because an event outlives a deleted boss (boss_id ON DELETE SET NULL).
// starts_at is a TIMESTAMPTZ, which pg turns into a Date and Express
// serializes as an ISO string in UTC; the browser localizes it.
const EVENT_COLUMNS = `
    e.id, e.title, e.host, e.world, e.description,
    e.starts_at AS "startsAt",
    l.slug AS "locationSlug",
    l.name AS "locationName",
    b.slug AS "bossSlug",
    b.name AS "bossName",
    b.tier AS "bossTier",
    b.image AS "bossImage"
`

const EVENT_FROM = `
    FROM events e
    JOIN locations l ON l.id = e.location_id
    LEFT JOIN bosses b ON b.id = e.boss_id
`

// The only ORDER BY clauses a request can pick. The client sends a key and
// never SQL, so nothing user-supplied is ever spliced into a query.
// "upcoming" lists what's next soonest-first, then what already happened,
// most recent first. id breaks ties so the order is stable between requests.
const SORTS = {
    upcoming: `(e.starts_at < now()) ASC,
               CASE WHEN e.starts_at >= now() THEN e.starts_at END ASC,
               e.starts_at DESC, e.id ASC`,
    earliest: 'e.starts_at ASC, e.id ASC',
    latest: 'e.starts_at DESC, e.id ASC'
}

// $1 is a location slug; NULL switches the filter off.
const listEventsQuery = (sort) => `
    SELECT ${EVENT_COLUMNS}
    ${EVENT_FROM}
    WHERE ($1::text IS NULL OR l.slug = $1)
    ORDER BY ${SORTS[sort]}
`

// Express parses ?sort=a&sort=b into an array (and ?sort[x]=y into an
// object), so only accept plain strings.
const queryString = (value) => (typeof value === 'string' ? value.trim() : '')

const readSort = (req, res) => {
    const sort = queryString(req.query.sort) || 'upcoming'

    if (!Object.hasOwn(SORTS, sort)) {
        res.status(400).json({ error: `Unknown sort "${sort}". Use one of: ${Object.keys(SORTS).join(', ')}` })
        return null
    }

    return sort
}

// GET /api/events?location=<slug>&sort=<key>
const getEvents = async (req, res) => {
    const sort = readSort(req, res)
    if (!sort) return

    if (req.query.location !== undefined && typeof req.query.location !== 'string') {
        return res.status(400).json({ error: 'location must be a single slug' })
    }
    const locationSlug = queryString(req.query.location)

    try {
        // An unknown slug would just match nothing; say so instead of
        // returning an empty list that looks like a quiet location.
        if (locationSlug && !(await findLocationBySlug(locationSlug))) {
            return res.status(400).json({ error: `Unknown location "${locationSlug}"` })
        }

        const results = await pool.query(listEventsQuery(sort), [locationSlug || null])
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('⚠️ error fetching events', error.message)
        res.status(500).json({ error: 'Could not load events' })
    }
}

// GET /api/locations/:slug/events
const getEventsByLocation = async (req, res) => {
    const sort = readSort(req, res)
    if (!sort) return

    try {
        if (!(await findLocationBySlug(req.params.slug))) {
            return res.status(404).json({ error: 'Location not found' })
        }

        const results = await pool.query(listEventsQuery(sort), [req.params.slug])
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('⚠️ error fetching location events', error.message)
        res.status(500).json({ error: 'Could not load events' })
    }
}

// GET /api/events/:id
const getEventById = async (req, res) => {
    // Postgres would reject "abc" or 1e99 with a 500; they're really a bad request.
    if (!/^[1-9]\d{0,8}$/.test(req.params.id)) {
        return res.status(400).json({ error: 'Event id must be a positive integer' })
    }

    try {
        const results = await pool.query(`SELECT ${EVENT_COLUMNS} ${EVENT_FROM} WHERE e.id = $1`, [Number(req.params.id)])

        if (results.rowCount === 0) {
            return res.status(404).json({ error: 'Event not found' })
        }

        res.status(200).json(results.rows[0])
    } catch (error) {
        console.error('⚠️ error fetching event', error.message)
        res.status(500).json({ error: 'Could not load event' })
    }
}

export default {
    getEvents,
    getEventsByLocation,
    getEventById
}
