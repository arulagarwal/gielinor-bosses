import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import bossesRouter from './routes/bosses.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// The built client (vite writes client/ into here via `npm run build`).
const PUBLIC_DIR = path.resolve(__dirname, './public')

const app = express()

// Serve the built assets: stylesheets, scripts, favicon.
// `index: false` stops this middleware from answering "/" itself, so the
// explicit route below stays in charge of the home page.
app.use(express.static(PUBLIC_DIR, { index: false }))

// Home page
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(PUBLIC_DIR, 'index.html'))
})

// Boss collection + individual boss pages
app.use('/bosses', bossesRouter)

// Anything that reached this point matched no route at all.
// Must stay last, or it swallows the routes above.
app.use((req, res) => {
    res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'))
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
