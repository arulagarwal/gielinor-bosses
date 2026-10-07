import { Link } from 'react-router'
import { Avatar } from './LoadoutPreview.jsx'
import { coinTier, formatGp, formatGpExact } from '../utilities/calcPrice.js'
import { SLOTS, loadoutStyle } from '../utilities/validation.js'

// One saved loadout in the list: its avatar, the item icons in a row, the
// total, and Edit / Delete. onDelete is the list page's handler; deleting is
// true while that request is in flight.
const LoadoutCard = ({ loadout, onDelete, deleting = false }) => {
    const style = loadoutStyle(loadout.weapon)

    return (
        <li className="loadout-card" data-style={style ?? undefined}>
            <Link to={`/loadouts/${loadout.id}`} className="loadout-card-art" tabIndex={-1} aria-hidden="true">
                <Avatar items={loadout} className="avatar avatar-small" />
            </Link>

            <div className="loadout-card-body">
                <h3><Link to={`/loadouts/${loadout.id}`}>{loadout.name}</Link></h3>
                {style && <p className="style-badge">{style}</p>}

                <ul className="item-strip" aria-label="Equipped items">
                    {SLOTS.filter(slot => loadout[slot]).map(slot => (
                        <li key={slot}><img src={loadout[slot].image} alt={loadout[slot].name} title={loadout[slot].name} loading="lazy" /></li>
                    ))}
                </ul>

                <p className="loadout-total">
                    <strong className="coins" data-coins={coinTier(loadout.totalPrice)} title={formatGpExact(loadout.totalPrice)}>
                        {formatGp(loadout.totalPrice)}
                    </strong>
                </p>

                <div className="card-actions">
                    <Link to={`/loadouts/${loadout.id}/edit`} role="button" className="outline" aria-label={`Edit ${loadout.name}`}>
                        Edit
                    </Link>
                    <button
                        type="button"
                        className="outline danger"
                        onClick={() => onDelete(loadout)}
                        disabled={deleting}
                        aria-busy={deleting}
                        aria-label={`Delete ${loadout.name}`}
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </li>
    )
}

export default LoadoutCard
