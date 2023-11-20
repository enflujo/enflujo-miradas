import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/enflujo-miradas/',
  server: {
    port: 3000,
  },
  publicDir: 'estaticos',
  build: {
    outDir: 'publico',
    assetsDir: 'estaticos',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        raton: resolve(__dirname, 'raton/index.html'),
        linterna: resolve(__dirname, 'linterna/index.html'),
      },
    },
  },
});
