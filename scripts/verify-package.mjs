import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const packageRoot = resolve("packages/kit");
const manifest = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));
const distRoot = join(packageRoot, "lib-dist");
const requiredFiles = ["elfui-kit.js", "library.d.ts", "labs.js", "labs.d.ts", "utilities.css"];

for (const file of requiredFiles) {
  try {
    await readFile(join(distRoot, file));
  } catch {
    throw new Error(`Missing package artifact: lib-dist/${file}`);
  }
}

const sideEffects = manifest.sideEffects ?? [];
if (sideEffects.some((path) => path.includes("/src/") || path.startsWith("./src/"))) {
  throw new Error("package.json sideEffects must reference published lib-dist artifacts only");
}

const publishedFiles = await readdir(distRoot);
if (publishedFiles.length === 0) throw new Error("lib-dist is empty");

console.log(`@elfui/kit package artifacts verified (${publishedFiles.length} top-level files)`);
