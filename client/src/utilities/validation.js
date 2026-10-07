// The same combination rules the API enforces in
// server/utils/loadoutRules.js, run in the browser so the form can explain a
// problem before anything is sent. The server still has the final say.

export const SLOTS = ['weapon', 'offhand', 'head', 'body', 'legs', 'cape']
export const REQUIRED_SLOTS = ['weapon', 'body', 'legs']
export const NAME_MAX = 50

export const SLOT_LABELS = {
    weapon: 'Weapon',
    offhand: 'Off-hand',
    head: 'Head',
    body: 'Body',
    legs: 'Legs',
    cape: 'Cape'
}

export const emptySelection = () => Object.fromEntries(SLOTS.map(slot => [slot, null]))

// Why an off-hand can't go with this weapon, or null if it can. Shared by the
// early warnings (disabledReason) and the full check (findProblems).
const offhandConflict = (weapon, offhand) => {
    if (!weapon || !offhand) return null
    if (weapon.twoHanded) {
        return `${weapon.name} is two-handed, so you can't also hold ${offhand.name}.`
    }
    if (offhand.style && weapon.style && offhand.style !== weapon.style) {
        return `${offhand.name} is a ${offhand.style} off-hand and won't work with a ${weapon.style} weapon (${weapon.name}).`
    }
    return null
}

// For the stretch goal: a short reason an option can't be picked given the
// current weapon, or null if it's fine. Only off-hands depend on another
// slot, and only the weapon decides, so changing the weapon is still always
// allowed; a clash that creates is reported by findProblems instead.
export const disabledReason = (option, selection, gearById) => {
    if (option.slot !== 'offhand') return null
    const weapon = gearById.get(selection.weapon)
    if (!weapon) return null
    if (weapon.twoHanded) return 'Your weapon is two-handed'
    if (offhandConflict(weapon, option)) return `Needs a ${option.style} weapon`
    return null
}

// Every rule the current form breaks, as [{ field, message }], in the same
// shape the API's 422 response uses.
export const findProblems = (name, selection, gearById) => {
    const problems = []
    const trimmed = name.trim()

    if (!trimmed) problems.push({ field: 'name', message: 'Give the loadout a name.' })
    else if (trimmed.length > NAME_MAX) problems.push({ field: 'name', message: `Keep the name to ${NAME_MAX} characters or fewer.` })

    for (const slot of REQUIRED_SLOTS) {
        if (!gearById.get(selection[slot])) {
            problems.push({ field: slot, message: `Choose something for the ${SLOT_LABELS[slot].toLowerCase()} slot.` })
        }
    }

    const conflict = offhandConflict(gearById.get(selection.weapon), gearById.get(selection.offhand))
    if (conflict) problems.push({ field: 'offhand', message: conflict })

    return problems
}

// Turns a saved loadout (nested objects per slot) into the form's selection.
export const selectionFromLoadout = (loadout) =>
    Object.fromEntries(SLOTS.map(slot => [slot, loadout[slot]?.id ?? null]))

// The request body the API expects.
export const toRequestBody = (name, selection) => ({
    name: name.trim(),
    ...Object.fromEntries(SLOTS.map(slot => [`${slot}Id`, selection[slot]]))
})

// A loadout's main style is its weapon's, for badges and the avatar.
export const loadoutStyle = (weapon) => weapon?.style ?? null
