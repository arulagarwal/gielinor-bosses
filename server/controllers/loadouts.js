import { pool } from '../config/database.js'
import { loadGearById } from './gear.js'
import { SLOTS, validateLoadout } from '../utils/loadoutRules.js'

// Each slot joins its own copy of gear_options (alias = slot name) and comes
// back as one nested object, or null when the slot is empty, so a card can
// render a whole loadout from one row. totalPrice is summed here rather than
// stored, so it can never disagree with the items.
const slotObject = (slot) => `
    CASE WHEN ${slot}.id IS NULL THEN NULL ELSE json_build_object(
        'id', ${slot}.id,
        'slug', ${slot}.slug,
        'name', ${slot}.name,
        'style', ${slot}.style,
        'twoHanded', ${slot}.two_handed,
        'priceGp', ${slot}.price_gp,
        'color', ${slot}.color,
        'image', ${slot}.image
    ) END AS "${slot}"
`

const LOADOUT_COLUMNS = `
    lo.id, lo.name,
    lo.created_at AS "createdAt",
    lo.updated_at AS "updatedAt",
    ${SLOTS.map(slotObject).join(',')},
    (${SLOTS.map(slot => `COALESCE(${slot}.price_gp, 0)`).join(' + ')}) AS "totalPrice"
`

const LOADOUT_FROM = `
    FROM loadouts lo
    ${SLOTS.map(slot => `LEFT JOIN gear_options ${slot} ON ${slot}.id = lo.${slot}_id`).join('\n')}
`

const selectOne = `SELECT ${LOADOUT_COLUMNS} ${LOADOUT_FROM} WHERE lo.id = $1`

// Postgres would reject "abc" or 1e99 with a 500; they're really a bad request.
const readId = (req, res) => {
    if (!/^[1-9]\d{0,8}$/.test(req.params.id)) {
        res.status(400).json({ error: 'Loadout id must be a positive integer' })
        return null
    }
    return Number(req.params.id)
}

// Shared by create and update: runs the rules and answers 422 if they fail.
// The first problem becomes the headline error; the full list lets the form
// mark each field.
const validate = async (req, res) => {
    const gearById = await loadGearById()
    const { problems, values } = validateLoadout(req.body, gearById)

    if (problems.length > 0) {
        res.status(422).json({ error: problems[0].message, problems })
        return null
    }

    return values
}

const slotParams = (values) => SLOTS.map(slot => values[slot])

// GET /api/loadouts -> newest first
const getLoadouts = async (req, res) => {
    try {
        const results = await pool.query(`SELECT ${LOADOUT_COLUMNS} ${LOADOUT_FROM} ORDER BY lo.created_at DESC, lo.id DESC`)
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('⚠️ error fetching loadouts', error.message)
        res.status(500).json({ error: 'Could not load loadouts' })
    }
}

// Also used by server.js to give unknown /loadouts/:id deep links a 404.
export const loadoutExists = async (id) => {
    const results = await pool.query('SELECT 1 FROM loadouts WHERE id = $1', [id])
    return results.rowCount > 0
}

// GET /api/loadouts/:id
const getLoadoutById = async (req, res) => {
    const id = readId(req, res)
    if (!id) return

    try {
        const results = await pool.query(selectOne, [id])

        if (results.rowCount === 0) {
            return res.status(404).json({ error: 'Loadout not found' })
        }

        res.status(200).json(results.rows[0])
    } catch (error) {
        console.error('⚠️ error fetching loadout', error.message)
        res.status(500).json({ error: 'Could not load loadout' })
    }
}

// POST /api/loadouts -> 201 with the saved loadout
const createLoadout = async (req, res) => {
    try {
        const values = await validate(req, res)
        if (!values) return

        const inserted = await pool.query(
            `INSERT INTO loadouts (name, ${SLOTS.map(slot => `${slot}_id`).join(', ')})
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [values.name, ...slotParams(values)]
        )

        const results = await pool.query(selectOne, [inserted.rows[0].id])
        res.status(201).json(results.rows[0])
    } catch (error) {
        console.error('⚠️ error creating loadout', error.message)
        res.status(500).json({ error: 'Could not save loadout' })
    }
}

// PATCH /api/loadouts/:id -> replaces every field, 200 with the saved loadout
const updateLoadout = async (req, res) => {
    const id = readId(req, res)
    if (!id) return

    try {
        const values = await validate(req, res)
        if (!values) return

        const updated = await pool.query(
            `UPDATE loadouts
             SET name = $2, ${SLOTS.map((slot, i) => `${slot}_id = $${i + 3}`).join(', ')}, updated_at = now()
             WHERE id = $1`,
            [id, values.name, ...slotParams(values)]
        )

        if (updated.rowCount === 0) {
            return res.status(404).json({ error: 'Loadout not found' })
        }

        const results = await pool.query(selectOne, [id])
        res.status(200).json(results.rows[0])
    } catch (error) {
        console.error('⚠️ error updating loadout', error.message)
        res.status(500).json({ error: 'Could not update loadout' })
    }
}

// DELETE /api/loadouts/:id -> 200 { id, name }
const deleteLoadout = async (req, res) => {
    const id = readId(req, res)
    if (!id) return

    try {
        const results = await pool.query('DELETE FROM loadouts WHERE id = $1 RETURNING id, name', [id])

        if (results.rowCount === 0) {
            return res.status(404).json({ error: 'Loadout not found' })
        }

        res.status(200).json(results.rows[0])
    } catch (error) {
        console.error('⚠️ error deleting loadout', error.message)
        res.status(500).json({ error: 'Could not delete loadout' })
    }
}

export default {
    getLoadouts,
    getLoadoutById,
    createLoadout,
    updateLoadout,
    deleteLoadout
}
