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

// Search: $1 is an ILIKE pattern matched against the name, the location, and
// each notable drop on its own (unnest), so a term can't match across the gap
// between two drops. $2 is an exact tier. A NULL parameter switches its filter
// off, so one fixed query covers every combination.
const LIST_BOSSES = `
    SELECT ${BOSS_COLUMNS}
    FROM bosses
    WHERE ($1::text IS NULL
           OR name ILIKE $1
           OR location ILIKE $1
           OR EXISTS (SELECT 1 FROM unnest(notable_drops) AS drop_name WHERE drop_name ILIKE $1))
      AND ($2::text IS NULL OR tier = $2)
    ORDER BY id ASC
`

const TIERS = ['Low', 'Mid', 'High', 'Elite']

// % and _ are LIKE wildcards, and \ is its escape character; escape all three
// so a search for "%" looks for a literal percent sign instead of matching everything.
const escapeLike = (term) => term.replace(/[\\%_]/g, '\\$&')

// Express parses ?search=a&search=b into an array (and ?search[x]=y into an
// object), so only accept plain strings.
const queryString = (value) => (typeof value === 'string' ? value.trim() : '')

const findBossBySlug = async (slug) => {
    const results = await pool.query(`SELECT ${BOSS_COLUMNS} FROM bosses WHERE slug = $1`, [slug])
    return results.rows[0]
}

// Express 4 doesn't catch rejected promises, so every handler catches its own
// errors; otherwise one failed query would take the whole server down.
const getBosses = async (req, res) => {
    const search = queryString(req.query.search)
    const tier = queryString(req.query.tier)

    if (tier && !TIERS.includes(tier)) {
        return res.status(400).json({ error: `Unknown tier "${tier}". Use one of: ${TIERS.join(', ')}` })
    }

    try {
        const results = await pool.query(LIST_BOSSES, [
            search ? `%${escapeLike(search)}%` : null,
            tier || null
        ])
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
