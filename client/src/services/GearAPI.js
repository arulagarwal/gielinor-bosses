import { getJSON } from './request.js'

// Every option the builder offers, in equipment-screen slot order.
const getAllGear = (options) => getJSON('/api/gear', options)

export default {
    getAllGear
}
