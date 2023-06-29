import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react-swc'
import terser from '@rollup/plugin-terser';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5174
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    })
  ],
  build: {
    minify: true,
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        esModule: true,
        dir: 'dist',
        minifyInternalExports: true,
        plugins: [terser()]
      }
    }
  }
})
