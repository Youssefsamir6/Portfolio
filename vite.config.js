import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/',
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
})
