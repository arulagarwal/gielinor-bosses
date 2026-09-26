// Rebuilds the bosses table from the seed data: `npm run reset`.
import { pool } from './database.js'
import bossData from '../data/bosses.js'

const createTableQuery = `
    CREATE TABLE bosses (
        id            SERIAL       PRIMARY KEY,
        slug          VARCHAR(100) NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
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

const insertQuery = `
    INSERT INTO bosses (slug, name, tier, combat_level, life_points, location, requirements,
                        aggressive, max_hit, release_date, notable_drops, image, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
`

// Everything runs in one transaction on one client. Postgres DDL is
// transactional, so if any step fails the old table is left exactly as it
// was. Inserting one row at a time, awaited, keeps the SERIAL ids in the same
// order as the seed file, which is the order the home page lists them in.
try {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        await client.query('DROP TABLE IF EXISTS bosses')
        await client.query(createTableQuery)
        console.log('🎉 bosses table created')

        for (const boss of bossData) {
            await client.query(insertQuery, [
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
            console.log(`✅ ${boss.name} added`)
        }

        await client.query('COMMIT')
        console.log(`🏁 bosses table reset with ${bossData.length} rows`)
    } catch (error) {
        await client.query('ROLLBACK').catch(() => {})
        throw error
    } finally {
        client.release()
    }
} catch (error) {
    console.error('⚠️ reset failed, existing bosses table left untouched:', error.message)
    process.exitCode = 1
} finally {
    await pool.end()
}
