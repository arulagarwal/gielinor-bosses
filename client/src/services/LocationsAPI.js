import { getJSON } from './request.js'

const getAllLocations = (options) => getJSON('/api/locations', options)

const getLocationBySlug = (slug, options) =>
    getJSON(`/api/locations/${encodeURIComponent(slug)}`, options)

const getLocationEvents = (slug, options) =>
    getJSON(`/api/locations/${encodeURIComponent(slug)}/events`, options)

export default {
    getAllLocations,
    getLocationBySlug,
    getLocationEvents
}
