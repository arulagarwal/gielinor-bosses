import LocationsAPI from '../services/LocationsAPI.js'
import { useFetch } from '../hooks/useFetch.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import AsyncSection from '../components/AsyncSection.jsx'
import GielinorMap, { LocationLegend } from '../components/GielinorMap.jsx'

const Locations = () => {
    usePageTitle(null)
    const { status, data: locations, error, retry } = useFetch(
        (signal) => LocationsAPI.getAllLocations({ signal }),
        []
    )

    return (
        <>
            <h1>Where are we massing?</h1>
            <p className="lede">
                Clans across Gielinor run open group boss kills every week. Pick a region on the
                map to see what's coming up there and what you just missed.
            </p>

            {/* The map image renders straight away; its clickable regions arrive with the data. */}
            <div className="map-layout">
                <GielinorMap locations={status === 'success' ? locations : null} />

                <AsyncSection
                    label="Regions"
                    status={status}
                    error={error}
                    retry={retry}
                    isEmpty={locations?.length === 0}
                    messages={{
                        loading: 'Loading regions…',
                        empty: 'No regions yet.',
                        success: `${locations?.length} regions loaded. Choose one on the map or from the list.`
                    }}
                    skeleton={<p className="loading-note" aria-hidden="true">Charting the regions…</p>}
                    empty={<p>No regions have been added yet.</p>}
                >
                    <LocationLegend locations={locations ?? []} />
                </AsyncSection>
            </div>
        </>
    )
}

export default Locations
