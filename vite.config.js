import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        journey: 'btech-journey.html',
        hub: 'src/interactiveHubEntry.tsx'
      },
      output: {
        entryFileNames: 'assets/js/[name].bundle.js',
        chunkFileNames: 'assets/js/[name].chunk.js',
        assetFileNames: 'assets/css/[name].[ext]'
      }
    }
  }
});
