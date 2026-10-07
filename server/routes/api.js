import express from 'express'
import bossesRouter from './bosses.js'
import locationsRouter from './locations.js'
import eventsRouter from './events.js'
import gearRouter from './gear.js'
import loadoutsRouter from './loadouts.js'

const router = express.Router()

// POST and PATCH send JSON bodies. A loadout is a name and six ids, so 10kb is plenty.
router.use(express.json({ limit: '10kb' }))

router.use('/bosses', bossesRouter)
router.use('/locations', locationsRouter)
router.use('/events', eventsRouter)
router.use('/gear', gearRouter)
router.use('/loadouts', loadoutsRouter)

// Unknown API paths answer in JSON instead of falling through to the app's HTML.
router.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
})

// express.json() rejects a malformed or oversized body before any route runs;
// answer that in JSON too, instead of Express's default HTML error page.
// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => {
    const status = error.status ?? 500
    if (status >= 500) console.error('⚠️ API error', error.message)
    const messages = { 400: 'Request body must be valid JSON', 413: 'Request body is too large' }
    res.status(status).json({ error: messages[status] ?? 'Something went wrong' })
})

export default router
