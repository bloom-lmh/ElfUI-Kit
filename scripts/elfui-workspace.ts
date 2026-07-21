import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

type ElfuiMacroPlugin = typeof import("@elfui/vite-plugin")["elfuiMacroPlugin"];

interface ElfuiWorkspaceConfig {
  elfuiMacroPlugin: ElfuiMacroPlugin;
  aliases: Record<string, string>;
}

export const loadElfuiWorkspace = async (): Promise<ElfuiWorkspaceConfig> => {
  if (process.env.ELFUI_KIT_LOCAL_FRAMEWORK !== "1") {
    const { elfuiMacroPlugin } = await import("@elfui/vite-plugin");
    return { elfuiMacroPlugin, aliases: {} };
  }

  const frameworkRoot = path.resolve(process.cwd(), "..", "elfui");
  const pluginEntry = path.join(frameworkRoot, "packages", "vite-plugin", "dist", "index.js");
  const compilerDist = path.join(frameworkRoot, "packages", "compiler", "dist");
  const coreDist = path.join(frameworkRoot, "packages", "core", "dist");
  const coreEntry = path.join(coreDist, "index.js");
  const internalEntry = path.join(coreDist, "internal.js");
  const runtimeDist = path.join(frameworkRoot, "packages", "runtime", "dist");
  const reactivityEntry = path.join(frameworkRoot, "packages", "reactivity", "dist", "index.js");
  const sharedEntry = path.join(frameworkRoot, "packages", "shared", "dist", "index.js");

  for (const file of [
    pluginEntry,
    path.join(compilerDist, "index.js"),
    path.join(compilerDist, "compile.js"),
    path.join(compilerDist, "macro-component.js"),
    path.join(compilerDist, "vite.js"),
    coreEntry,
    internalEntry,
    path.join(runtimeDist, "index.js"),
    path.join(runtimeDist, "internal.js"),
    reactivityEntry,
    sharedEntry
  ]) {
    if (!existsSync(file)) {
      throw new Error(`Missing local ElfUI build output: ${file}`);
    }
  }

  const { elfuiMacroPlugin } = await import(pathToFileURL(pluginEntry).href);
  return {
    elfuiMacroPlugin,
    aliases: {
      "@elfui/core/internal": internalEntry,
      "@elfui/core": coreEntry,
      "@elfui/compiler/macro-component": path.join(compilerDist, "macro-component.js"),
      "@elfui/compiler/compile": path.join(compilerDist, "compile.js"),
      "@elfui/compiler/vite": path.join(compilerDist, "vite.js"),
      "@elfui/compiler": path.join(compilerDist, "index.js"),
      "@elfui/runtime/internal": path.join(runtimeDist, "internal.js"),
      "@elfui/runtime": path.join(runtimeDist, "index.js"),
      "@elfui/reactivity": reactivityEntry,
      "@elfui/shared": sharedEntry
    }
  };
};
