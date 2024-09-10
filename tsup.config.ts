import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "dist",
  entry: ["src/index.ts"],
  format: ["esm"],
  splitting: false,
  clean: true,
  dts: true,
  external: [],
  esbuildPlugins: [
  ],
});
