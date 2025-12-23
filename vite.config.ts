import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import devtoolsJson from 'vite-plugin-devtools-json'
import path from 'path'
// import { visualizer } from "rollup-plugin-visualizer"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    devtoolsJson(),
    // visualizer()
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@server': path.resolve(__dirname, './server')
    }
  }
})
