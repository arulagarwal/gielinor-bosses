import { Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import Locations from './pages/Locations.jsx'
import LocationEvents from './pages/LocationEvents.jsx'
import Events from './pages/Events.jsx'
import Loadouts from './pages/Loadouts.jsx'
import CreateLoadout from './pages/CreateLoadout.jsx'
import LoadoutDetails from './pages/LoadoutDetails.jsx'
import EditLoadout from './pages/EditLoadout.jsx'
import NotFound from './pages/NotFound.jsx'

// Keep these paths in sync with CLIENT_ROUTES and the /loadouts/:id handler
// in server/server.js, which decide whether a deep link gets a 200 or a 404.
const App = () => (
    <Routes>
        <Route element={<Layout />}>
            <Route index element={<Locations />} />
            <Route path="locations/:slug" element={<LocationEvents />} />
            <Route path="events" element={<Events />} />
            <Route path="loadouts" element={<Loadouts />} />
            <Route path="loadouts/new" element={<CreateLoadout />} />
            <Route path="loadouts/:id" element={<LoadoutDetails />} />
            <Route path="loadouts/:id/edit" element={<EditLoadout />} />
            <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
)

export default App
