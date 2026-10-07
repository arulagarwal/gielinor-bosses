// Rebuilds every table from the seed data: `npm run reset`.
import { pool } from './database.js'
import bossData from '../data/bosses.js'
import locationData from '../data/locations.js'
import eventData from '../data/events.js'
import gearData from '../data/gear.js'
import loadoutData from '../data/loadouts.js'
import { SLOTS, validateLoadout } from '../utils/loadoutRules.js'
import { loadGearById } from '../controllers/gear.js'

const SLUG_CHECK = `CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')`

const createBossesQuery = `
    CREATE TABLE bosses (
        id            SERIAL       PRIMARY KEY,
        slug          VARCHAR(100) NOT NULL UNIQUE ${SLUG_CHECK},
        name          VARCHAR(255) NOT NULL,
        tier          VARCHAR(10)  NOT NULL CHECK (tier IN ('Low', 'Mid', 'High', 'Elite')),
        combat_level  INTEGER      NOT NULL CHECK (combat_level > 0),
        life_points   INTEGER      NOT NULL CHECK (life_points > 0),
        location      VARCHAR(255) NOT NULL,
        requirements  VARCHAR(255) NOT NULL,
        aggressive    BOOLEAN      NOT NULL,
        max_hit       INTEGER      NOT NULL CHECK (max_hit >= 0),
        release_date  DATE         NOT NULL,
        notable_drops TEXT[]       NOT NULL,
        image         TEXT         NOT NULL,
        description   TEXT         NOT NULL
    )
`

const createLocationsQuery = `
    CREATE TABLE locations (
        id          SERIAL       PRIMARY KEY,
        slug        VARCHAR(100) NOT NULL UNIQUE ${SLUG_CHECK},
        name        VARCHAR(255) NOT NULL,
        region      VARCHAR(255) NOT NULL,
        description TEXT         NOT NULL
    )
`

// Deleting a location takes its events with it; deleting a boss keeps the
// event but forgets which boss it was for.
const createEventsQuery = `
    CREATE TABLE events (
        id          SERIAL       PRIMARY KEY,
        location_id INTEGER      NOT NULL REFERENCES locations (id) ON DELETE CASCADE,
        boss_id     INTEGER      REFERENCES bosses (id) ON DELETE SET NULL,
        title       VARCHAR(255) NOT NULL,
        host        VARCHAR(255) NOT NULL,
        world       INTEGER      NOT NULL CHECK (world > 0),
        starts_at   TIMESTAMPTZ  NOT NULL,
        description TEXT         NOT NULL
    )
`

// Every location page filters on location_id and every list sorts on starts_at.
const createEventIndexesQueries = [
    'CREATE INDEX events_location_id_idx ON events (location_id)',
    'CREATE INDEX events_starts_at_idx ON events (starts_at)'
]

// The loadout builder's options. style is NULL for gear any style can wear;
// color is the avatar fill for that slot.
const createGearOptionsQuery = `
    CREATE TABLE gear_options (
        id          SERIAL       PRIMARY KEY,
        slot        VARCHAR(10)  NOT NULL CHECK (slot IN ('weapon', 'offhand', 'head', 'body', 'legs', 'cape')),
        slug        VARCHAR(100) NOT NULL UNIQUE ${SLUG_CHECK},
        name        VARCHAR(255) NOT NULL,
        style       VARCHAR(10)  CHECK (style IN ('melee', 'ranged', 'magic')),
        two_handed  BOOLEAN      NOT NULL DEFAULT false CHECK (NOT two_handed OR slot = 'weapon'),
        price_gp    INTEGER      NOT NULL CHECK (price_gp >= 0),
        color       VARCHAR(7)   NOT NULL CHECK (color ~ '^#[0-9a-f]{6}$'),
        image       TEXT         NOT NULL
    )
`

// One saved loadout: a name and one gear option per slot. Weapon, body and
// legs are required. RESTRICT stops an option being deleted while a loadout
// still wears it. The rules about which options fit together live in
// utils/loadoutRules.js, which the API runs before every write.
const createLoadoutsQuery = `
    CREATE TABLE loadouts (
        id         SERIAL      PRIMARY KEY,
        name       VARCHAR(50) NOT NULL CHECK (length(btrim(name)) > 0),
        weapon_id  INTEGER     NOT NULL REFERENCES gear_options (id) ON DELETE RESTRICT,
        offhand_id INTEGER     REFERENCES gear_options (id) ON DELETE RESTRICT,
        head_id    INTEGER     REFERENCES gear_options (id) ON DELETE RESTRICT,
        body_id    INTEGER     NOT NULL REFERENCES gear_options (id) ON DELETE RESTRICT,
        legs_id    INTEGER     NOT NULL REFERENCES gear_options (id) ON DELETE RESTRICT,
        cape_id    INTEGER     REFERENCES gear_options (id) ON DELETE RESTRICT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
`

