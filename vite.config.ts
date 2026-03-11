import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // '/' for Render; set to '/our-story/' if deploying to GitHub Pages subdirectory
  base: process.env.GITHUB_PAGES ? '/our-story/' : '/',
})
