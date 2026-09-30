import express from 'express'
import EventsController from '../controllers/events.js'

const router = express.Router()

// GET /api/events?location=<slug>&sort=upcoming|earliest|latest -> events as JSON
router.get('/', EventsController.getEvents)

// GET /api/events/:id -> one event, or a 404
router.get('/:id', EventsController.getEventById)

export default router
