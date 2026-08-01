import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = resolve(repositoryRoot, ".prettier-baseline.json");
const editorConfigPath = resolve(repositoryRoot, ".editorconfig");
const prettierConfigPath = resolve(repositoryRoot, "prettier.config.mjs");
const prettierIgnorePath = resolve(repositoryRoot, ".prettierignore");
const prettierBin = require.resolve("prettier/bin/prettier.cjs");
const prettierVersion = require("prettier/package.json").version;

const hashBuffers = (...buffers) => {
  const hash = createHash("sha256");
  for (const buffer of buffers) hash.update(buffer);
  return hash.digest("hex");
};

const normalizedText = (file) => Buffer.from(readFileSync(file, "utf8").replace(/\r\n?/gu, "\n"));

const fileHash = (file) => hashBuffers(normalizedText(resolve(repositoryRoot, file)));
const configurationHash = () =>
  hashBuffers(
    Buffer.from(prettierVersion),
    normalizedText(editorConfigPath),
    normalizedText(prettierConfigPath),
    normalizedText(prettierIgnorePath),
  );

/**
 * Runs the repository Prettier check and returns every nonconforming file.
 *
 * @returns Repository-relative paths normalized to forward slashes.
 */
const listNonconformingFiles = () => {
  const result = spawnSync(process.execPath, [prettierBin, "--list-different", "."], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });

  if (result.error) throw result.error;
  if (result.status !== 0 && result.status !== 1) {
    process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  return result.stdout
    .split(/\r?\n/u)
    .map((file) => file.trim())
    .filter(Boolean)
    .map((file) => relative(repositoryRoot, resolve(repositoryRoot, file)).replaceAll("\\", "/"))
    .sort();
};

const nonconformingFiles = listNonconformingFiles();

if (process.argv.includes("--update")) {
  const baseline = {
    prettierVersion,
    configurationHash: configurationHash(),
    files: Object.fromEntries(nonconformingFiles.map((file) => [file, fileHash(file)])),
  };
  writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(`Prettier baseline updated: ${nonconformingFiles.length} legacy files.`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
if (
  baseline.prettierVersion !== prettierVersion ||
  baseline.configurationHash !== configurationHash()
) {
  console.error("Prettier or its configuration changed. Review and regenerate the baseline.");
  process.exit(1);
}

const regressions = nonconformingFiles.filter((file) => baseline.files[file] !== fileHash(file));
if (regressions.length > 0) {
  console.error("Prettier found new or modified nonconforming files:");
  for (const file of regressions) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`Prettier ratchet passed; ${nonconformingFiles.length} unchanged legacy files remain.`);
