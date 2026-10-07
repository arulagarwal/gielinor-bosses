// Sample loadouts so the list isn't empty after a reset. Each slot names a
// gear slug from data/gear.js; null leaves an optional slot empty. reset.js
// runs every one through the same rules the API uses.
const loadouts = [
    {
        name: 'Bandos tank',
        weapon: 'abyssal-whip',
        offhand: 'dragon-defender',
        head: 'bandos-helmet',
        body: 'bandos-chestplate',
        legs: 'bandos-tassets',
        cape: 'fire-cape'
    },
    {
        name: 'Arma ranger',
        weapon: 'armadyl-crossbow',
        offhand: 'off-hand-armadyl-crossbow',
        head: 'armadyl-helmet',
        body: 'armadyl-chestplate',
        legs: 'armadyl-chainskirt',
        cape: 'avas-accumulator'
    },
    {
        name: 'Budget mage',
        weapon: 'ancient-staff',
        offhand: null,
        head: 'mystic-hat',
        body: 'mystic-robe-top',
        legs: 'mystic-robe-bottom',
        cape: 'cape-of-legends'
    },
    {
        name: 'Godsword spec',
        weapon: 'armadyl-godsword',
        offhand: null,
        head: null,
        body: 'rune-platebody',
        legs: 'rune-platelegs',
        cape: 'obsidian-cape'
    }
]

export default loadouts
