import { pool } from '../config/database.js'

// Every location query selects through this list so the frontend always sees
// the same camelCase keys. The counts let the map show how busy each region is
// without a second request; COUNT returns a bigint, which pg would hand back
// as a string, so it is cast to int.
const LOCATION_COLUMNS = `
    l.id, l.slug, l.name, l.region, l.description,
    (SELECT COUNT(*)::int FROM events e WHERE e.location_id = l.id) AS "eventCount",
    (SELECT COUNT(*)::int FROM events e WHERE e.location_id = l.id AND e.starts_at >= now()) AS "upcomingCount"
`

// Shared with the events controller and the page route in server.js.
export const findLocationBySlug = async (slug) => {
    const results = await pool.query(`SELECT ${LOCATION_COLUMNS} FROM locations l WHERE l.slug = $1`, [slug])
    return results.rows[0]
}

// Express 4 doesn't catch rejected promises, so every handler catches its own
// errors; otherwise one failed query would take the whole server down.
const getLocations = async (req, res) => {
    try {
        const results = await pool.query(`SELECT ${LOCATION_COLUMNS} FROM locations l ORDER BY l.id ASC`)
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('⚠️ error fetching locations', error.message)
        res.status(500).json({ error: 'Could not load locations' })
    }
}

const getLocationBySlug = async (req, res) => {
    try {
        const location = await findLocationBySlug(req.params.slug)

        if (!location) {
            return res.status(404).json({ error: 'Location not found' })
        }

        res.status(200).json(location)
    } catch (error) {
        console.error('⚠️ error fetching location', error.message)
        res.status(500).json({ error: 'Could not load location' })
    }
}

export default {
    getLocations,
    getLocationBySlug
}
