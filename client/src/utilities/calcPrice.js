import { SLOTS } from './validation.js'

// selection maps each slot to a gear option id (or null); gearById is a Map
// of id -> option. Empty slots and unknown ids add nothing.
export const totalPrice = (selection, gearById) =>
    SLOTS.reduce((sum, slot) => sum + (gearById.get(selection[slot])?.priceGp ?? 0), 0)

// The way RuneScape abbreviates coin stacks: 950 gp, 45K gp, 12.4M gp.
export const formatGp = (amount) => {
    if (amount >= 1_000_000_000) return `${trim(amount / 1_000_000_000)}B gp`
    if (amount >= 10_000_000) return `${Math.floor(amount / 1_000_000)}M gp`
    if (amount >= 1_000_000) return `${trim(amount / 1_000_000)}M gp`
    if (amount >= 100_000) return `${Math.floor(amount / 1_000)}K gp`
    if (amount >= 10_000) return `${trim(amount / 1_000)}K gp`
    return `${amount.toLocaleString('en-US')} gp`
}

// One decimal, rounded down (so 1.99M never shows as 2M), with ".0" dropped.
const trim = (value) => String(Math.floor(value * 10) / 10)

// The exact figure, for titles and screen readers.
export const formatGpExact = (amount) => `${amount.toLocaleString('en-US')} coins`

// RuneScape colours coin stacks by size: yellow, then white at 100K, then
// green at 10M. Returned as a tier name for a data attribute.
export const coinTier = (amount) => (amount >= 10_000_000 ? 'green' : amount >= 100_000 ? 'white' : 'yellow')
