import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import bossData from '../data/bosses.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicPath = (file) => path.resolve(__dirname, '../public', file)

const router = express.Router()

// GET /bosses -> the whole collection as JSON. This is the endpoint the
// frontend fetches, and the one that becomes a database query in Unit 2.
router.get('/', (req, res) => {
    res.status(200).json(bossData)
})

// GET /bosses/:slug -> the static detail page, but only for a boss that
// actually exists. An unknown slug is a genuine 404, not a blank page.
router.get('/:slug', (req, res) => {
    const boss = bossData.find(boss => boss.slug === req.params.slug)

    if (!boss) {
        return res.status(404).sendFile(publicPath('404.html'))
    }

    res.status(200).sendFile(publicPath('boss.html'))
})

export default router
