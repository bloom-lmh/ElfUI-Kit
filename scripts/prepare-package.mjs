import { copyFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const declarationPaths = ["library.d.ts", "labs.d.ts"].map((file) => resolve(root, "lib-dist", file));

await copyFile(resolve(root, "src/elements.generated.d.ts"), resolve(root, "lib-dist/elements.generated.d.ts"));

for (const declarationPath of declarationPaths) {
  const declaration = await readFile(declarationPath, "utf8");
  const source = `/// <reference path="./elements.generated.d.ts" />\n${declaration.replace('import "./styles/utilities.scss";\n', "")}`;
  await writeFile(declarationPath, source, "utf8");
}
