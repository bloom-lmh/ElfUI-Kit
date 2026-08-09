import { defineConfig } from "vitest/config";
import path from "node:path";

import { loadElfuiWorkspace } from "./scripts/elfui-workspace";

const { aliases, elfuiMacroPlugin } = await loadElfuiWorkspace();
const workspaceRoot = import.meta.dirname;

export default defineConfig({
  plugins: [elfuiMacroPlugin()],
  resolve: {
    alias: {
      "@elfui/website-components": path.join(workspaceRoot, "apps/website/src/components"),
      "@elfui/kit": path.join(workspaceRoot, "packages/kit/src/library.ts"),
      ...aliases,
    },
    dedupe: ["@elfui/core", "@elfui/router"],
  },
  test: {
    environment: "happy-dom",
    define: {
      __DEV__: "true",
    },
  },
});