const insertGearQuery = `
    INSERT INTO gear_options (slot, slug, name, style, two_handed, price_gp, color, image)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`

const insertLoadoutQuery = `
    INSERT INTO loadouts (name, ${SLOTS.map(slot => `${slot}_id`).join(', ')})
    VALUES ($1, $2, $3, $4, $5, $6, $7)
`

const insertBossQuery = `
    INSERT INTO bosses (slug, name, tier, combat_level, life_points, location, requirements,
                        aggressive, max_hit, release_date, notable_drops, image, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
`

const insertLocationQuery = `
    INSERT INTO locations (slug, name, region, description)
    VALUES ($1, $2, $3, $4)
`

// The subqueries turn the seed file's slugs into ids. A typo'd location slug
// yields NULL and trips the NOT NULL constraint, rolling everything back.
// now() is fixed for the whole transaction, so every event is offset from the
// same instant, rounded down to the hour.
const insertEventQuery = `
    INSERT INTO events (location_id, boss_id, title, host, world, starts_at, description)
    VALUES (
        (SELECT id FROM locations WHERE slug = $1),
        (SELECT id FROM bosses WHERE slug = $2),
        $3, $4, $5,
        date_trunc('hour', now()) + make_interval(hours => $6),
        $7
    )
`

// Everything runs in one transaction on one client. Postgres DDL is
// transactional, so if any step fails the old tables are left exactly as they
// were. Inserting one row at a time, awaited, keeps the SERIAL ids in the same
// order as the seed files.
try {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')

        // Children first, so no foreign key is left pointing at a dropped table.
        await client.query('DROP TABLE IF EXISTS loadouts, gear_options, events, locations, bosses')

        await client.query(createBossesQuery)
        await client.query(createLocationsQuery)
        await client.query(createEventsQuery)
        for (const query of createEventIndexesQueries) {
            await client.query(query)
        }
        await client.query(createGearOptionsQuery)
        await client.query(createLoadoutsQuery)
        console.log('🎉 bosses, locations, events, gear_options and loadouts tables created')

        for (const boss of bossData) {
            await client.query(insertBossQuery, [
                boss.slug,
                boss.name,
                boss.tier,
                boss.combatLevel,
                boss.lifePoints,
                boss.location,
                boss.requirements,
                boss.aggressive,
                boss.maxHit,
                boss.releaseDate,
                boss.notableDrops,
                boss.image,
                boss.description
            ])
        }
        console.log(`✅ ${bossData.length} bosses added`)

        for (const location of locationData) {
            await client.query(insertLocationQuery, [
                location.slug,
                location.name,
                location.region,
                location.description
            ])
        }
        console.log(`✅ ${locationData.length} locations added`)

        for (const event of eventData) {
            // A boss slug that matches nothing would silently store NULL, so check it.
            const boss = await client.query('SELECT 1 FROM bosses WHERE slug = $1', [event.boss])
            if (boss.rowCount === 0) {
                throw new Error(`event "${event.title}" names unknown boss "${event.boss}"`)
            }

            await client.query(insertEventQuery, [
                event.location,
                event.boss,
                event.title,
                event.host,
                event.world,
                event.startsInHours,
                event.description
            ])
        }
        console.log(`✅ ${eventData.length} events added`)

        for (const option of gearData) {
            await client.query(insertGearQuery, [
                option.slot,
                option.slug,
                option.name,
                option.style,
                option.twoHanded,
                option.priceGp,
                option.color,
                option.image
            ])
        }
        console.log(`✅ ${gearData.length} gear options added`)

        // Seed loadouts go through the same rules as the API, so a sample
        // that the app would reject can't sneak into the database.
        const gearById = await loadGearById(client)
        const idBySlug = new Map([...gearById.values()].map(option => [option.slug, option.id]))

        for (const loadout of loadoutData) {
            const body = { name: loadout.name }
            for (const slot of SLOTS) {
                const slug = loadout[slot]
                if (slug && !idBySlug.has(slug)) {
                    throw new Error(`loadout "${loadout.name}" names unknown gear "${slug}"`)
                }
                body[`${slot}Id`] = slug ? idBySlug.get(slug) : null
            }

            const { problems, values } = validateLoadout(body, gearById)
            if (problems.length > 0) {
                throw new Error(`loadout "${loadout.name}" breaks a rule: ${problems[0].message}`)
            }

            await client.query(insertLoadoutQuery, [values.name, ...SLOTS.map(slot => values[slot])])
        }
        console.log(`✅ ${loadoutData.length} loadouts added`)

        await client.query('COMMIT')
        console.log('🏁 database reset')
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {})
        throw error
    } finally {
        client.release()
    }
} catch (error) {
    console.error('⚠️ reset failed, existing tables left untouched:', error.message)
    process.exitCode = 1
} finally {
    await pool.end()
}
