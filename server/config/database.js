import pg from 'pg'

// Load server/.env into process.env. The path is resolved from this file rather
// than the working directory, so it works however the server or reset script is
// started. Variables that are already set win, and a missing file is fine as
// long as the variables come from somewhere else.
try {
    process.loadEnvFile(new URL('../.env', import.meta.url))
} catch (error) {
    if (error.code !== 'ENOENT') throw error
}

// Without these, pg silently falls back to localhost and the first query fails
// with a confusing ECONNREFUSED, so fail loudly at startup instead.
const missing = ['PGHOST', 'PGPORT', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'].filter(key => !process.env[key])

if (missing.length > 0) {
    throw new Error(`Missing ${missing.join(', ')}. Copy server/.env.example to server/.env and fill it in from Render.`)
}

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    // Render only accepts encrypted connections from outside its network.
    ssl: {
        rejectUnauthorized: false
    },
    // pg waits forever for a connection by default; give up and report instead.
    connectionTimeoutMillis: 10000
}

export const pool = new pg.Pool(config)

// An idle client can lose its connection (e.g. Render restarting the instance).
// Without a listener that error would crash the whole server.
pool.on('error', (error) => {
    console.error('⚠️ idle Postgres client error', error.message)
})
