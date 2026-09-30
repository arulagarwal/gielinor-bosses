import { Link, useNavigate } from 'react-router'
import mapImage from '../assets/gielinor-map.png'
import { pluralMasses } from '../utils/time.js'

// Where each location sits on the 640×525 map image, keyed by the slug the
// API returns. Names and counts come from the database; only the geometry
// lives here, because it belongs to this particular picture.
const HOTSPOTS = {
    'wilderness': {
        points: '322,40 360,12 480,12 505,60 500,150 440,168 380,160 330,150 318,100',
        label: [412, 90]
    },
    'god-wars-dungeon': {
        points: '232,45 270,25 315,35 318,110 302,172 265,182 245,140 228,92',
        label: [273, 105]
    },
    'asgarnia': {
        points: '290,188 330,166 388,172 396,232 382,286 330,292 292,262',
        label: [340, 232]
    },
    'misthalin': {
        points: '398,172 468,168 490,212 468,300 425,318 398,282 402,232',
        label: [440, 240]
    },
    'kharidian-desert': {
        points: '405,325 462,305 522,262 562,332 562,440 482,472 412,442 396,382',
        label: [482, 390]
    },
    'morytania': {
        points: '508,142 562,130 612,152 616,252 602,312 542,302 516,242',
        label: [562, 222]
    }
}

// SVG has no <Link>, so hotspots are SVG <a> elements that hand plain clicks
// to the router (no full page reload). Modified clicks (cmd/ctrl/shift,
// middle button) fall through to the browser so "open in new tab" still works.
const isPlainClick = (event) =>
    event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey

const describe = (location) =>
    `${location.name}: ${location.upcomingCount === 0 ? 'no upcoming masses' : `${pluralMasses(location.upcomingCount)} upcoming`}`

const GielinorMap = ({ locations }) => {
    const navigate = useNavigate()
    const placed = (locations ?? []).filter(location => HOTSPOTS[location.slug])

    return (
        <figure className="map-figure">
            <svg
                className="gielinor-map"
                viewBox="0 0 640 525"
                role="group"
                aria-label="Map of Gielinor. Choose a region to see its masses."
            >
                <image href={mapImage} width="640" height="525" />

                {placed.map(location => {
                    const { points, label: [x, y] } = HOTSPOTS[location.slug]
                    const href = `/locations/${location.slug}`

                    return (
                        <a
                            key={location.slug}
                            href={href}
                            className="hotspot"
                            aria-label={describe(location)}
                            onClick={(event) => {
                                if (!isPlainClick(event)) return
                                event.preventDefault()
                                navigate(href)
                            }}
                        >
                            <polygon points={points} />
                            <text x={x} y={y} className="hotspot-label" aria-hidden="true">{location.name}</text>
                            {location.upcomingCount > 0 && (
                                <text x={x} y={y + 16} className="hotspot-count" aria-hidden="true">
                                    {location.upcomingCount} upcoming
                                </text>
                            )}
                        </a>
                    )
                })}
            </svg>
            <figcaption className="credit">
                Map of Gielinor from the RuneScape Wiki. Hover or tab to a region, then click or press Enter.
            </figcaption>
        </figure>
    )
}

// The same destinations as a list, for small screens where the map regions
// get tiny. It supplements the map rather than replacing it.
export const LocationLegend = ({ locations }) => (
    <nav aria-label="Regions" className="legend">
        <ul>
            {locations.map(location => (
                <li key={location.slug}>
                    <Link to={`/locations/${location.slug}`}>{location.name}</Link>
                    <span className="legend-count">
                        {location.upcomingCount === 0 ? 'none upcoming' : `${location.upcomingCount} upcoming`}
                    </span>
                </li>
            ))}
        </ul>
    </nav>
)

export default GielinorMap
