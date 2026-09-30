import { Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import Locations from './pages/Locations.jsx'
import LocationEvents from './pages/LocationEvents.jsx'
import Events from './pages/Events.jsx'
import NotFound from './pages/NotFound.jsx'

// Keep these paths in sync with CLIENT_ROUTES in server/server.js, which uses
// them to decide whether a deep link gets a 200 or a 404 status.
const App = () => (
    <Routes>
        <Route element={<Layout />}>
            <Route index element={<Locations />} />
            <Route path="locations/:slug" element={<LocationEvents />} />
            <Route path="events" element={<Events />} />
            <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
)

export default App
