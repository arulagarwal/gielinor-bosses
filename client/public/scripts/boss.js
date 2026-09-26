// Detail page: work out which boss was requested from the URL we were served
// at (/bosses/<slug>) and render every field on the record.
import { el, bossImage, formatNumber, formatDate } from '/scripts/dom.js'

const statRow = (label, value) => [
    el('dt', { textContent: label }),
    el('dd', { textContent: value })
]

const renderBoss = async () => {
    const bossContent = document.getElementById('boss-content')
    const slug = window.location.pathname.split('/').filter(Boolean).pop()

    let boss
    try {
        const response = await fetch(`/api/bosses/${encodeURIComponent(slug)}`)

        // The server checks the slug before serving this page, so this branch is a
        // safety net rather than the app's actual 404 mechanism.
        if (response.status === 404) {
            bossContent.appendChild(el('h2', { textContent: 'Boss not found 😞' }))
            return
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        boss = await response.json()
    } catch (error) {
        bossContent.appendChild(el('h2', { textContent: 'Could not reach the server 😞' }))
        return
    }

    document.title = `${boss.name} · Gielinor Bosses`

    const art = el('div', { className: 'detail-art' }, [
        bossImage(boss, 'detail-image'),
        el('span', { className: 'tier-badge', textContent: `${boss.tier} tier` })
    ])
    // Drives the tier accent colour, same as the cards on the home page.
    art.dataset.tier = boss.tier

    const stats = el('dl', { className: 'stat-grid' })
    stats.append(
        ...statRow('Combat level', formatNumber(boss.combatLevel)),
        ...statRow('Life points', formatNumber(boss.lifePoints)),
        ...statRow('Max hit', formatNumber(boss.maxHit)),
        ...statRow('Location', boss.location),
        ...statRow('Requirements', boss.requirements),
        ...statRow('Aggressive', boss.aggressive ? 'Yes' : 'No'),
        ...statRow('Released', formatDate(boss.releaseDate))
    )

    const drops = el('ul', { className: 'drop-list' })
    boss.notableDrops.forEach(drop => drops.appendChild(el('li', { textContent: drop })))

    const details = el('div', { className: 'detail-body' }, [
        el('h2', { textContent: boss.name }),
        el('p', { className: 'detail-description', textContent: boss.description }),
        stats,
        el('h3', { textContent: 'Notable drops' }),
        drops,
        el('p', { className: 'record-id', textContent: `Record #${boss.id} · ${boss.slug}` })
    ])

    bossContent.append(art, details)
}

renderBoss()
