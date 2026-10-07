import { getJSON, sendJSON } from './request.js'

const url = (id) => `/api/loadouts/${encodeURIComponent(id)}`

// loadout is { name, weaponId, offhandId, headId, bodyId, legsId, capeId }.
const getAllLoadouts = (options) => getJSON('/api/loadouts', options)
const getLoadoutById = (id, options) => getJSON(url(id), options)
const createLoadout = (loadout) => sendJSON('/api/loadouts', { method: 'POST', body: loadout })
const updateLoadout = (id, loadout) => sendJSON(url(id), { method: 'PATCH', body: loadout })
const deleteLoadout = (id) => sendJSON(url(id), { method: 'DELETE' })

export default {
    getAllLoadouts,
    getLoadoutById,
    createLoadout,
    updateLoadout,
    deleteLoadout
}
