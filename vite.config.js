import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// primeicons müssen halb-automatisch hinzugefügt werden zu sw.js: 
// primeicons.c9eaf535.eot primeicons.788dba0a.ttf primeicons.feb68bf6.woff primeicons.2ab98f70.svg
// file:///C:/Users/Thomas%20Klein/Dropbox/Public/Webapps/vite-sw-inject/index.html
// oder
// https://thomaskl.uber.space/Webapps/vite-sw-inject/
// 
export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf,eot,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 3000000,
      },
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'icon-transparent.png','Logo.png', 'additionalJSCode.js','icon-transparent.png','assets/primeicons.c9eaf535.eot','assets/*.ttf'],  
      //assetsInclude: ["assets/*.ttf"],
      manifest: {
        name: 'JavaApp',
        description: 'Erstelle deine eigenen Apps mit Java',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icon512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ],
  base: "./"
})
