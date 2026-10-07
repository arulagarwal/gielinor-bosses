// The rules every saved loadout has to pass. The API and reset.js both run
// them, and client/src/utilities/validation.js applies the same rules in the
// browser so the form can warn early. They only read option data (slot,
// style, twoHanded), so changing gear never means changing these rules.

export const SLOTS = ['weapon', 'offhand', 'head', 'body', 'legs', 'cape']
export const REQUIRED_SLOTS = ['weapon', 'body', 'legs']
export const NAME_MAX = 50

const SLOT_LABELS = {
    weapon: 'Weapon',
    offhand: 'Off-hand',
    head: 'Head',
    body: 'Body',
    legs: 'Legs',
    cape: 'Cape'
}

// Request bodies send `${slot}Id` keys. Empty means "nothing in this slot".
const readId = (value) => {
    if (value === null || value === undefined || value === '') return null
    const id = Number(value)
    return Number.isInteger(id) && id > 0 ? id : NaN
}

// body: { name, weaponId, offhandId, headId, bodyId, legsId, capeId }
// gearById: Map of id -> { id, slot, name, style, twoHanded }
// Returns { problems: [{ field, message }], values } where values holds the
// trimmed name and one id (or null) per slot, ready to insert.
export const validateLoadout = (body, gearById) => {
    const problems = []
    const values = {}

    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    if (!name) {
        problems.push({ field: 'name', message: 'Give the loadout a name.' })
    } else if (name.length > NAME_MAX) {
        problems.push({ field: 'name', message: `Keep the name to ${NAME_MAX} characters or fewer.` })
    }
    values.name = name

    const picked = {}

    for (const slot of SLOTS) {
        const id = readId(body?.[`${slot}Id`])
        values[slot] = null

        if (id === null) {
            if (REQUIRED_SLOTS.includes(slot)) {
                problems.push({ field: slot, message: `Choose something for the ${SLOT_LABELS[slot].toLowerCase()} slot.` })
            }
            continue
        }

        const option = gearById.get(id)
        if (Number.isNaN(id) || !option) {
            problems.push({ field: slot, message: `That ${SLOT_LABELS[slot].toLowerCase()} item doesn't exist.` })
            continue
        }
        if (option.slot !== slot) {
            problems.push({ field: slot, message: `${option.name} can't be worn in the ${SLOT_LABELS[slot].toLowerCase()} slot.` })
            continue
        }

        values[slot] = id
        picked[slot] = option
    }

    const { weapon, offhand } = picked

    if (weapon && offhand) {
        if (weapon.twoHanded) {
            problems.push({
                field: 'offhand',
                message: `${weapon.name} is two-handed, so you can't also hold ${offhand.name}.`
            })
        } else if (offhand.style && weapon.style && offhand.style !== weapon.style) {
            problems.push({
                field: 'offhand',
                message: `${offhand.name} is a ${offhand.style} off-hand and won't work with a ${weapon.style} weapon (${weapon.name}).`
            })
        }
    }

    return { problems, values }
}
