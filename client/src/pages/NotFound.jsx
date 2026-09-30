import { Link } from 'react-router'
import { usePageTitle } from '../hooks/usePageTitle.js'

const NotFound = ({ message = "That page doesn't exist, or it wandered into the Wilderness and didn't come back." }) => {
    usePageTitle('Page not found')

    return (
        <section className="not-found">
            <p className="error-code" aria-hidden="true">404</p>
            <h1>Nothing here</h1>
            <p>{message}</p>
            <Link to="/" role="button">Back to the map</Link>
        </section>
    )
}

export default NotFound
