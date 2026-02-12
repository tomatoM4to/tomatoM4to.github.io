import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import devtoolsJson from 'vite-plugin-devtools-json'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
// import { visualizer } from "rollup-plugin-visualizer"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    devtoolsJson(),
    tailwindcss()
    // visualizer()
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@server': path.resolve(__dirname, './server'),
      '@shared': path.resolve(__dirname, './shared')
    }
  }
})
