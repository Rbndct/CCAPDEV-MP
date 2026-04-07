import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 👇 Detect if running inside Docker
const isDocker = process.env.DOCKER === "true"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: isDocker
          ? 'http://backend:5000'   // Docker
          : 'http://127.0.0.1:5000', // Local
        changeOrigin: true,
      }
    }
  }
})