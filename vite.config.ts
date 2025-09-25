import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // Proxy all API requests to the backend
      '/api': {
        target: 'https://1ed820349c88.ngrok-free.app',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add ngrok header to bypass browser warning
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
            console.log('🔄 Proxying request to:', proxyReq.getHeader('host') + proxyReq.path);
          });
          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy error:', err);
          });
        },
      },
      // Proxy auth endpoints
      '/auth': {
        target: 'https://1ed820349c88.ngrok-free.app',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add ngrok header to bypass browser warning
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
            console.log('🔄 Proxying auth request to:', proxyReq.getHeader('host') + proxyReq.path);
          });
        },
      },
    },
  },
});
