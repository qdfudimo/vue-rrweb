import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: { // 跨域代理
      '/apis': {
        // target: 'http://' + env.VUE_APP_BASE_API,
        target: 'http://localhost:3000/', // 
        changeOrigin: true,
        logLevel: 'debug',
        rewrite: (path) => path.replace(/^\/apis/, '')
      },
    },
  }

})