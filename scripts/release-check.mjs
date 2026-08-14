import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const repositoryRoot = resolve(import.meta.dirname, "..");

export const RELEASE_STEPS = Object.freeze([
  { label: "Prettier ratchet", script: "format:check" },
  { label: "ESLint", script: "lint" },
  { label: "CSpell", script: "spellcheck" },
  { label: "Kit and Website typecheck", script: "typecheck" },
  { label: "Architecture and contract tests", script: "test:contracts" },
  { label: "Kit tests", script: "test:kit" },
  { label: "Website tests", script: "test:website" },
  { label: "Strict documentation locale audit", script: "docs:locale-audit:strict" },
  { label: "Website production build", script: "build:website" },
  { label: "Library production build", script: "build:lib" },
  { label: "Built package verification", script: "verify:package:built" },
  { label: "Tarball consumer and SSR import", script: "verify:tarball" },
]);

const pnpmInvocation = (script) => {
  const npmExecPath = process.env.npm_execpath;
  if (npmExecPath) return { command: process.execPath, args: [npmExecPath, "run", script] };
  return {
    command: process.platform === "win32" ? "pnpm.cmd" : "pnpm",
    args: ["run", script],
  };
};

export const runReleaseCheck = () => {
  const startedAt = Date.now();

  for (const [index, step] of RELEASE_STEPS.entries()) {
    const prefix = `[release:check ${index + 1}/${RELEASE_STEPS.length}]`;
    console.log(`\n${prefix} ${step.label} (pnpm ${step.script})`);
    const invocation = pnpmInvocation(step.script);
    const result = spawnSync(invocation.command, invocation.args, {
      cwd: repositoryRoot,
      env: { ...process.env, CI: process.env.CI || "1" },
      stdio: "inherit",
      shell: false,
    });

    if (result.error) throw result.error;
    if (result.status !== 0) {
      console.error(`${prefix} failed with exit code ${result.status ?? 1}.`);
      process.exit(result.status ?? 1);
    }
  }

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\nrelease:check passed all ${RELEASE_STEPS.length} steps in ${seconds}s.`);
};

const entryPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (entryPath === import.meta.url) runReleaseCheck();
