import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import apiRouter from './routes/api.js'
import { findLocationBySlug } from './controllers/locations.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// The built React app (vite writes client/ into here via `npm run build`).
const PUBLIC_DIR = path.resolve(__dirname, './public')
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html')

const app = express()

// JSON data, queried from Postgres
app.use('/api', apiRouter)

// The hashed bundles, stylesheets and images Vite emits, plus favicon.svg.
// `index: false` leaves "/" to the app shell handler below.
app.use(express.static(PUBLIC_DIR, { index: false }))

// A location page is only real if the location is in the database. React
// renders its own "not found" view either way, but an unknown slug should
// still answer with a 404 status, not a 200.
app.get('/locations/:slug', async (req, res, next) => {
    try {
        const location = await findLocationBySlug(req.params.slug)
        res.status(location ? 200 : 404).sendFile(INDEX_HTML)
    } catch (error) {
        // Express 4 won't catch a rejected promise itself; hand it to the error handler.
        next(error)
    }
})

// Every other page is routed on the client, so any GET gets the app shell and
// React Router decides what to show. The routes React knows are listed here,
// so anything else can also carry a real 404 status.
const CLIENT_ROUTES = ['/', '/events']

app.get('*', (req, res) => {
    // React Router treats /events/ like /events, so ignore a trailing slash.
    const route = req.path.replace(/\/+$/, '') || '/'
    res.status(CLIENT_ROUTES.includes(route) ? 200 : 404).sendFile(INDEX_HTML)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
