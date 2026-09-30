import { useEffect, useState } from 'react'

// The current time, refreshed every `intervalMs`. Lists call this once and
// pass `now` down, so twenty countdowns share one timer instead of twenty.
export const useNow = (intervalMs = 1000) => {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), intervalMs)
        return () => clearInterval(id)
    }, [intervalMs])

    return now
}
