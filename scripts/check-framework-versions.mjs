import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifests = ["package.json", "packages/kit/package.json", "apps/website/package.json"];
const frameworkPackages = [
  "@elfui/compiler",
  "@elfui/compiler-template",
  "@elfui/core",
  "@elfui/reactivity",
  "@elfui/runtime",
  "@elfui/shared",
  "@elfui/vite-plugin",
];

const readJson = (path) => JSON.parse(readFileSync(resolve(repositoryRoot, path), "utf8"));
const manifestEntries = manifests.flatMap((path) => {
  const manifest = readJson(path);
  return ["dependencies", "devDependencies"].flatMap((section) =>
    Object.entries(manifest[section] ?? {})
      .filter(([name]) => frameworkPackages.includes(name))
      .map(([name, version]) => ({ path, section, name, version })),
  );
});

const canonicalVersion = readJson("package.json").devDependencies?.["@elfui/core"];
const errors = [];

if (!canonicalVersion) {
  errors.push("package.json must declare @elfui/core in devDependencies");
}

for (const entry of manifestEntries) {
  if (entry.version !== canonicalVersion) {
    errors.push(
      `${entry.path} ${entry.section}.${entry.name} is ${entry.version}; expected ${canonicalVersion}`,
    );
  }
}

const lockfile = readFileSync(resolve(repositoryRoot, "pnpm-lock.yaml"), "utf8");
for (const name of frameworkPackages) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = lockfile.matchAll(new RegExp(`'${escapedName}@([^']+)'`, "g"));
  const versions = new Set(Array.from(matches, (match) => match[1].split("(")[0]));

  if (versions.size === 0) {
    errors.push(`pnpm-lock.yaml does not resolve ${name}`);
    continue;
  }

  if (versions.size !== 1 || !versions.has(canonicalVersion)) {
    errors.push(
      `pnpm-lock.yaml resolves ${name} to ${Array.from(versions).join(", ")}; expected only ${canonicalVersion}`,
    );
  }
}

if (errors.length > 0) {
  console.error("ElfUI framework packages must resolve to one exact version:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `ElfUI framework coherence: ${frameworkPackages.length} packages resolve to ${canonicalVersion}.`,
  );
}
