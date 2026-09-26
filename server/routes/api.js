import express from 'express'
import BossesController from '../controllers/bosses.js'

const router = express.Router()

// GET /api/bosses -> every boss as JSON, in list order
router.get('/bosses', BossesController.getBosses)

// GET /api/bosses/:slug -> one boss as JSON, or a 404
router.get('/bosses/:slug', BossesController.getBossBySlug)

// Unknown API paths answer in JSON instead of falling through to the HTML 404 page.
router.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
})

export default router
