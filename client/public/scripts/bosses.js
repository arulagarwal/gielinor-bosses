// Home page: fetch the boss collection, filtered by the search form if it was
// used, and render it as a grid of cards.
import { el, bossImage, formatNumber } from '/scripts/dom.js'

// The search form submits as a plain GET, so the current search lives in the
// page URL. Put it back into the form, which also weeds out unknown tiers:
// assigning a value that isn't one of the options leaves nothing selected.
const readSearch = () => {
    const params = new URLSearchParams(window.location.search)
    const { search, tier } = document.querySelector('.boss-search').elements

    search.value = (params.get('search') || '').trim()
    tier.value = params.get('tier') || ''
    if (tier.selectedIndex === -1) tier.value = ''

    return { search: search.value, tier: tier.value }
}

// A native submit always sends every field (/?search=dragon&tier=), so build
// the URL by hand and leave out the empty ones. Without JavaScript the form
// still works, just with the longer URL.
const cleanUpSubmit = () => {
    const form = document.querySelector('.boss-search')

    form.addEventListener('submit', (event) => {
        event.preventDefault()

        const params = new URLSearchParams()
        const search = form.elements.search.value.trim()
        if (search) params.set('search', search)
        if (form.elements.tier.value) params.set('tier', form.elements.tier.value)

        window.location.assign(params.toString() ? `/?${params}` : '/')
    })
}

// "4 bosses match “dragon”", "1 boss matches “dragon” in the Mid tier", "3 bosses in the Elite tier"
const describeSearch = (count, { search, tier }) => {
    const tierText = tier ? ` in the ${tier} tier` : ''

    if (!search) {
        return `${count === 0 ? 'No' : count} ${count === 1 ? 'boss' : 'bosses'}${tierText}.`
    }

    const matches = count === 0 ? 'No bosses match' : `${count} ${count === 1 ? 'boss matches' : 'bosses match'}`
    return `${matches} “${search}”${tierText}.`
}

const renderBosses = async () => {
    const results = document.getElementById('boss-results')
    const filters = readSearch()
    const isFiltered = Boolean(filters.search || filters.tier)

    // Only forward the filters that are actually set.
    const query = new URLSearchParams()
    if (filters.search) query.set('search', filters.search)
    if (filters.tier) query.set('tier', filters.tier)

    let data
    try {
        const response = await fetch(query.toString() ? `/api/bosses?${query}` : '/api/bosses')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        data = await response.json()
    } catch (error) {
        results.appendChild(el('h2', { textContent: 'Could not reach the server 😞' }))
        return
    }

    if (isFiltered) {
        const summary = el('p', { className: 'lede search-summary', textContent: `${describeSearch(data.length, filters)} ` })
        summary.appendChild(el('a', { href: '/', textContent: 'Clear search' }))
        results.appendChild(summary)
    } else if (data.length === 0) {
        results.appendChild(el('h2', { textContent: 'No bosses available 😞' }))
    } else {
        results.appendChild(el('p', {
            className: 'lede',
            textContent: `${data.length} bosses, ordered from the first fight most players win to the one that defines endgame PvM.`
        }))
    }

    if (data.length === 0) return

    const grid = el('div', { className: 'card-grid' })

    data.forEach(boss => {
        const art = el('div', { className: 'card-art' }, [
            bossImage(boss, 'card-image'),
            el('span', { className: 'tier-badge', textContent: boss.tier })
        ])

        const link = el('a', {
            href: `/bosses/${boss.slug}`,
            textContent: 'View boss →',
            className: 'card-link'
        })
        link.setAttribute('role', 'button')

        const body = el('div', { className: 'card-body' }, [
            el('h3', { textContent: boss.name }),
            el('p', { className: 'card-stat', textContent: `Combat level ${formatNumber(boss.combatLevel)}` }),
            el('p', { className: 'card-stat card-location', textContent: boss.location }),
            link
        ])

        const card = el('article', { className: 'card' }, [art, body])
        card.dataset.tier = boss.tier
        grid.appendChild(card)
    })

    results.appendChild(grid)
}

cleanUpSubmit()
renderBosses()

// Going Back to a page kept in the back/forward cache doesn't rerun this
// script, so the form would still show whatever was picked before leaving.
// The results already match the URL; bring the form back in line with it too.
window.addEventListener('pageshow', (event) => {
    if (event.persisted) readSearch()
})
