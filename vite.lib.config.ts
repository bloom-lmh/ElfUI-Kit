import { defineConfig } from "vite";

import { loadElfuiWorkspace } from "./scripts/elfui-workspace";

const { aliases, elfuiMacroPlugin } = await loadElfuiWorkspace();

export default defineConfig({
  publicDir: false,
  plugins: [elfuiMacroPlugin()],
  define: {
    __DEV__: "false"
  },
  resolve: {
    alias: aliases,
    dedupe: ["@elfui/core"]
  },
  build: {
    target: "es2022",
    outDir: "lib-dist",
    sourcemap: true,
    lib: {
      entry: {
        "elfui-kit": "src/library.ts",
        labs: "src/labs.ts"
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: "utilities"
    },
    rollupOptions: {
      external: (id) => id.startsWith("@elfui/")
    }
  }
});
