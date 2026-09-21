# WEB103 Project 1 - *Gielinor Bosses*

Submitted by: **Arul Agarwal**

About this web app: **A field guide to the bosses of RuneScape. The home page lists 14 bosses as cards ordered from the first fight most players win to the ones that define endgame PvM, each colour-coded by difficulty tier. Every boss has its own page at a slug URL (`/bosses/vorago`) showing its full record: combat level, life points, max hit, location, requirements, aggression, release date and notable drops. The backend is Node and Express serving static HTML; there is no frontend framework anywhere in the project.**

Time spent: **4** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **The web app uses only HTML, CSS, and JavaScript without a frontend framework**
- [x] **The web app displays a title**
- [x] **The web app displays at least five unique list items, each with at least three displayed attributes (such as title, text, and image)**
- [x] **The user can click on each item in the list to see a detailed view of it, including all database fields**
  - [x] **Each detail view should be a unique endpoint, such as as `localhost:3000/bosses/crystalguardian` and `localhost:3000/mantislords`**
  - [x] *Note: When showing this feature in the video walkthrough, please show the unique URL for each detailed view. We will not be able to give points if we cannot see the implementation* 
- [x] **The web app serves an appropriate 404 page when no matching route is defined**
- [x] **The web app is styled using Picocss**

The following **optional** features are implemented:

- [x] The web app displays items in a unique format, such as cards rather than lists or animated list items
  - Responsive card grid with a hover lift, and a colour-coded difficulty tier badge (Low / Mid / High / Elite) on both the cards and the detail pages.

The following **additional** features are implemented:

- [x] **Real HTTP 404 status codes, not a client-side redirect.** Unknown routes *and* well-formed URLs with a slug that doesn't exist (`/bosses/not-a-boss`) both return an actual `404` from Express, rather than a `200` with a redirect.
- [x] **Single-port setup.** Express serves the built client at the root, so the whole app runs on `localhost:3001` instead of needing a separate dev server.
- [x] **Slug-based URLs.** Detail pages use readable slugs (`/bosses/kerapac-the-bound`) stored on each record, rather than numeric ids.
- [x] **Responsive layout** down to mobile widths, and a dark theme via Pico's `data-theme`.
- [x] **Graceful image fallback** — hotlinked artwork lazy-loads and degrades to a placeholder if the remote file ever moves.

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  Add GIF tool here
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Running the app

```bash
npm run install:all   # installs client and server dependencies
npm start             # builds the client, then starts Express on :3001
```

Then open http://localhost:3001.

`npm start` builds `client/` into `server/public/` (which is gitignored, since it is generated) and then
starts the Express server, so a single command covers a fresh clone.

For iterating on the frontend, `npm run dev` starts Vite on `:5173` with `/bosses` proxied to Express, so
hot reload works while the API and detail pages still come from the real server. The walkthrough below was
recorded against `:3001` so the URLs are the ones the app actually serves in production.

## Architecture

```
gielinor-bosses/
├─ client/                    # vanilla frontend, built by Vite
│  ├─ index.html              # home page shell
│  ├─ public/
│  │  ├─ boss.html            # detail page shell
│  │  ├─ 404.html
│  │  ├─ style.css            # layered on top of Pico
│  │  └─ scripts/
│  │     ├─ dom.js            # shared element helper
│  │     ├─ header.js         # header + footer on every page
│  │     ├─ bosses.js         # home page card grid
│  │     └─ boss.js           # detail page hydration
│  └─ vite.config.js
└─ server/
   ├─ data/bosses.js          # the 14 boss records
   ├─ routes/bosses.js        # /bosses and /bosses/:slug
   └─ server.js               # static files, routes, 404
```

Requests flow like this:

| Route | Response |
|---|---|
| `GET /` | `200` · home page |
| `GET /bosses` | `200` · all 14 records as JSON |
| `GET /bosses/:slug` | `200` · detail page, if the slug exists |
| `GET /bosses/:slug` | `404` · 404 page, if it doesn't |
| anything else | `404` · 404 page |

The `/bosses/:slug` handler looks the slug up in the data and calls a bare `next()` when it misses, so the
request falls through to the app-level 404 middleware. That keeps the 404 response defined in exactly one
place in the whole app.

## Notes

A few things that were more interesting than expected:

**The course lab's code doesn't run on a current Node/npm install.** `npm install express` now resolves to
Express 5, whose new path-to-regexp throws a `TypeError` at *registration* time on the classic
`app.get('*', ...)` catch-all — so the server won't even boot. This project pins `express@^4.22.3` to match
the rest of the course, and uses `app.use((req, res) => ...)` for the catch-all, which is valid on both 4
and 5. Similarly, `create-vite`'s vanilla template has moved everything into `src/`, so the lab's
"delete `counter.js`, `main.js`, `public/vite.svg`" instructions no longer match what gets scaffolded.

**Relative asset paths silently break the detail page.** Because `boss.html` is served at the URL
`/bosses/vorago`, a relative `href="style.css"` resolves to `/bosses/style.css` and 404s — the page loads
completely unstyled while the home page looks fine. Every path in the HTML has to be root-absolute.

**A CSS specificity bug cost more time than any of the JavaScript.** The 404 page's big numeral rendered
grey instead of red because `.not-found p` (0-1-1) outranks `.error-code` (0-1-0). Fixed with
`.not-found p:not(.error-code)`.

**Shaping the data for Unit 2.** Every record is flat and scalar apart from `notableDrops`, and `slug` is a
stored field rather than one derived from `name` — so it stays a stable URL and can become an indexed
`UNIQUE` column when this moves to PostgreSQL. `notableDrops` is the only field that won't map 1:1; it
becomes a `TEXT[]` or a join table.

## Credits

Boss artwork and statistics are © Jagex, sourced from the [RuneScape Wiki](https://runescape.wiki) and used
under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/). Images are referenced from the
wiki rather than redistributed in this repository.

## License

Copyright 2025 Arul Agarwal

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
