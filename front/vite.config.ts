import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3006,
    proxy: {
      '/api': {
        target: 'http://nestjs:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/socket.io': {
        target: 'http://nestjs:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
