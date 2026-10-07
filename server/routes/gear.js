import express from 'express'
import GearController from '../controllers/gear.js'

const router = express.Router()

// GET /api/gear -> every option the loadout builder offers, by slot
router.get('/', GearController.getGear)

export default router
