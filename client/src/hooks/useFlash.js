import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

// A one-time message handed to the next page through router state, e.g.
// navigate('/loadouts/7', { state: { flash: 'Saved "Bandos tank".' } }).
// It's read once and then cleared from history, so Back or a reload doesn't
// show it again.
export const useFlash = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [flash, setFlash] = useState(location.state?.flash ?? null)

    useEffect(() => {
        if (location.state?.flash) {
            setFlash(location.state.flash)
            navigate(location.pathname + location.search, { replace: true, state: null })
        }
    }, [location, navigate])

    return [flash, setFlash]
}
