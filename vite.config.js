import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // เพื่อให้เข้าถึงจาก IP หรือ host ภายนอกได้
    port: 5173, // หรือพอร์ตที่คุณใช้
    allowedHosts: [
      '432960945f84.ngrok-free.app', // ใส่ ngrok host ของคุณที่นี่
      '.ngrok-free.app' // ใส่ . เพื่อให้ยอมรับ subdomain ทั้งหมดของ ngrok-free.app
    ],
  },
});