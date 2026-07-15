import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio_robot/',
  build: {
    rollupOptions: {
      output: {
        // Split stable vendors into their own cacheable chunks.
        // Spline packages are NOT listed: React.lazy in SplineRobot already
        // moves them off the critical path into an async chunk.
        manualChunks: {
          three: ['three'],
          r3f: ['react', 'react-dom', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
