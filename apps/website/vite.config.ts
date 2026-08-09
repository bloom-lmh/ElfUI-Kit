import path from "node:path";

import { defineConfig } from "vite";

import { loadElfuiWorkspace } from "../../scripts/elfui-workspace";

const { aliases, elfuiMacroPlugin } = await loadElfuiWorkspace();
const workspaceRoot = path.resolve(import.meta.dirname, "../..");

export default defineConfig(({ command }) => ({
  plugins: [elfuiMacroPlugin()],
  define: {
    __DEV__: command === "serve" ? "true" : "false",
  },
  server: { host: "127.0.0.1", port: 5174, open: true },
  build: { target: "es2022" },
  resolve: {
    alias: {
      "@elfui/website-styles": path.join(workspaceRoot, "apps/website/src/styles"),
      "@elfui/website-components": path.join(workspaceRoot, "apps/website/src/components"),
      "@elfui/kit": path.join(workspaceRoot, "packages/kit/src/library.ts"),
      ...aliases,
    },
    dedupe: ["@elfui/core", "@elfui/router"],
  },
}));
