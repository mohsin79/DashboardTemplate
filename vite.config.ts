import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: { overlay: false }
  }
})
