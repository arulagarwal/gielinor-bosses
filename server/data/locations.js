// Seed data for the locations table, loaded by `npm run reset` (config/reset.js).
// Rows are inserted in this order, so the database assigns ids 1-6 top to bottom.
// The slugs double as the URLs (/locations/wilderness) and as the keys the map
// component uses to place each hotspot, so change them in both places at once.

const locationData = [
    {
        "slug": "wilderness",
        "name": "The Wilderness",
        "region": "Northern Gielinor",
        "description": "Lawless, blighted land north of Varrock where other players can attack you. Masses here travel light and move fast: the King Black Dragon, the Corporeal Beast and Vindicta all wait beyond the ditch."
    },
    {
        "slug": "god-wars-dungeon",
        "name": "God Wars Dungeon",
        "region": "Trollheim",
        "description": "A frozen cavern beneath Trollheim where the armies of four gods never stopped fighting. Clans run a rotation of the four generals, and Nex waits in the Ancient Prison behind them."
    },
    {
        "slug": "asgarnia",
        "name": "Asgarnia",
        "region": "Falador and the White Knights' lands",
        "description": "The white-walled kingdom of Falador. The Queen Black Dragon sleeps in the Grotworm Lair beneath the city, and the Borehole to the north is where Vorago teams gather each week."
    },
    {
        "slug": "kharidian-desert",
        "name": "Kharidian Desert",
        "region": "South of Al Kharid",
        "description": "Scorching sands beyond the Shantay Pass. Bring waterskins and a desert amulet: the Kalphite Hive runs deep, and its queen does not die easily."
    },
    {
        "slug": "morytania",
        "name": "Morytania",
        "region": "East of the River Salve",
        "description": "A dark, vampyre-ruled swamp kingdom across the Salve. Beneath the Haunted Woods, Araxxor and her brood rotate paths daily, so groups plan around which three are open."
    },
    {
        "slug": "misthalin",
        "name": "Misthalin",
        "region": "Varrock and Lumbridge",
        "description": "The quiet heartland where most adventurers start out. There is no boss worth massing here yet, so it makes a good place to meet up before heading north."
    }
]

export default locationData
