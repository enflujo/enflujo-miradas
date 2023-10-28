import { defineConfig } from 'vite';

export default defineConfig({
  base: '/enflujo-miradas/',
  server: {
    port: 3000,
  },
  publicDir: 'estaticos',
  build: {
    outDir: 'docs',
    assetsDir: 'estaticos',
    sourcemap: true,
  },
});
