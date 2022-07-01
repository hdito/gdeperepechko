import { defineConfig } from "vite";
import linaria from "@linaria/rollup";
import react from "@vitejs/plugin-react";
import css from "rollup-plugin-css-only";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    linaria({
      sourceMap: process.env.NODE_ENV !== "production",
    }),
    css({
      output: "styles.css",
    }),
  ],
  build: { outDir: "docs" },
  base: "./",
});
