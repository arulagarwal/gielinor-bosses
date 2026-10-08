# WEB103 Project 4 - *Gielinor Boss Masses: Loadout Builder*

Submitted by: **Arul Agarwal**

About this web app: **A gear loadout builder for RuneScape players getting ready for a group boss kill ("mass"). You pick a weapon, off-hand, helmet, body, legs and cape from real RuneScape items. As you click, an adventurer on screen changes to match, an in-game-style equipment grid fills with each item's icon, and the total cost in coins updates. Saved loadouts can be viewed, edited and deleted from the list or from their own page. Gear that can't be worn together is blocked: a two-handed weapon leaves no hand free for an off-hand, and an off-hand has to match the weapon's combat style. The frontend is React; the backend is an Express REST API over the same PostgreSQL database on Render as Projects 1–3, with new `gear_options` and `loadouts` tables.**

Time spent: **2** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses React to display data from the API.**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table.**
  - [x]  **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x]  **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**
- [x] **Users can view **multiple** features of the `CustomItem` (e.g. car) they can customize, (e.g. wheels, exterior, etc.)**
  - Six slots: weapon, off-hand, head, body, legs and cape.
- [x] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
  - 40 items across the six slots (5–10 each), covering melee, ranged and magic.
- [x] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
  - The equipment grid shows the chosen item's RuneScape Wiki icon in its slot.
- [x] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected *OR* The app displays the total price of all features.**
  - Both. The builder's total updates on every click, and each saved loadout shows its total, which the database calculates.
- [x] **The visual interface changes in response to at least one customizable feature.**
  - All six do. The SVG adventurer takes each piece of armour's colour and wears the cape. Its weapon changes shape with the weapon's style and size: a sword or godsword, a crossbow or shortbow, a wand or staff. Its off-hand becomes a shield, an off-hand crossbow or an orb.
- [x] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
- [x] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
  - Example: equip a Dragon defender, then pick the Armadyl godsword. The form immediately says *"Armadyl godsword is two-handed, so you can't also hold Dragon defender."* and offers a **Remove off-hand** button. **Save** is blocked with the same message. The API enforces the same rules on its own and answers `422` with the message, without writing a row, so a request that skips the form can't save one either.
- [x] **Users can view a list of all submitted `CustomItem`s.**
- [x] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can update or delete `CustomItem`s that have been created from the detail page.**

The following **optional** features are implemented:

- [x] Selecting particular options prevents incompatible options from being selected even before form submission
  - With a two-handed weapon chosen, every off-hand is disabled and labelled *"Your weapon is two-handed"*. With a one-handed weapon, off-hands of a different style are disabled and labelled, e.g. *"Needs a magic weapon"*. The weapon itself is never locked, so you can always change your mind. If the new weapon clashes with the off-hand you already chose, you get the warning above instead.

The following **additional** features are implemented:

- [x] **One set of rules, checked in two places.** `client/src/utilities/validation.js` and `server/utils/loadoutRules.js` apply the same checks: required slots, each item in its own slot, two-handed weapons, and off-hand style. The rules read item data from the database (`slot`, `style`, `two_handed`), so adding gear never means changing code. `npm run reset` runs the seed loadouts through the server's rules too.
- [x] **The price can't drift.** `loadouts` stores only item ids. The total is a `SUM` over the joined `gear_options` rows, worked out on every read, so changing an item's price updates every loadout that uses it.
- [x] **Coins look like the game.** Totals are shortened the way RuneScape does it (`45K gp`, `9.6M gp`) and coloured by stack size: yellow, then white at 100K, then green at 10M. Hovering shows the exact amount.
- [x] **Feedback after every change.** Saving, updating and deleting each show a confirmation ("Saved "Bandos tank"."), and a screen-reader live region announces it. When a save fails, focus moves to the error box. Deleting asks for confirmation first, and the card disappears without reloading the list.
- [x] **Loading, empty and error states on every page,** carried over from Project 3: skeleton placeholders while loading, a friendly empty list with a link to the builder, and the server's own error message with a **Try again** button.
- [x] **Real 404s.** `/loadouts/:id` and `/loadouts/:id/edit` answer with a `404` status when the id isn't in the database, and React shows the not-found page. The API answers `400` for a non-integer id, `404` for a missing one, `422` for a broken rule and `400` for a malformed JSON body. Every error comes back as JSON.
- [x] **Works on a phone.** On narrow screens, the preview stays pinned at the top while you scroll through the options.

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='docs/walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

