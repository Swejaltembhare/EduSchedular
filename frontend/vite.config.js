import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    tailwindcss(), // tailwindcss plugin should be after react
  ],
  server: {
    port: 5173,
    strictPort: false,
    host: true
  },
  build: {
    rollupOptions: {
      external: []
    }
  }
});