import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    build: {
      target: 'es2015',
      minify: 'terser',
      sourcemap: isProduction ? false : 'inline',
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // Core Vue framework
            'vue-core': ['vue', 'vue-router', 'pinia'],
            
            // Heavy UI libraries
            'charts': ['apexcharts', 'chart.js'],
            'animations': ['gsap'],
            'ui-components': ['swiper', 'flatpickr', '@headlessui/vue'],
            
            // Utils
            'utils': ['axios', 'dayjs', 'lodash-es'],
            
            // Icons (can be heavy)
            'icons': ['@fortawesome/fontawesome-svg-core', '@fortawesome/vue-fontawesome'],
            
            // Form validation
            'forms': ['vee-validate']
          }
        }
      }
    },
    plugins: [
      vue(),
      tailwindcss(),
      visualizer({
        filename: "dist/bundle-analysis.html",
        open: false,
        gzipSize: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios'] // Pre-bundle core deps
    }
  };
});