▶️ **[Watch the full-resolution walkthrough on YouTube](https://youtu.be/aXmUpNlZWbk)**

The walkthrough shows, in order:
- the `gielinor-bosses` database on the Render dashboard with its status **Available**
- psql connected to it, running `\dt`, `SELECT * FROM gear_options;` (40 rows) and `SELECT * FROM loadouts;` (4 rows)
- the builder: clicking through weapons, helmets, bodies, legs and capes while the adventurer, the equipment icons and the total cost change
- a two-handed weapon (Noxious scythe) disabling every off-hand, then a one-handed melee weapon disabling only the ranged and magic off-hands
- saving a loadout, editing it from its detail page ("Updated"), then deleting it from its detail page
- `SELECT id, name FROM loadouts;` in psql matching the list
- *(second clip)* Abyssal whip + Dragon defender, then switching to the Armadyl godsword: the "two-handed, so you can't also hold Dragon defender" error (held for a few seconds so it can be read), and **Save** blocked
- removing the off-hand and saving "Spec tank"
- **Edit** on the Bandos tank card in the list, changing its cape, and saving
- **Delete** on the Spec tank card in the list

GIF created with macOS Screen Recording + ffmpeg (two clips joined and played back at 1.75× speed; the freeze on the error message was added in editing). The YouTube video is the same footage at normal speed.

## Running the app

```bash
npm run install:all                  # installs client and server dependencies
cp server/.env.example server/.env   # then fill in the five PG* values from Render
npm run reset                        # creates every table and seeds it
npm start                            # builds the client, then starts Express on :3001
```

Then open http://localhost:3001/loadouts/new.

`server/.env` needs the **External** connection details from Render (your database → Connect → External). If a
variable is missing, the server refuses to start and says which one. `.env` is gitignored.

For frontend work, run `npm run dev:server` (Express on `:3001`) and `npm run dev` (Vite on `:5173`, with `/api`
proxied to Express) in two terminals to get hot reload against the real data.

## Architecture

```
gielinor-bosses/
├─ client/src/
│  ├─ App.jsx                     # router: /, /events, /locations/:slug, /loadouts/...
│  ├─ services/                   # GearAPI.js, LoadoutsAPI.js (+ Project 3's), request.js
│  ├─ utilities/
│  │  ├─ calcPrice.js             # totalPrice(), formatGp(), coin colour tiers
│  │  └─ validation.js            # combination rules, disabledReason() for early blocking
│  ├─ components/                 # LoadoutForm, LoadoutPreview (avatar + equipment grid), LoadoutCard, Flash
│  ├─ pages/                      # CreateLoadout, Loadouts, LoadoutDetails, EditLoadout (+ Project 3's)
│  └─ styles/loadouts.css
└─ server/
   ├─ config/reset.js             # npm run reset: rebuilds and seeds every table in one transaction
   ├─ controllers/gear.js, loadouts.js
   ├─ routes/gear.js, loadouts.js # mounted in routes/api.js
   ├─ utils/loadoutRules.js       # the server's copy of the combination rules
   └─ data/gear.js, loadouts.js   # seed data
```

| Route | Response |
|---|---|
| `GET /loadouts`, `/loadouts/new` | `200` · app shell |
| `GET /loadouts/:id`, `/loadouts/:id/edit` | `200` · app shell if the loadout exists, `404` if it doesn't |
| `GET /api/gear` | every gear option, in slot order, cheapest first |
| `GET /api/loadouts` | every loadout, newest first, each slot's item nested plus `totalPrice` |
| `GET /api/loadouts/:id` | one loadout; `400` for a bad id, `404` if missing |
| `POST /api/loadouts` | `{ name, weaponId, offhandId, headId, bodyId, legsId, capeId }` → `201` with the saved loadout, or `422 { error, problems }` |
| `PATCH /api/loadouts/:id` | same body, replaces the loadout → `200`, `422` or `404` |
| `DELETE /api/loadouts/:id` | `200 { id, name }` or `404` |

Project 3's routes (`/`, `/events`, `/locations/:slug` and their `/api` endpoints) are unchanged.

## Database

`gear_options` has one row per item the builder offers:

| Column | Type | Constraints |
|---|---|---|
| `id` | `SERIAL` | primary key |
| `slot` | `VARCHAR(10)` | not null, one of `weapon`, `offhand`, `head`, `body`, `legs`, `cape` |
| `slug` | `VARCHAR(100)` | not null, unique |
| `name` | `VARCHAR(255)` | not null |
| `style` | `VARCHAR(10)` | `melee`, `ranged`, `magic`, or null for any style |
| `two_handed` | `BOOLEAN` | not null, only a weapon can be two-handed |
| `price_gp` | `INTEGER` | not null, ≥ 0 |
| `color` | `VARCHAR(7)` | not null, a `#rrggbb` colour used to draw the avatar |
| `image` | `TEXT` | not null, RuneScape Wiki icon URL |

`loadouts` has one row per saved loadout (the `CustomItem` table):

| Column | Type | Constraints |
|---|---|---|
| `id` | `SERIAL` | primary key |
| `name` | `VARCHAR(50)` | not null, not blank |
| `weapon_id`, `body_id`, `legs_id` | `INTEGER` | not null, references `gear_options`, `ON DELETE RESTRICT` |
| `offhand_id`, `head_id`, `cape_id` | `INTEGER` | nullable, references `gear_options`, `ON DELETE RESTRICT` |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | not null, default `now()` |

`bosses`, `locations` and `events` are the Project 2 and 3 tables, unchanged. Free Render databases allow only one
active instance per workspace, so Project 4's tables live alongside them in the same `gielinor-bosses` database
instead of in a new one.

## Notes

**Express doesn't read request bodies by default.** Projects 1–3 only had `GET` routes, so the server never parsed
JSON. `express.json()` is mounted inside the API router rather than on the app. That way a malformed body reaches
the API's own error handler and gets a JSON `400`, not Express's HTML error page.

**The rules check data, not item names.** Writing "the Armadyl godsword can't go with a defender" for each item
would have meant one rule per pair. Instead, `two_handed` and `style` are columns, and two general rules cover every
combination.

**Disabling the selected option would trap the user.** The early blocking only disables options you *haven't*
chosen. If changing the weapon makes your current off-hand invalid, it stays selected and visibly flagged, with a
one-click fix, instead of disappearing silently.

## Credits

Boss artwork, item icons, statistics and the map of Gielinor are © Jagex, sourced from the
[RuneScape Wiki](https://runescape.wiki) and used under
[CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/). Boss images and item icons are loaded from
the wiki. Gear prices are rough Grand Exchange values. Clans, hosts, events and loadouts are made up.

## License

Copyright 2026 Arul Agarwal

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
