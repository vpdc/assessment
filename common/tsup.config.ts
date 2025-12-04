import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "!src/**/*.test.ts", "!src/**/*.spec.ts"],
  format: ["cjs", "esm"],
  dts: true,
  outDir: "dist",
  clean: true,
  sourcemap: true,
  splitting: false,
  platform: "node",
});
