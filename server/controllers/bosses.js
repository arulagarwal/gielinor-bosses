import { pool } from '../config/database.js'

// The table's columns are snake_case, but the frontend reads the same camelCase
// keys it did in Unit 1, so every query selects through this list. The aliases
// have to be double-quoted, or Postgres folds them to lowercase (combatlevel).
// release_date is formatted here because pg would otherwise turn a DATE into a
// JS Date at local midnight, which serializes as "2002-09-24T04:00:00.000Z".
const BOSS_COLUMNS = `
    id, slug, name, tier,
    combat_level AS "combatLevel",
    life_points AS "lifePoints",
    location, requirements, aggressive,
    max_hit AS "maxHit",
    to_char(release_date, 'YYYY-MM-DD') AS "releaseDate",
    notable_drops AS "notableDrops",
    image, description
`

// Shared with the page route, which only serves boss.html for a real boss.
export const findBossBySlug = async (slug) => {
    const results = await pool.query(`SELECT ${BOSS_COLUMNS} FROM bosses WHERE slug = $1`, [slug])
    return results.rows[0]
}

// Express 4 doesn't catch rejected promises, so every handler catches its own
// errors; otherwise one failed query would take the whole server down.
const getBosses = async (req, res) => {
    try {
        const results = await pool.query(`SELECT ${BOSS_COLUMNS} FROM bosses ORDER BY id ASC`)
        res.status(200).json(results.rows)
    } catch (error) {
        console.error('⚠️ error fetching bosses', error.message)
        res.status(500).json({ error: 'Could not load bosses' })
    }
}

const getBossBySlug = async (req, res) => {
    try {
        const boss = await findBossBySlug(req.params.slug)

        if (!boss) {
            return res.status(404).json({ error: 'Boss not found' })
        }

        res.status(200).json(boss)
    } catch (error) {
        console.error('⚠️ error fetching boss', error.message)
        res.status(500).json({ error: 'Could not load boss' })
    }
}

export default {
    getBosses,
    getBossBySlug
}
