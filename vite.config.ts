import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    vue(),
    
    // PWA
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Crypto Signals',
        short_name: 'CryptoSignals',
        theme_color: '#1a1a1a',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    
    // Auto import components and composables
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/],
      imports: [
        'vue',
        '@vueuse/core'
      ]
    }),
    
    // Auto import APIs
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        {
          'pinia': [
            'defineStore',
            'storeToRefs'
          ]
        }
      ],
      dts: true,
      dirs: [
        './src/composables',
        './src/stores'
      ],
      vueTemplate: true
    })
  ],
  server: {
    host: true,
    port: 5173
  }
})