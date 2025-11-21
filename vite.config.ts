import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Kropland-logo.svg', 'vite.svg'],
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutos
              },
            },
          },
        ],
      },

      manifest: {
        name: 'Kropland - Gestión Agrícola',
        short_name: 'Kropland',
        description: 'Plataforma profesional de gestión agrícola con soporte offline completo',
        theme_color: '#193C1E',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['productivity', 'business'],
        shortcuts: [
          {
            name: 'Clientes',
            short_name: 'Clientes',
            description: 'Gestiona tus clientes',
            url: '/clientes',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Fincas',
            short_name: 'Fincas',
            description: 'Gestiona tus fincas',
            url: '/fincas',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          },
          {
            name: 'Visitas',
            short_name: 'Visitas',
            description: 'Gestiona visitas',
            url: '/visitas',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }]
          }
        ]
      },

      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'map-vendor': ['leaflet'],
          'calendar-vendor': ['react-big-calendar', 'date-fns'],
        },
      },
    },
  },

  server: {
    port: 3000,
    open: true,
  },

  preview: {
    port: 4173,
  },
});