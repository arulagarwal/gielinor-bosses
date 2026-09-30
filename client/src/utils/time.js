// Formatting for event times. Everything uses the browser's locale and time
// zone; the API sends UTC ISO strings.

const startFormat = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
})

const relativeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const formatStart = (iso) => startFormat.format(new Date(iso))

export const isPast = (iso, now) => new Date(iso).getTime() < now

// "2d 04h 12m 05s" style, dropping leading units that are zero.
const formatDuration = (ms) => {
    const days = Math.floor(ms / DAY)
    const hours = Math.floor((ms % DAY) / HOUR)
    const minutes = Math.floor((ms % HOUR) / MINUTE)
    const seconds = Math.floor((ms % MINUTE) / SECOND)
    const pad = (n) => String(n).padStart(2, '0')

    if (days > 0) return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
    if (hours > 0) return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`
    return `${minutes}m ${pad(seconds)}s`
}

// Past events get a coarse "3 days ago" instead of a ticking negative clock.
const formatAgo = (ms) => {
    if (ms < HOUR) return relativeFormat.format(-Math.max(1, Math.round(ms / MINUTE)), 'minute')
    if (ms < DAY) return relativeFormat.format(-Math.round(ms / HOUR), 'hour')
    return relativeFormat.format(-Math.round(ms / DAY), 'day')
}

export const formatCountdown = (iso, now) => {
    const diff = new Date(iso).getTime() - now
    return diff >= 0 ? `Starts in ${formatDuration(diff)}` : `Ended ${formatAgo(-diff)}`
}

// "4 masses" / "1 mass"
export const pluralMasses = (count) => `${count} ${count === 1 ? 'mass' : 'masses'}`
