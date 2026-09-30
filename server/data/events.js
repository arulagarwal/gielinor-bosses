// Seed data for the events table, loaded by `npm run reset` (config/reset.js).
// Each mass names its location and boss by slug; reset.js looks the ids up
// inside the same transaction, so this file never hard-codes a SERIAL id.
//
// Times are relative: startsInHours is added to the hour the reset runs
// (negative means the mass already happened). Re-running `npm run reset`
// therefore always leaves a mix of upcoming and finished events for the
// countdowns, instead of dates that all drift into the past.
// Clans, hosts and worlds are made up for this project.

const eventData = [
    // The Wilderness
    {
        "location": "wilderness",
        "boss": "king-black-dragon",
        "title": "KBD Learner Night",
        "host": "Edgeville Wanderers",
        "world": 12,
        "startsInHours": 5,
        "description": "A slow, well-explained run for players on their first boss kills. Bring an anti-dragon shield and some food; we cover the rest."
    },
    {
        "location": "wilderness",
        "boss": "corporeal-beast",
        "title": "Corp Beast Mass",
        "host": "Dark Crab Collective",
        "world": 86,
        "startsInHours": 29,
        "description": "Open mass with split loot. Spears or halberds only, and let the core team handle the dark energy cores."
    },
    {
        "location": "wilderness",
        "boss": "vindicta",
        "title": "Vindicta & Gorvek Duo Hunt",
        "host": "Heart of Gielinor PvM",
        "world": 44,
        "startsInHours": 76,
        "description": "Pairs are matched on arrival for duo kills at Zaros's Bastion. Aim for 50 kills each before the night is out."
    },
    {
        "location": "wilderness",
        "boss": "king-black-dragon",
        "title": "Friday Dragon Sweep",
        "host": "Edgeville Wanderers",
        "world": 12,
        "startsInHours": -30,
        "description": "The weekly KBD sweep. Last week we got 212 kills and two visages."
    },

    // God Wars Dungeon
    {
        "location": "god-wars-dungeon",
        "boss": "general-graardor",
        "title": "Bandos Rush",
        "host": "Big High War God FC",
        "world": 58,
        "startsInHours": 2,
        "description": "One hour of back-to-back Graardor kills. Come with your 40 kill count ready so we are not waiting at the door."
    },
    {
        "location": "god-wars-dungeon",
        "boss": "commander-zilyana",
        "title": "Sara Split Night",
        "host": "Order of the White Star",
        "world": 31,
        "startsInHours": 21,
        "description": "Zilyana with even loot splits, at a relaxed pace. Returning players are welcome and we will call out the mechanics."
    },
    {
        "location": "god-wars-dungeon",
        "boss": "kreearra",
        "title": "Armadyl Ranged Clinic",
        "host": "Order of the White Star",
        "world": 31,
        "startsInHours": 49,
        "description": "Bring your best magic setup. We rotate the tank every ten kills so everyone gets practice holding Kree'arra."
    },
    {
        "location": "god-wars-dungeon",
        "boss": "kril-tsutsaroth",
        "title": "Zammy Grind",
        "host": "Zamorak's Chosen",
        "world": 66,
        "startsInHours": 98,
        "description": "Long K'ril session aimed at the hilt. Prayer renewals are required, and there are no breaks until the first hilt drops."
    },
    {
        "location": "god-wars-dungeon",
        "boss": "nex",
        "title": "Nex Mass: Ancient Prison",
        "host": "Big High War God FC",
        "world": 58,
        "startsInHours": 146,
        "description": "The big one. Forty players, one Nex. There is a gear check at the door and minions are assigned before the pull."
    },
    {
        "location": "god-wars-dungeon",
        "boss": "nex",
        "title": "Nex Mass (Last Week)",
        "host": "Big High War God FC",
        "world": 58,
        "startsInHours": -120,
        "description": "Last week's Nex mass: 38 players, 61 kills, and a Torva platebody for the host's alt."
    },

    // Asgarnia
    {
        "location": "asgarnia",
        "boss": "queen-black-dragon",
        "title": "QBD Crystal Run",
        "host": "Falador Guard Reserve",
        "world": 20,
        "startsInHours": 8,
        "description": "Short solo-at-once session. Everyone kills their own queen and we compare artefact counts at the end."
    },
    {
        "location": "asgarnia",
        "boss": "vorago",
        "title": "Vorago Weekly Rotation",
        "host": "The Borehole Regulars",
        "world": 80,
        "startsInHours": 26,
        "description": "Seven-person team for this week's rotation. Bomb tanks and the reflector are pre-assigned, so ask to be added to the roster."
    },
    {
        "location": "asgarnia",
        "boss": "vorago",
        "title": "Hard Mode Vorago Practice",
        "host": "The Borehole Regulars",
        "world": 80,
        "startsInHours": -52,
        "description": "Hard mode learning session. We wiped four times and got it on the fifth."
    },

    // Kharidian Desert
    {
        "location": "kharidian-desert",
        "boss": "kalphite-queen",
        "title": "Kalphite Queen Mass",
        "host": "Shantay Pass Society",
        "world": 70,
        "startsInHours": 14,
        "description": "Switch styles when she changes form. Bring two combat styles and a waterskin, and meet at the Shantay Pass."
    },
    {
        "location": "kharidian-desert",
        "boss": "kalphite-queen",
        "title": "Desert Night Raid",
        "host": "Shantay Pass Society",
        "world": 70,
        "startsInHours": 122,
        "description": "Late-night KQ session for the other side of the world. Loot is split evenly and nobody gets left in the hive."
    },

    // Morytania
    {
        "location": "morytania",
        "boss": "araxxor",
        "title": "Araxxor Path Night",
        "host": "Haunted Woods Hunters",
        "world": 39,
        "startsInHours": 40,
        "description": "Whichever three paths are open tonight, we clear them. Bring a spider-slayer mindset and plenty of anti-poison."
    },
    {
        "location": "morytania",
        "boss": "araxxor",
        "title": "Araxxi Enrage Push",
        "host": "Haunted Woods Hunters",
        "world": 39,
        "startsInHours": -8,
        "description": "Pushing enrage past 1,000% as a group. Only the brave, and only with a full inventory."
    }
]

export default eventData
