import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to the repository name so assets are served from
// https://<username>.github.io/Wk_Config/
export default defineConfig({
  plugins: [react()],
  base: '/Wk_Config/',
})
