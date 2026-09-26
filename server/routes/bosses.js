import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { findBossBySlug } from '../controllers/bosses.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// GET /bosses/:slug -> the static detail page, but only for a boss that
// actually exists in the database. An unknown slug declines to handle the
// request so it falls through to the app-level 404 handler in server.js,
// which keeps the 404 response defined in exactly one place.
router.get('/:slug', async (req, res, next) => {
    try {
        const boss = await findBossBySlug(req.params.slug)

        if (!boss) {
            return next()
        }

        res.status(200).sendFile(path.resolve(__dirname, '../public/boss.html'))
    } catch (error) {
        // Express 4 won't catch a rejected promise itself; hand it to the error handler.
        next(error)
    }
})

export default router
