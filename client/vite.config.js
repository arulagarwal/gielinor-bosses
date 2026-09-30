import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        // Build straight into the directory Express serves.
        outDir: '../server/public',
        emptyOutDir: true
    },
    server: {
        // In dev the client runs on :5173 and Express on :3001.
        proxy: {
            '/api': { target: 'http://localhost:3001' }
        }
    }
})
