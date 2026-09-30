import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'

// Imported rather than linked, so Vite bundles, minifies and fingerprints them.
import '@picocss/pico/css/pico.min.css'
import './styles/global.css'
import './styles/map.css'
import './styles/events.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
)
