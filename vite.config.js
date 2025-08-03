import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.', // <-- wichtig!
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})

