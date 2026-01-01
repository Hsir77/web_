import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 配置路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  // 配置开发服务器
  server: {
    port: 3000,              // 修改端口号
    host: '127.0.0.1',         // 允许外部访问
    open: true,              // 自动打开浏览器
  }
})
