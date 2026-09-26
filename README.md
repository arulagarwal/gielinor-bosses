# WEB103 Project 2 - *Gielinor Bosses*

Submitted by: **Arul Agarwal**

About this web app: **A field guide to the bosses of RuneScape, now served from a PostgreSQL database on Render. The home page lists 14 bosses as cards, ordered from the first fight most players win to the ones that define endgame PvM and colour-coded by difficulty tier, with a search bar that filters them by name, location, notable drop or tier. Every boss has its own page at a slug URL (`/bosses/vorago`) showing its full database record. The backend is Node and Express querying Postgres through `pg`; the frontend is plain HTML, CSS and JavaScript with no framework.**

Time spent: **3** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses only HTML, CSS, and JavaScript without a frontend framework**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured database table for the list items**
  - [x] **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x]  **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**


The following **optional** features are implemented:

- [x] The user can search for items by a specific attribute
  - The home page search bar matches a boss's name, location or any one of its notable drops (case-insensitive), and a dropdown filters by difficulty tier. Both run as a single parameterized SQL query on the server.

The following **additional** features are implemented:

- [x] **Every search has its own URL.** The search form is a plain `GET` form, so a search loads `/?search=dragon&tier=Mid`: results can be bookmarked or shared, and the back button steps through previous searches.
- [x] **Search that behaves.** Typing `%` or `_` looks for that literal character instead of acting as a SQL wildcard, and each drop is matched on its own, so a term can't accidentally match across the gap between two drop names.
- [x] **Real 404s, checked against the database.** `/bosses/:slug` only serves the detail page if that slug is in the table; anything else gets an actual `404` status, not a `200` with a "not found" message.
- [x] **A single-boss API.** The detail page fetches only its own record from `/api/bosses/:slug` instead of downloading the whole list.
- [x] **A reset script that's safe to re-run.** `npm run reset` rebuilds the table inside one transaction, so a failed reset leaves the previous table exactly as it was.
- [x] **Constraints in the schema.** Tiers are limited to the four real ones, numbers must be positive, and slugs must be unique and URL-safe, so bad data is rejected by the database itself.
- [x] **Carried over from Unit 1:** the colour-coded card grid, slug URLs, single-port setup, responsive dark theme and image fallback.

## Video Walkthrough

Here's a walkthrough of implemented required features:

