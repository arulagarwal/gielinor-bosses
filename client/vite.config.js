import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        // Build straight into the directory Express serves.
        outDir: '../server/public',
        emptyOutDir: true,
        // Every script lives in public/ and is loaded by absolute path, so
        // there is nothing for Vite to preload - skip the polyfill chunk.
        modulePreload: { polyfill: false }
    },
    server: {
        // In dev the client runs on :5173, so send data calls and the detail
        // pages (which Express only serves for bosses in the database) to Express.
        proxy: {
            '/api': { target: 'http://localhost:3001' },
            '/bosses': { target: 'http://localhost:3001' }
        }
    }
})
