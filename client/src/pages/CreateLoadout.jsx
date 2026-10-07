import { useNavigate } from 'react-router'
import GearAPI from '../services/GearAPI.js'
import LoadoutsAPI from '../services/LoadoutsAPI.js'
import { useFetch } from '../hooks/useFetch.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import AsyncSection from '../components/AsyncSection.jsx'
import LoadoutForm from '../components/LoadoutForm.jsx'
import { BuilderSkeleton } from '../components/LoadoutSkeletons.jsx'

const CreateLoadout = () => {
    usePageTitle('Build a loadout')
    const navigate = useNavigate()
    const gear = useFetch((signal) => GearAPI.getAllGear({ signal }), [])

    const save = async (body) => {
        const saved = await LoadoutsAPI.createLoadout(body)
        navigate(`/loadouts/${saved.id}`, { state: { flash: `Saved “${saved.name}”.` } })
    }

    return (
        <>
            <p className="eyebrow">Loadout builder</p>
            <h1 className="page-heading">What are you bringing to the mass?</h1>
            <p className="lede">
                Pick something for each slot and watch your adventurer gear up. Two-handed weapons leave no room
                for an off-hand, and an off-hand has to match your weapon's combat style.
            </p>

            <AsyncSection
                label="Loadout builder"
                status={gear.status}
                error={gear.error}
                retry={gear.retry}
                isEmpty={(gear.data ?? []).length === 0}
                messages={{ loading: 'Loading gear…', empty: 'No gear to choose from.', success: 'Gear loaded. Choose an item for each slot.' }}
                skeleton={<BuilderSkeleton />}
                empty={<><h2>No gear yet</h2><p>Run <code>npm run reset</code> to seed the gear options.</p></>}
            >
                <LoadoutForm gear={gear.data ?? []} submitLabel="Save loadout" cancelTo="/loadouts" onSubmit={save} />
            </AsyncSection>
        </>
    )
}

export default CreateLoadout
