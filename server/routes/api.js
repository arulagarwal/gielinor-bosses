import express from 'express'
import bossesRouter from './bosses.js'
import locationsRouter from './locations.js'
import eventsRouter from './events.js'

const router = express.Router()

router.use('/bosses', bossesRouter)
router.use('/locations', locationsRouter)
router.use('/events', eventsRouter)

// Unknown API paths answer in JSON instead of falling through to the app's HTML.
router.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
})

export default router
