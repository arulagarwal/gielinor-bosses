// Tiny helper so the rest of the code can build DOM trees without a wall of
// createElement/appendChild lines. Still plain DOM - no framework involved.
export const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag)
    Object.assign(node, props)
    children.forEach(child => node.appendChild(child))
    return node
}

// Wiki art is hotlinked, so give every image a lazy load, no referrer, and a
// visible fallback if the remote file ever moves.
export const bossImage = (boss, className) => {
    const image = el('img', {
        src: boss.image,
        alt: boss.name,
        className,
        loading: 'lazy'
    })
    image.setAttribute('referrerpolicy', 'no-referrer')
    image.addEventListener('error', () => {
        image.replaceWith(el('div', { className: `${className} image-missing`, textContent: 'Artwork unavailable' }))
    })
    return image
}

export const formatNumber = (value) => value.toLocaleString('en-US')

export const formatDate = (isoDate) =>
    new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