[![Video Walkthrough](https://img.youtube.com/vi/5NarRfIXRmg/hqdefault.jpg)](https://youtu.be/5NarRfIXRmg)

▶️ **[Watch the walkthrough on YouTube](https://youtu.be/5NarRfIXRmg)**

The walkthrough shows, in order: the `gielinor-bosses` database on the Render dashboard with its status
**Available**, and psql connected to it showing the output of `SELECT * FROM bosses;` (all 14 rows); then the home
page card grid; a search for "king" that narrows the list to King Black Dragon, and its detail page; the Kalphite
Queen detail page; a search for "Kera" that finds Kerapac, the bound, and its detail page; the General Graardor
detail page; and a hand-typed bad URL, `localhost:3001/bosses/tz-haar`, returning the 404 page. Every page is shown
at its own URL, with the address bar visible throughout the browser section.

Video recorded with macOS Screen Recording and hosted on YouTube

## Running the app

```bash
npm run install:all                  # installs client and server dependencies
cp server/.env.example server/.env   # then fill in the five PG* values from Render
npm run reset                        # creates the bosses table and seeds the 14 rows
npm start                            # builds the client, then starts Express on :3001
```

Then open http://localhost:3001.

`server/.env` needs the **External** connection details from Render (your database → Connect → External). If a
variable is missing, the server refuses to start and says which one. `.env` is gitignored.

`npm start` doesn't touch the database, so the data survives restarts; `npm run reset` is the one command that
rebuilds it from `server/data/bosses.js`.

For iterating on the frontend, `npm run dev` starts Vite on `:5173` with `/api` and `/bosses` proxied to Express,
so hot reload works while the data and detail pages still come from the real server.

## Architecture

```
gielinor-bosses/
├─ client/                    # vanilla frontend, built by Vite
│  ├─ index.html              # home page shell + search form
│  ├─ public/
│  │  ├─ boss.html            # detail page shell
│  │  ├─ 404.html
│  │  ├─ style.css            # layered on top of Pico
│  │  └─ scripts/
│  │     ├─ dom.js            # shared element helper
│  │     ├─ header.js         # header + footer on every page
│  │     ├─ bosses.js         # home page: search + card grid
│  │     └─ boss.js           # detail page hydration
│  └─ vite.config.js
└─ server/
   ├─ config/
   │  ├─ database.js          # loads .env, creates the pg connection pool
   │  └─ reset.js             # npm run reset: rebuilds and seeds the table
   ├─ controllers/bosses.js   # the SQL behind the API
   ├─ data/bosses.js          # seed data for the 14 bosses
   ├─ routes/
   │  ├─ api.js               # /api/bosses, /api/bosses/:slug
   │  └─ bosses.js            # /bosses/:slug detail pages
   ├─ .env.example            # the five PG* variables to fill in
   └─ server.js               # static files, routes, 404
```

Requests flow like this:

| Route | Response |
|---|---|
| `GET /` | `200` · home page (with or without `?search=` / `?tier=`) |
| `GET /bosses/:slug` | `200` · detail page, if the slug is in the database |
| `GET /bosses/:slug` | `404` · 404 page, if it isn't |
| `GET /api/bosses` | `200` · all bosses as JSON, optionally filtered by `?search=` and `?tier=` |
| `GET /api/bosses` | `400` · JSON error, for a tier that doesn't exist |
| `GET /api/bosses/:slug` | `200` · one boss as JSON, or `404` with a JSON error |
| any other `/api/...` | `404` · JSON error |
| anything else | `404` · 404 page |

JSON moved under `/api` in Unit 2 so a single-boss endpoint doesn't collide with the `/bosses/:slug` detail page.
The bare `/bosses` path, which returned JSON in Unit 1, is now a 404.

## Database

One table, `bosses`, with one row per boss:

| Column | Type | Constraints |
|---|---|---|
| `id` | `SERIAL` | primary key |
| `slug` | `VARCHAR(100)` | not null, unique, lowercase words joined by hyphens |
| `name` | `VARCHAR(255)` | not null |
| `tier` | `VARCHAR(10)` | not null, one of `Low`, `Mid`, `High`, `Elite` |
| `combat_level` | `INTEGER` | not null, > 0 |
| `life_points` | `INTEGER` | not null, > 0 |
| `location` | `VARCHAR(255)` | not null |
| `requirements` | `VARCHAR(255)` | not null |
| `aggressive` | `BOOLEAN` | not null |
| `max_hit` | `INTEGER` | not null, ≥ 0 |
| `release_date` | `DATE` | not null |
| `notable_drops` | `TEXT[]` | not null |
| `image` | `TEXT` | not null |
| `description` | `TEXT` | not null |

`notable_drops` is a Postgres array rather than a separate table: it's a short, ordered list of display names
with no attributes of its own, so a join table would add a `JOIN` without adding any information. The `UNIQUE`
constraint on `slug` also gives it the index the detail-page lookup uses.

## Notes

A few things that were more interesting than expected:

**Dates came back as the wrong type.** `pg` turns a `DATE` column into a JavaScript `Date` at local midnight, which
`res.json` serializes as `"2002-09-24T04:00:00.000Z"`, and the frontend's date formatter printed "Invalid Date".
The query now selects `to_char(release_date, 'YYYY-MM-DD')`, so the API sends exactly the string it sent in Unit 1.

**Postgres lowercases unquoted names.** The lab's own `\d gifts` output shows a `pricepoint` column, because
`pricePoint` without quotes is folded to lowercase, and so are the JSON keys `pg` returns. This project uses
conventional snake_case columns and selects them as `combat_level AS "combatLevel"`; the double quotes are what
keep the camelCase, and they meant none of the Unit 1 rendering code had to change.

**The lab's seed script races itself.** It calls `pool.query` inside a `forEach` without awaiting, so the inserts
run concurrently across the pool's connections and the `SERIAL` ids aren't guaranteed to follow the file order.
Here the home page's order *is* the id order, so the reset script inserts one awaited row at a time inside a single
transaction, and ends the pool afterwards so the script actually exits.

**Render shows two hostnames.** The "Hostname" field on the database page is the internal one, which only resolves
inside Render; connecting from a laptop needs the external form ending in `.oregon-postgres.render.com`, otherwise
`pg` fails with `ENOTFOUND`.

**The back button un-did the search form.** After narrowing a search to the Mid tier and pressing Back, the results
correctly showed the earlier search, but the dropdown still said Mid: the browser restores form fields from history
*after* the page's script has filled them in from the URL, so pressing Search again would have quietly re-applied
the old filter. `autocomplete="off"` on the form opts out of that restoration, and a `pageshow` listener covers
browsers that bring the page back from the back/forward cache instead.

**No dotenv.** `npm install dotenv` now pulls in dotenv 18, which reworked the `--require dotenv/config` preload the
lab's scripts rely on. Node 24 can read a `.env` file itself with `process.loadEnvFile`, so the project skips the
dependency and resolves the path from the config file instead of the working directory, which also makes the
lab's `cd config && node ...` script unnecessary.

## Credits

Boss artwork and statistics are © Jagex, sourced from the [RuneScape Wiki](https://runescape.wiki) and used
under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/). Images are referenced from the
wiki rather than redistributed in this repository.

## License

Copyright 2026 Arul Agarwal

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
