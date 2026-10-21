import { defineConfig } from "vite";

// GitHub Pages は main ブランチの docs/ を公開する
export default defineConfig({
  base: "/weekly-games/",
  build: { outDir: "docs", emptyOutDir: true },
});
