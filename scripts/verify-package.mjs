import { readFile, readdir } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";

import { rollup } from "rollup";

const packageRoot = resolve("packages/kit");
const manifest = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));
const distRoot = join(packageRoot, "lib-dist");
const requiredFiles = [
  "elfui-kit.js",
  "library.d.ts",
  "register-all.js",
  "utilities.js",
  "styles/utilities.scss.js",
  "components/Basic/Button/index.js",
];

for (const file of requiredFiles) {
  try {
    await readFile(join(distRoot, file));
  } catch {
    throw new Error(`Missing package artifact: lib-dist/${file}`);
  }
}

const sideEffects = manifest.sideEffects ?? [];
if (sideEffects !== false) {
  throw new Error("package.json sideEffects must be false for the pure named-export root");
}

if (Object.keys(manifest.exports ?? {}).join(",") !== ".") {
  throw new Error("package.json must expose only the @elfui/kit root entry");
}

const publishedFiles = await readdir(distRoot);
if (publishedFiles.length === 0) throw new Error("lib-dist is empty");

const builtUtilityStyles = await readFile(join(distRoot, "styles/utilities.scss.js"), "utf8");
if (!builtUtilityStyles.includes(".d-flex")) {
  throw new Error("Built utility style module is empty or incomplete");
}

const virtualEntry = "\0elfui-kit-consumer";
const builtPackageId = "virtual:built-elfui-kit";
const builtEntry = join(distRoot, "elfui-kit.js");
const bundle = await rollup({
  input: virtualEntry,
  external(id) {
    if (id === virtualEntry || id === builtPackageId) return false;
    return !id.startsWith(".") && !id.startsWith("\0") && !isAbsolute(id);
  },
  plugins: [
    {
      name: "elfui-built-package-consumer",
      resolveId(id) {
        if (id === virtualEntry) return id;
        if (id === builtPackageId) return builtEntry;
        return null;
      },
      load(id) {
        if (id !== virtualEntry) return null;
        return `import { Button, Input } from ${JSON.stringify(builtPackageId)};\nglobalThis.__ELFUI_COMPONENTS__ = [Button, Input];`;
      },
    },
  ],
  treeshake: { moduleSideEffects: (_id, external) => external },
});

const generated = await bundle.generate({ format: "es", inlineDynamicImports: true });
await bundle.close();
const consumerCode = generated.output
  .filter((output) => output.type === "chunk")
  .map((output) => output.code)
  .join("\n");

for (const marker of ["elf-button", "elf-input"]) {
  if (!consumerCode.includes(marker)) {
    throw new Error(`Tree-shaken consumer bundle is missing ${marker}`);
  }
}

for (const marker of [
  "elf-table",
  "elf-date-picker",
  "elf-ai-loading",
  "elf-heatmap",
  ".d-none{",
]) {
  if (consumerCode.includes(marker)) {
    throw new Error(`Tree-shaken Button/Input consumer unexpectedly includes ${marker}`);
  }
}

console.log(
  `@elfui/kit package artifacts and Button/Input tree-shaking verified (${publishedFiles.length} top-level files)`,
);
