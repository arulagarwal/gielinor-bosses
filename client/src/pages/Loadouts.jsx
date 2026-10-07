import { useState } from 'react'
import { Link } from 'react-router'
import LoadoutsAPI from '../services/LoadoutsAPI.js'
import { useFetch } from '../hooks/useFetch.js'
import { useFlash } from '../hooks/useFlash.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import AsyncSection from '../components/AsyncSection.jsx'
import Flash from '../components/Flash.jsx'
import LoadoutCard from '../components/LoadoutCard.jsx'
import { LoadoutSkeletons } from '../components/LoadoutSkeletons.jsx'

const plural = (count) => `${count} loadout${count === 1 ? '' : 's'}`

const Loadouts = () => {
    usePageTitle('Saved loadouts')
    const [flash, setFlash] = useFlash()
    const [deletedIds, setDeletedIds] = useState(() => new Set())
    const [deletingId, setDeletingId] = useState(null)
    const [deleteError, setDeleteError] = useState(null)

    const result = useFetch((signal) => LoadoutsAPI.getAllLoadouts({ signal }), [])
    // Deleted cards are hidden locally rather than refetching the whole list.
    const list = (result.data ?? []).filter(loadout => !deletedIds.has(loadout.id))

    const handleDelete = async (loadout) => {
        if (!window.confirm(`Delete “${loadout.name}”? This can't be undone.`)) return

        setDeletingId(loadout.id)
        setDeleteError(null)
        try {
            await LoadoutsAPI.deleteLoadout(loadout.id)
            setDeletedIds(current => new Set(current).add(loadout.id))
            setFlash(`Deleted “${loadout.name}”.`)
        } catch (error) {
            // Already gone (deleted in another tab) still means it should leave the list.
            if (error.status === 404) setDeletedIds(current => new Set(current).add(loadout.id))
            setDeleteError(`Couldn't delete “${loadout.name}”: ${error.message}`)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <>
            <div className="page-header-row">
                <div>
                    <h1 className="page-heading">Saved loadouts</h1>
                    <p className="lede">Every loadout the clan has put together. Open one to see its full kit, or edit and delete it from here.</p>
                </div>
                <Link to="/loadouts/new" role="button">Build a loadout</Link>
            </div>

            <Flash message={flash} onDismiss={() => setFlash(null)} />
            {deleteError && <p role="alert" className="field-error">{deleteError}</p>}

            <AsyncSection
                label="Saved loadouts"
                status={result.status}
                error={result.error}
                retry={result.retry}
                isEmpty={list.length === 0}
                messages={{ loading: 'Loading loadouts…', empty: 'No loadouts saved yet.', success: `Showing ${plural(list.length)}.` }}
                skeleton={<LoadoutSkeletons />}
                empty={
                    <>
                        <h2>No loadouts yet</h2>
                        <p>Build the first one and it'll show up here.</p>
                        <Link to="/loadouts/new" role="button">Build a loadout</Link>
                    </>
                }
            >
                <h2 className="section-title">{plural(list.length)}</h2>
                <ul className="loadout-grid">
                    {list.map(loadout => (
                        <LoadoutCard
                            key={loadout.id}
                            loadout={loadout}
                            onDelete={handleDelete}
                            deleting={deletingId === loadout.id}
                        />
                    ))}
                </ul>
            </AsyncSection>
        </>
    )
}

export default Loadouts
