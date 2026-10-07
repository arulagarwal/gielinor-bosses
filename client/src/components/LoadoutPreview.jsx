import { SLOTS, SLOT_LABELS } from '../utilities/validation.js'
import { coinTier, formatGp, formatGpExact } from '../utilities/calcPrice.js'

// What an adventurer wears with an empty slot.
const BARE = {
    skin: '#e0b48a',
    head: null,
    body: '#8a7a5a',
    legs: '#5a4a3a'
}

// The weapon the right hand holds. Its shape follows the style (blade, bow,
// staff), and two-handers are drawn bigger; its colour is the item's.
const Weapon = ({ item }) => {
    if (!item) return null
    const fill = item.color

    if (item.style === 'ranged') {
        return item.twoHanded
            ? <path d="M22 70 Q4 116 22 162" fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" />
            : <g><rect x="14" y="110" width="26" height="6" rx="2" fill={fill} /><path d="M16 104 Q12 113 16 122" fill="none" stroke={fill} strokeWidth="3" /></g>
    }

    if (item.style === 'magic') {
        return item.twoHanded
            ? <g><rect x="29" y="58" width="5" height="108" rx="2" fill="#6b4f2a" /><circle cx="31.5" cy="56" r="7" fill={fill} /></g>
            : <g><rect x="22" y="96" width="4" height="26" rx="2" transform="rotate(-20 24 109)" fill={fill} /><circle cx="19" cy="95" r="3.5" fill={fill} /></g>
    }

    // melee
    return item.twoHanded
        ? <g transform="rotate(-12 33 116)"><rect x="29" y="34" width="8" height="78" rx="2" fill={fill} /><rect x="22" y="110" width="22" height="5" rx="2" fill="#4a3a2a" /></g>
        : <g transform="rotate(-18 33 116)"><rect x="30" y="70" width="6" height="44" rx="2" fill={fill} /><rect x="25" y="112" width="16" height="4" rx="2" fill="#4a3a2a" /></g>
}

// The left hand: a shield for melee, a small crossbow for ranged, an orb for magic.
const Offhand = ({ item }) => {
    if (!item) return null
    const fill = item.color

    if (item.style === 'ranged') {
        return <g><rect x="80" y="110" width="26" height="6" rx="2" fill={fill} /><path d="M104 104 Q108 113 104 122" fill="none" stroke={fill} strokeWidth="3" /></g>
    }
    if (item.style === 'magic') {
        return <circle cx="92" cy="110" r="8" fill={fill} stroke="#ffffff55" strokeWidth="2" />
    }
    return <path d="M82 96 H104 V112 Q104 128 93 136 Q82 128 82 112 Z" fill={fill} stroke="#00000055" strokeWidth="1.5" />
}

// An SVG adventurer whose armour, cape and held items take each chosen
// option's colour and shape. It's the "the picture changes" half of the
// preview; the equipment grid beside it shows the real item icons.
export const Avatar = ({ items, className = 'avatar' }) => {
    const { head, body, legs, cape, weapon, offhand } = items
    const label = SLOTS
        .filter(slot => items[slot])
        .map(slot => items[slot].name)
        .join(', ')

    return (
        <svg
            className={className}
            viewBox="0 0 120 190"
            role="img"
            aria-label={label ? `Adventurer wearing ${label}` : 'Adventurer with nothing equipped'}
        >
            {/* cape hangs behind everything */}
            {cape && <path d="M40 58 H80 L94 168 H26 Z" fill={cape.color} />}

            {/* legs and boots */}
            <rect x="46" y="118" width="12" height="54" rx="3" fill={legs?.color ?? BARE.legs} />
            <rect x="62" y="118" width="12" height="54" rx="3" fill={legs?.color ?? BARE.legs} />
            <rect x="44" y="170" width="15" height="7" rx="2" fill="#2a2018" />
            <rect x="61" y="170" width="15" height="7" rx="2" fill="#2a2018" />

            {/* arms, then torso over the shoulders */}
            <rect x="28" y="62" width="10" height="50" rx="4" fill={body?.color ?? BARE.body} />
            <rect x="82" y="62" width="10" height="50" rx="4" fill={body?.color ?? BARE.body} />
            <path d="M38 58 H82 L77 124 H43 Z" fill={body?.color ?? BARE.body} />
            <rect x="43" y="116" width="34" height="6" fill="#00000033" />
            <circle cx="33" cy="116" r="5" fill={BARE.skin} />
            <circle cx="87" cy="116" r="5" fill={BARE.skin} />

            {/* head, then the helm over it */}
            <rect x="55" y="50" width="10" height="9" fill={BARE.skin} />
            <circle cx="60" cy="38" r="14" fill={BARE.skin} />
            <circle cx="55" cy="38" r="1.6" fill="#2a2018" />
            <circle cx="65" cy="38" r="1.6" fill="#2a2018" />
            {head && <path d="M45 40 Q45 21 60 21 Q75 21 75 40 L75 44 H70 V34 H50 V44 H45 Z" fill={head.color} />}

            <Weapon item={weapon} />
            <Offhand item={offhand} />
        </svg>
    )
}

// The worn-equipment grid, laid out like the in-game equipment screen.
const EquipmentGrid = ({ items }) => (
    <ul className="equipment-grid">
        {SLOTS.map(slot => {
            const item = items[slot]
            return (
                <li key={slot} className={item ? 'equipment-slot filled' : 'equipment-slot'} style={{ gridArea: slot }}>
                    {item
                        ? <img src={item.image} alt={item.name} title={item.name} />
                        : <span className="slot-empty">{SLOT_LABELS[slot]}</span>}
                </li>
            )
        })}
    </ul>
)

// items maps each slot to a gear option (or null). The form passes the live
// selection, so the picture, icons and total update on every click.
const LoadoutPreview = ({ items, total, live = false }) => (
    <div className="loadout-preview">
        <div className="preview-stage">
            <Avatar items={items} />
            <EquipmentGrid items={items} />
        </div>
        <p className="preview-total">
            <span className="muted">Total cost</span>{' '}
            <strong
                className="coins"
                data-coins={coinTier(total)}
                title={formatGpExact(total)}
                // Announced politely while building, so the price change isn't silent.
                aria-live={live ? 'polite' : undefined}
            >
                {formatGp(total)}
            </strong>
        </p>
    </div>
)

export default LoadoutPreview
