// Builds the header and footer that every page shares.
import { el } from '/scripts/dom.js'

const buildHeader = () => {
    const header = document.querySelector('header')
    if (!header) return

    const brand = el('a', { href: '/', className: 'brand' }, [
        el('img', { src: '/favicon.svg', alt: '', className: 'brand-mark' }),
        el('div', {}, [
            el('h1', { textContent: 'Gielinor Bosses' }),
            el('p', { className: 'tagline', textContent: 'A field guide to the bosses of RuneScape' })
        ])
    ])

    const home = el('a', { href: '/', textContent: 'Home', className: 'home-link' })
    home.setAttribute('role', 'button')

    header.appendChild(el('div', { className: 'header-container' }, [brand, home]))
}

const buildFooter = () => {
    const footer = document.querySelector('footer')
    if (!footer) return

    const wiki = el('a', { href: 'https://runescape.wiki', textContent: 'RuneScape Wiki', target: '_blank', rel: 'noopener' })
    const license = el('a', { href: 'https://creativecommons.org/licenses/by-nc-sa/3.0/', textContent: 'CC BY-NC-SA 3.0', target: '_blank', rel: 'noopener' })

    const credit = el('p', { className: 'credit' })
    credit.append('Boss artwork and statistics © Jagex, sourced from the ', wiki, ' (', license, ').')

    const course = el('p', { className: 'credit', textContent: 'Built for CodePath WEB103 · Unit 1 Project' })

    footer.append(credit, course)
}

buildHeader()
buildFooter()
