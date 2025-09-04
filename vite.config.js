// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Buffer, process 등 폴리필
      protocolImports: true,
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  resolve: {
    alias: {
      buffer: 'buffer', // npm buffer 패키지 사용
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})