import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import bossData from '../data/bosses.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// GET /bosses -> the whole collection as JSON. This is the endpoint the
// frontend fetches, and the one that becomes a database query in Unit 2.
router.get('/', (req, res) => {
    res.status(200).json(bossData)
})

// GET /bosses/:slug -> the static detail page, but only for a boss that
// actually exists. An unknown slug declines to handle the request so it
// falls through to the app-level 404 handler in server.js, which keeps
// the 404 response defined in exactly one place.
router.get('/:slug', (req, res, next) => {
    const boss = bossData.find(boss => boss.slug === req.params.slug)

    if (!boss) {
        return next()
    }

    res.status(200).sendFile(path.resolve(__dirname, '../public/boss.html'))
})

export default router
