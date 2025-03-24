import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5000,  // Vite frontend on port 5000
    proxy: {
      '/api': 'http://localhost:5001',  // Proxy API requests to the backend on port 5001
    },
  },
  plugins: [react()],
});
