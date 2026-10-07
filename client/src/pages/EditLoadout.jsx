import { Link, useNavigate, useParams } from 'react-router'
import GearAPI from '../services/GearAPI.js'
import LoadoutsAPI from '../services/LoadoutsAPI.js'
import { useFetch } from '../hooks/useFetch.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import AsyncSection from '../components/AsyncSection.jsx'
import LoadoutForm from '../components/LoadoutForm.jsx'
import { BuilderSkeleton } from '../components/LoadoutSkeletons.jsx'
import NotFound from './NotFound.jsx'
import { selectionFromLoadout } from '../utilities/validation.js'

const EditLoadout = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    // The form needs both the options and the saved loadout before it can render.
    const page = useFetch(
        (signal) => Promise.all([GearAPI.getAllGear({ signal }), LoadoutsAPI.getLoadoutById(id, { signal })]),
        [id]
    )
    const [gear, loadout] = page.data ?? []

    usePageTitle(loadout ? `Edit ${loadout.name}` : 'Edit loadout')

    if (page.status === 'error' && [400, 404].includes(page.error.status)) {
        return <NotFound message="That loadout doesn't exist. It may have been deleted." />
    }

    const save = async (body) => {
        const saved = await LoadoutsAPI.updateLoadout(id, body)
        navigate(`/loadouts/${saved.id}`, { state: { flash: `Updated “${saved.name}”.` } })
    }

    return (
        <>
            <nav aria-label="Breadcrumb" className="breadcrumb">
                <Link to="/loadouts">Loadouts</Link>
                {loadout && <> / <Link to={`/loadouts/${loadout.id}`}>{loadout.name}</Link></>}
            </nav>
            <h1 className="page-heading">{loadout ? `Edit ${loadout.name}` : 'Edit loadout'}</h1>
            <p className="lede">Swap any piece of gear. Nothing is saved until you press Save changes.</p>

            <AsyncSection
                label="Edit loadout"
                status={page.status}
                error={page.error}
                retry={page.retry}
                isEmpty={false}
                messages={{ loading: 'Loading loadout…', empty: '', success: `Editing ${loadout?.name ?? 'loadout'}.` }}
                skeleton={<BuilderSkeleton />}
            >
                {loadout && (
                    // key resets the form if the route moves to another loadout.
                    <LoadoutForm
                        key={loadout.id}
                        gear={gear}
                        initialName={loadout.name}
                        initialSelection={selectionFromLoadout(loadout)}
                        submitLabel="Save changes"
                        cancelTo={`/loadouts/${loadout.id}`}
                        onSubmit={save}
                    />
                )}
            </AsyncSection>
        </>
    )
}

export default EditLoadout
