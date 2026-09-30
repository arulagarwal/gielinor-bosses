import express from 'express'
import LocationsController from '../controllers/locations.js'
import EventsController from '../controllers/events.js'

const router = express.Router()

// GET /api/locations -> every location, in map order, with event counts
router.get('/', LocationsController.getLocations)

// GET /api/locations/:slug -> one location, or a 404
router.get('/:slug', LocationsController.getLocationBySlug)

// GET /api/locations/:slug/events?sort=... -> that location's events, or a 404
router.get('/:slug/events', EventsController.getEventsByLocation)

export default router
