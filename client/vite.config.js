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
        // In dev the client runs on :5173, so send /bosses calls to Express.
        proxy: {
            '/bosses': { target: 'http://localhost:3001' }
        }
    }
})
