import { getJSON } from './request.js'

// location is a slug; leaving either option empty lets the server use its default.
const getAllEvents = ({ location, sort } = {}, options) => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (sort) params.set('sort', sort)

    const query = params.toString()
    return getJSON(query ? `/api/events?${query}` : '/api/events', options)
}

const getEventById = (id, options) => getJSON(`/api/events/${encodeURIComponent(id)}`, options)

export default {
    getAllEvents,
    getEventById
}
