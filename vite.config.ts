import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_TMDB_API_KEY': JSON.stringify(process.env.VITE_TMDB_API_KEY),
    'process.env.VITE_STACK_PROJECT_ID': JSON.stringify(process.env.VITE_STACK_PROJECT_ID),
    'process.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY': JSON.stringify(process.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY),
  },
  build: {
    rollupOptions: {
      external: ['@prisma/client'],
    },
  },
  optimizeDeps: {
    exclude: ['@prisma/client'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
