import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ESM config file for Vite so ESM-only plugins load correctly on CI
export default defineConfig({
  plugins: [react()],
  base: '/Wk_Config/',
})
