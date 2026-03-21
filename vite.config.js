import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/football-data': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/football-data/, '')
      },
      '/api/api-sports': {
        target: 'https://v3.football.api-sports.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/api-sports/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cagliari: resolve(__dirname, 'cagliari.html')
      }
    }
  }
})
