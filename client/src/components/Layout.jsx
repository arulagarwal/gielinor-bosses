import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'

// The header, nav and footer every page shares. React Router swaps pages
// without a reload, so focus would otherwise stay on the link that was just
// clicked; moving it to <main> puts keyboard and screen-reader users at the
// start of the new page, like a normal page load would.
const Layout = () => {
    const { pathname } = useLocation()
    const mainRef = useRef(null)
    const firstRender = useRef(true)

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        mainRef.current?.focus()
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <>
            <a className="skip-link" href="#main-content">Skip to content</a>

            <header className="container">
                <div className="header-container">
                    <Link to="/" className="brand">
                        <img src="/favicon.svg" alt="" className="brand-mark" />
                        <div>
                            <p className="site-title">Gielinor Boss Masses</p>
                            <p className="tagline">Find a group boss kill anywhere in Gielinor</p>
                        </div>
                    </Link>

                    <nav aria-label="Main">
                        <ul>
                            <li><NavLink to="/" end>Map</NavLink></li>
                            <li><NavLink to="/events">All events</NavLink></li>
                            <li><NavLink to="/loadouts/new">Build a loadout</NavLink></li>
                            <li><NavLink to="/loadouts" end>Saved loadouts</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main id="main-content" className="container" ref={mainRef} tabIndex={-1}>
                <Outlet />
            </main>

            <footer className="container">
                <p className="credit">
                    Map, boss artwork, gear icons and statistics © Jagex, sourced from the{' '}
                    <a href="https://runescape.wiki" target="_blank" rel="noopener noreferrer">RuneScape Wiki</a>{' '}
                    (<a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 3.0</a>).
                    Gear prices are rough Grand Exchange values.
                    Clans, hosts, events and loadouts are made up.
                </p>
                <p className="credit">Built for CodePath WEB103 · Unit 4 Project</p>
            </footer>
        </>
    )
}

export default Layout
