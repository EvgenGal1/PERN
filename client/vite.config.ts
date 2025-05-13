import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // imagemin({
    //   gifsicle: { optimizationLevel: 7 },
    //   optipng: { optimizationLevel: 7 },
    //   mozjpeg: { quality: 85 },
    //   pngquant: { quality: [0.8, 0.9] },
    // }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@Comp": path.resolve(__dirname, "./src/Components"),
    },
  },
  server: {
    port: 3030,
    proxy: {
      "/PERN": {
        target: "http://localhost:5123",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/PERN/, ""), // Уберите /PERN из пути
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
