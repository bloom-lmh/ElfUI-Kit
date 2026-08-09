import { copyFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const workspaceRoot = resolve(import.meta.dirname, "..");
const packageRoot = resolve(workspaceRoot, process.argv[2] ?? "packages/kit");
const declarationPaths = ["library.d.ts"].map((file) => resolve(packageRoot, "lib-dist", file));

await copyFile(
  resolve(packageRoot, "src/elements.generated.d.ts"),
  resolve(packageRoot, "lib-dist/elements.generated.d.ts"),
);

for (const declarationPath of declarationPaths) {
  const declaration = await readFile(declarationPath, "utf8");
  const source = `/// <reference path="./elements.generated.d.ts" />\n${declaration}`;
  await writeFile(declarationPath, source, "utf8");
}
