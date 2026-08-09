import { defineConfig } from "vite";

import { loadElfuiWorkspace } from "../../scripts/elfui-workspace";

const { aliases, elfuiMacroPlugin } = await loadElfuiWorkspace();
const externalPackages = [
  "@elfui/",
  "@mdi/js",
  "dompurify",
  "markdown-it",
  "markdown-it-container",
  "markdown-it-footnote",
  "markdown-it-task-lists",
  "prettier",
  "shiki",
];

const isExternal = (id: string): boolean =>
  externalPackages.some((packageName) =>
    packageName.endsWith("/")
      ? id.startsWith(packageName)
      : id === packageName || id.startsWith(`${packageName}/`),
  );

export default defineConfig({
  publicDir: false,
  plugins: [elfuiMacroPlugin()],
  define: {
    __DEV__: "false",
  },
  resolve: {
    alias: aliases,
    dedupe: ["@elfui/core"],
  },
  build: {
    target: "es2022",
    outDir: "lib-dist",
    sourcemap: true,
    lib: {
      entry: {
        "elfui-kit": "src/library.ts",
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
  },
});
