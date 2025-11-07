import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: true, // Allow external connections
    port: 8080,
    strictPort: false,
    hmr: {
      clientPort: 8080,
    },
    watch: {
      usePolling: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
