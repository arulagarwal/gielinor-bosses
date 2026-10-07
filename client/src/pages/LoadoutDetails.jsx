import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import LoadoutsAPI from '../services/LoadoutsAPI.js'
import { useFetch } from '../hooks/useFetch.js'
import { useFlash } from '../hooks/useFlash.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import AsyncSection from '../components/AsyncSection.jsx'
import Flash from '../components/Flash.jsx'
import LoadoutPreview from '../components/LoadoutPreview.jsx'
import NotFound from './NotFound.jsx'
import { formatGp, formatGpExact } from '../utilities/calcPrice.js'
import { SLOTS, SLOT_LABELS, loadoutStyle } from '../utilities/validation.js'

const LoadoutDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [flash, setFlash] = useFlash()
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState(null)

    const result = useFetch((signal) => LoadoutsAPI.getLoadoutById(id, { signal }), [id])
    const loadout = result.data

    usePageTitle(loadout?.name ?? 'Loadout')

    if (result.status === 'error' && [400, 404].includes(result.error.status)) {
        return <NotFound message="That loadout doesn't exist. It may have been deleted." />
    }

    const handleDelete = async () => {
        if (!window.confirm(`Delete “${loadout.name}”? This can't be undone.`)) return

        setDeleting(true)
        setDeleteError(null)
        try {
            await LoadoutsAPI.deleteLoadout(loadout.id)
            navigate('/loadouts', { state: { flash: `Deleted “${loadout.name}”.` } })
        } catch (error) {
            setDeleteError(error.message)
            setDeleting(false)
        }
    }

    const style = loadoutStyle(loadout?.weapon)

    return (
        <>
            <nav aria-label="Breadcrumb" className="breadcrumb">
                <Link to="/loadouts">Loadouts</Link>
            </nav>

            <Flash message={flash} onDismiss={() => setFlash(null)} />

            <AsyncSection
                label="Loadout"
                status={result.status}
                error={result.error}
                retry={result.retry}
                isEmpty={false}
                messages={{ loading: 'Loading loadout…', empty: '', success: loadout ? `Showing ${loadout.name}.` : '' }}
                skeleton={<div className="loadout-detail skeleton"><div className="loadout-preview skeleton-block" /></div>}
            >
                {loadout && (
                    <div className="loadout-detail" data-style={style ?? undefined}>
                        <div>
                            {style && <p className="eyebrow">{style} loadout</p>}
                            <h1 className="page-heading">{loadout.name}</h1>
                            <LoadoutPreview items={loadout} total={loadout.totalPrice} />
                        </div>

                        <div>
                            <h2 className="section-title">Equipment</h2>
                            <table className="gear-table">
                                <thead>
                                    <tr><th scope="col">Slot</th><th scope="col">Item</th><th scope="col" className="num">Price</th></tr>
                                </thead>
                                <tbody>
                                    {SLOTS.map(slot => {
                                        const item = loadout[slot]
                                        return (
                                            <tr key={slot}>
                                                <th scope="row">{SLOT_LABELS[slot]}</th>
                                                <td>
                                                    {item
                                                        ? <span className="gear-cell"><img src={item.image} alt="" />{item.name}</span>
                                                        : <span className="muted">Empty</span>}
                                                </td>
                                                <td className="num" title={item ? formatGpExact(item.priceGp) : undefined}>
                                                    {item ? formatGp(item.priceGp) : '—'}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th scope="row" colSpan={2}>Total</th>
                                        <td className="num"><strong>{formatGpExact(loadout.totalPrice)}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>

                            {deleteError && <p role="alert" className="field-error">Couldn't delete: {deleteError}</p>}

                            <div className="card-actions">
                                <Link to={`/loadouts/${loadout.id}/edit`} role="button">Edit loadout</Link>
                                <button type="button" className="outline danger" onClick={handleDelete} disabled={deleting} aria-busy={deleting}>
                                    {deleting ? 'Deleting…' : 'Delete loadout'}
                                </button>
                            </div>

                            <p className="timestamps muted">
                                Created <time dateTime={loadout.createdAt}>{new Date(loadout.createdAt).toLocaleString()}</time>
                                {loadout.updatedAt !== loadout.createdAt && (
                                    <> · updated <time dateTime={loadout.updatedAt}>{new Date(loadout.updatedAt).toLocaleString()}</time></>
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </AsyncSection>
        </>
    )
}

export default LoadoutDetails
