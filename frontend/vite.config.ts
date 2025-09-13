// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {}, // prevent errors if libraries check process.env
  },
  server: {
    port: 5173,
    open: true,
  },
});
