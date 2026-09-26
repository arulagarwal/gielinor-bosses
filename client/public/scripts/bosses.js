// Home page: fetch the boss collection and render it as a grid of cards.
import { el, bossImage, formatNumber } from '/scripts/dom.js'

const renderBosses = async () => {
    const mainContent = document.getElementById('main-content')

    let data
    try {
        const response = await fetch('/api/bosses')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        data = await response.json()
    } catch (error) {
        mainContent.appendChild(el('h2', { textContent: 'Could not reach the server 😞' }))
        return
    }

    if (!data || data.length === 0) {
        mainContent.appendChild(el('h2', { textContent: 'No bosses available 😞' }))
        return
    }

    mainContent.appendChild(el('p', {
        className: 'lede',
        textContent: `${data.length} bosses, ordered from the first fight most players win to the one that defines endgame PvM.`
    }))

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

    mainContent.appendChild(grid)
}

renderBosses()
