import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    // keep Vite dev server on 3000 so the UI is available at http://localhost:3000
    port: 3000,
    proxy: {
      // Forward /api requests to the backend server at 5100 (server/src/index.ts)
      '/api': {
        target: 'http://localhost:5100',
        changeOrigin: true,
        secure: false
      }
    }
  }
});