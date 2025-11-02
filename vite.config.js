// Vite 설정 파일
// - 책임: 개발 서버 설정 및 리액트 플러그인 로드
// - 프록시: 프론트에서 '/api' 경로를 백엔드(3001)로 전달하여 CORS 이슈 없이 개발
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// 프록시 설명
// - changeOrigin: 대상 서버로 요청 시 Origin 헤더를 타겟에 맞춰 변경
// - secure: HTTPS 인증서 검증 비활성(개발용). 운영에서는 HTTPS 및 유효 인증서 권장
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
