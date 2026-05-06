import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['logging_middleware']
  },
  build: {
    commonjsOptions: {
      include: [/logging_middleware/, /node_modules/]
    }
  }
})
