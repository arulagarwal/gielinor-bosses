import { pool } from '../config/database.js'

// Same camelCase keys the loadout rules and the frontend read.
export const GEAR_COLUMNS = `
    id, slot, slug, name, style,
    two_handed AS "twoHanded",
    price_gp AS "priceGp",
    color, image
`

// Slots come back in equipment-screen order, cheapest first within a slot.
const SLOT_ORDER = `array_position(ARRAY['weapon','offhand','head','body','legs','cape']::text[], slot::text)`

// Loads every option keyed by id, for validating a loadout. `db` can be the
// pool or a client inside a transaction.
export const loadGearById = async (db = pool) => {
    const results = await db.query(`SELECT ${GEAR_COLUMNS} FROM gear_options`)
    return new Map(results.rows.map(option => [option.id, option]))
}

// GET /api/gear
const getGear = async (req, res) => {
    try {
        const results = await pool.query(`SELECT ${GEAR_COLUMNS} FROM gear_options ORDER BY ${SLOT_ORDER}, price_gp, id`)
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('⚠️ error fetching gear', error.message)
        res.status(500).json({ error: 'Could not load gear' })
    }
}

export default {
    getGear
}
