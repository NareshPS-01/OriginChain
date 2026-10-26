import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // To include specific polyfills, add them here
      include: ['buffer', 'crypto', 'stream', 'util', 'process', 'events'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  define: {
    // Extra safeguards for Beacon SDK, Taquito & readable-stream
    'process.env': {},
    'process.version': JSON.stringify('v18.0.0'),
    'process.browser': true,
    global: 'globalThis',
  },
  server: {
    port: 5174,
    host: true,
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      stream: 'stream-browserify',
    },
  },
});
