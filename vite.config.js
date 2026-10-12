import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // PENTING: Ubah base path sesuai nama repository GitHub Anda
  // Contoh: base: '/ai-essay-grader/'
  // Untuk development lokal, gunakan base: '/'
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
