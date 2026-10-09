import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `base` must match the GitHub Pages project path:
// https://<user>.github.io/dijkstra-visualizer/
export default defineConfig({
  base: '/dijkstra-visualizer/',
  plugins: [react()],
})
