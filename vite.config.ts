import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Existing video gen proxy
      '/api/ai': {
        target: 'https://omegatech-api.dixonomega.tech',
        changeOrigin: true,
        secure: true,
      },
      // NEW: Pollinations image proxy
      '/api/image': {
        target: 'https://image.pollinations.ai',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/image/, ''),
      },
      // NEW: Pollinations text proxy
      '/api/text': {
        target: 'https://text.pollinations.ai',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/text/, ''),
      },
    },
  },
});