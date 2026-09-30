import { useEffect } from 'react'

const SITE = 'Gielinor Boss Masses'

// Sets the tab title for the current page. Screen readers announce it on
// navigation, so it doubles as the "you are here" cue.
export const usePageTitle = (title) => {
    useEffect(() => {
        document.title = title ? `${title} · ${SITE}` : SITE
    }, [title])
}
