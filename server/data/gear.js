// Every option the loadout builder offers, one row per item in gear_options.
// style decides which off-hands a weapon accepts (see utils/loadoutRules.js);
// armour and capes carry a style only for display. color is the fill the
// avatar preview uses for that slot. Prices are rough Grand Exchange values
// in coins, rounded, so the totals look right without tracking the market.
const WIKI = 'https://runescape.wiki/images'

const gear = [
    // Weapons
    { slot: 'weapon', slug: 'abyssal-whip', name: 'Abyssal whip', style: 'melee', twoHanded: false, priceGp: 1_800_000, color: '#4b3a5c', image: `${WIKI}/Abyssal_whip.png` },
    { slot: 'weapon', slug: 'dragon-scimitar', name: 'Dragon scimitar', style: 'melee', twoHanded: false, priceGp: 60_000, color: '#b3261e', image: `${WIKI}/Dragon_scimitar.png` },
    { slot: 'weapon', slug: 'armadyl-godsword', name: 'Armadyl godsword', style: 'melee', twoHanded: true, priceGp: 9_500_000, color: '#d9c27a', image: `${WIKI}/Armadyl_godsword.png` },
    { slot: 'weapon', slug: 'noxious-scythe', name: 'Noxious scythe', style: 'melee', twoHanded: true, priceGp: 85_000_000, color: '#5a6e2c', image: `${WIKI}/Noxious_scythe.png` },
    { slot: 'weapon', slug: 'rune-crossbow', name: 'Rune crossbow', style: 'ranged', twoHanded: false, priceGp: 20_000, color: '#3f6f8f', image: `${WIKI}/Rune_crossbow.png` },
    { slot: 'weapon', slug: 'armadyl-crossbow', name: 'Armadyl crossbow', style: 'ranged', twoHanded: false, priceGp: 4_200_000, color: '#c9b46a', image: `${WIKI}/Armadyl_crossbow.png` },
    { slot: 'weapon', slug: 'magic-shortbow', name: 'Magic shortbow', style: 'ranged', twoHanded: true, priceGp: 1_500, color: '#7a5a2e', image: `${WIKI}/Magic_shortbow.png` },
    { slot: 'weapon', slug: 'wand-of-the-cywir-elders', name: 'Wand of the Cywir elders', style: 'magic', twoHanded: false, priceGp: 3_100_000, color: '#2f8f83', image: `${WIKI}/Wand_of_the_Cywir_elders.png` },
    { slot: 'weapon', slug: 'staff-of-light', name: 'Staff of light', style: 'magic', twoHanded: true, priceGp: 900_000, color: '#e4d48a', image: `${WIKI}/Staff_of_light.png` },
    { slot: 'weapon', slug: 'ancient-staff', name: 'Ancient staff', style: 'magic', twoHanded: true, priceGp: 45_000, color: '#5b3f7a', image: `${WIKI}/Ancient_staff.png` },

    // Off-hands
    { slot: 'offhand', slug: 'dragon-defender', name: 'Dragon defender', style: 'melee', twoHanded: false, priceGp: 250_000, color: '#b3261e', image: `${WIKI}/Dragon_defender.png` },
    { slot: 'offhand', slug: 'rune-kiteshield', name: 'Rune kiteshield', style: 'melee', twoHanded: false, priceGp: 35_000, color: '#3f6f8f', image: `${WIKI}/Rune_kiteshield.png` },
    { slot: 'offhand', slug: 'dragonfire-shield', name: 'Dragonfire shield', style: 'melee', twoHanded: false, priceGp: 2_400_000, color: '#6a4a3a', image: `${WIKI}/Dragonfire_shield.png` },
    { slot: 'offhand', slug: 'off-hand-rune-crossbow', name: 'Off-hand rune crossbow', style: 'ranged', twoHanded: false, priceGp: 20_000, color: '#3f6f8f', image: `${WIKI}/Off-hand_rune_crossbow.png` },
    { slot: 'offhand', slug: 'off-hand-armadyl-crossbow', name: 'Off-hand Armadyl crossbow', style: 'ranged', twoHanded: false, priceGp: 4_000_000, color: '#c9b46a', image: `${WIKI}/Off-hand_Armadyl_crossbow.png` },
    { slot: 'offhand', slug: 'mystic-orb', name: 'Mystic orb', style: 'magic', twoHanded: false, priceGp: 15_000, color: '#3b5bab', image: `${WIKI}/Mystic_orb.png` },
    { slot: 'offhand', slug: 'imperium-core', name: 'Imperium core', style: 'magic', twoHanded: false, priceGp: 2_800_000, color: '#8a2be2', image: `${WIKI}/Imperium_core.png` },

    // Helmets
    { slot: 'head', slug: 'bandos-helmet', name: 'Bandos helmet', style: 'melee', twoHanded: false, priceGp: 1_200_000, color: '#6b6b4f', image: `${WIKI}/Bandos_helmet.png` },
    { slot: 'head', slug: 'rune-full-helm', name: 'Rune full helm', style: 'melee', twoHanded: false, priceGp: 25_000, color: '#3f6f8f', image: `${WIKI}/Rune_full_helm.png` },
    { slot: 'head', slug: 'armadyl-helmet', name: 'Armadyl helmet', style: 'ranged', twoHanded: false, priceGp: 1_100_000, color: '#e6e0c8', image: `${WIKI}/Armadyl_helmet.png` },
    { slot: 'head', slug: 'black-dragonhide-coif', name: 'Black dragonhide coif', style: 'ranged', twoHanded: false, priceGp: 8_000, color: '#2b2b2b', image: `${WIKI}/Black_dragonhide_coif.png` },
    { slot: 'head', slug: 'mystic-hat', name: 'Mystic hat', style: 'magic', twoHanded: false, priceGp: 12_000, color: '#3b5bab', image: `${WIKI}/Mystic_hat.png` },
    { slot: 'head', slug: 'infinity-hat', name: 'Infinity hat', style: 'magic', twoHanded: false, priceGp: 300_000, color: '#2f3f8f', image: `${WIKI}/Infinity_hat.png` },

    // Bodies
    { slot: 'body', slug: 'bandos-chestplate', name: 'Bandos chestplate', style: 'melee', twoHanded: false, priceGp: 3_400_000, color: '#6b6b4f', image: `${WIKI}/Bandos_chestplate.png` },
    { slot: 'body', slug: 'rune-platebody', name: 'Rune platebody', style: 'melee', twoHanded: false, priceGp: 40_000, color: '#3f6f8f', image: `${WIKI}/Rune_platebody.png` },
    { slot: 'body', slug: 'armadyl-chestplate', name: 'Armadyl chestplate', style: 'ranged', twoHanded: false, priceGp: 3_000_000, color: '#e6e0c8', image: `${WIKI}/Armadyl_chestplate.png` },
    { slot: 'body', slug: 'black-dragonhide-body', name: 'Black dragonhide body', style: 'ranged', twoHanded: false, priceGp: 12_000, color: '#2b2b2b', image: `${WIKI}/Black_dragonhide_body.png` },
    { slot: 'body', slug: 'mystic-robe-top', name: 'Mystic robe top', style: 'magic', twoHanded: false, priceGp: 30_000, color: '#3b5bab', image: `${WIKI}/Mystic_robe_top.png` },
    { slot: 'body', slug: 'infinity-top', name: 'Infinity top', style: 'magic', twoHanded: false, priceGp: 500_000, color: '#2f3f8f', image: `${WIKI}/Infinity_top.png` },

    // Legs
    { slot: 'legs', slug: 'bandos-tassets', name: 'Bandos tassets', style: 'melee', twoHanded: false, priceGp: 3_100_000, color: '#6b6b4f', image: `${WIKI}/Bandos_tassets.png` },
    { slot: 'legs', slug: 'rune-platelegs', name: 'Rune platelegs', style: 'melee', twoHanded: false, priceGp: 38_000, color: '#3f6f8f', image: `${WIKI}/Rune_platelegs.png` },
    { slot: 'legs', slug: 'armadyl-chainskirt', name: 'Armadyl chainskirt', style: 'ranged', twoHanded: false, priceGp: 2_900_000, color: '#e6e0c8', image: `${WIKI}/Armadyl_chainskirt.png` },
    { slot: 'legs', slug: 'black-dragonhide-chaps', name: 'Black dragonhide chaps', style: 'ranged', twoHanded: false, priceGp: 7_000, color: '#2b2b2b', image: `${WIKI}/Black_dragonhide_chaps.png` },
    { slot: 'legs', slug: 'mystic-robe-bottom', name: 'Mystic robe bottom', style: 'magic', twoHanded: false, priceGp: 20_000, color: '#3b5bab', image: `${WIKI}/Mystic_robe_bottom.png` },
    { slot: 'legs', slug: 'infinity-bottoms', name: 'Infinity bottoms', style: 'magic', twoHanded: false, priceGp: 350_000, color: '#2f3f8f', image: `${WIKI}/Infinity_bottoms.png` },

    // Capes (untradeable ones are priced at what it costs to get them back)
    { slot: 'cape', slug: 'fire-cape', name: 'Fire cape', style: null, twoHanded: false, priceGp: 50_000, color: '#e2611c', image: `${WIKI}/Fire_cape.png` },
    { slot: 'cape', slug: 'tokhaar-kal-ket', name: 'TokHaar-Kal-Ket', style: 'melee', twoHanded: false, priceGp: 100_000, color: '#c0392b', image: `${WIKI}/TokHaar-Kal-Ket.png` },
    { slot: 'cape', slug: 'avas-accumulator', name: "Ava's accumulator", style: 'ranged', twoHanded: false, priceGp: 1_000, color: '#6f7f3a', image: `${WIKI}/Ava%27s_accumulator.png` },
    { slot: 'cape', slug: 'cape-of-legends', name: 'Cape of legends', style: null, twoHanded: false, priceGp: 450, color: '#1f4fa8', image: `${WIKI}/Cape_of_legends.png` },
    { slot: 'cape', slug: 'obsidian-cape', name: 'Obsidian cape', style: null, twoHanded: false, priceGp: 60_000, color: '#3a2a3a', image: `${WIKI}/Obsidian_cape.png` }
]

export default gear
