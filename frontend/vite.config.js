import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [react(), jsconfigPaths(), checker()],

  server: {
    host: true,
    port: 3000
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "src/utils/variables.scss";
          @import "src/utils/mixins.scss";
        `
      }
    }
  }
})
