import express from 'express'
import LoadoutsController from '../controllers/loadouts.js'

const router = express.Router()

// GET /api/loadouts -> every saved loadout, newest first
router.get('/', LoadoutsController.getLoadouts)

// GET /api/loadouts/:id -> one loadout, or a 404
router.get('/:id', LoadoutsController.getLoadoutById)

// POST /api/loadouts -> save a new loadout (422 if the gear doesn't fit together)
router.post('/', LoadoutsController.createLoadout)

// PATCH /api/loadouts/:id -> replace a loadout's name and gear
router.patch('/:id', LoadoutsController.updateLoadout)

// DELETE /api/loadouts/:id -> remove a loadout
router.delete('/:id', LoadoutsController.deleteLoadout)

export default router
