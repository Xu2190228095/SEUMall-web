import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 引入 path 模块
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 配置 @ 指向 src 目录
    },
  },
  build: {
    chunkSizeWarningLimit:1500,
    rollupOptions: {
        output:{
            manualChunks(id) {
              if (id.includes('node_modules')) {
                
                  return id.toString().split('node_modules/')[1].split('/')[0].toString();
              }
          }
        }
    }
  }
})
