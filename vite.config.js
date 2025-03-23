import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// If you're using ESM, use the following approach to get the directory:
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
