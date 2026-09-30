import express from 'express'
import BossesController from '../controllers/bosses.js'

const router = express.Router()

// GET /api/bosses -> every boss as JSON, in list order
router.get('/', BossesController.getBosses)

// GET /api/bosses/:slug -> one boss as JSON, or a 404
router.get('/:slug', BossesController.getBossBySlug)

export default router
