import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const packageRoot = join(repositoryRoot, "packages", "kit");
const outputRoot = join(repositoryRoot, "output");

const runPnpm = (args, options = {}) => {
  const npmExecPath = process.env.npm_execpath;
  if (npmExecPath) {
    return execFileSync(process.execPath, [npmExecPath, ...args], options);
  }
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  return execFileSync(command, args, options);
};

await mkdir(outputRoot, { recursive: true });
const temporaryRoot = await mkdtemp(join(outputRoot, "tarball-consumer-"));

try {
  const packOutput = runPnpm(["pack", "--pack-destination", temporaryRoot, "--json"], {
    cwd: packageRoot,
    encoding: "utf8",
  });
  const packed = JSON.parse(packOutput);
  const tarballPath = packed.filename;
  if (!tarballPath) throw new Error("pnpm pack did not report a tarball filename");

  const consumerRoot = join(temporaryRoot, "consumer");
  const deployPath = relative(repositoryRoot, consumerRoot).replaceAll("\\", "/");
  runPnpm(
    [
      "--offline",
      "--ignore-scripts",
      "--filter",
      "@elfui/kit",
      "deploy",
      "--prod",
      "--legacy",
      deployPath,
    ],
    {
      cwd: repositoryRoot,
      stdio: "inherit",
    },
  );

  const extractedRoot = join(temporaryRoot, "extracted");
  const packageInstallRoot = join(consumerRoot, "node_modules", "@elfui");
  await mkdir(extractedRoot, { recursive: true });
  await mkdir(packageInstallRoot, { recursive: true });
  execFileSync("tar", ["-xzf", tarballPath, "-C", extractedRoot], {
    cwd: repositoryRoot,
    stdio: "inherit",
  });
  await rename(join(extractedRoot, "package"), join(packageInstallRoot, "kit"));

  const runtimeConsumer = join(consumerRoot, "consumer.mjs");
  await writeFile(
    runtimeConsumer,
    `const before = {
  document: Object.hasOwn(globalThis, "document"),
  customElements: Object.hasOwn(globalThis, "customElements"),
};
const kit = await import("@elfui/kit");
for (const name of ["Button", "Input", "registerAllComponents"]) {
  if (!(name in kit)) throw new Error(\`Missing root export: \${name}\`);
}
if (typeof kit.registerAllComponents !== "function") {
  throw new Error("registerAllComponents must be a function");
}
if (Object.hasOwn(globalThis, "document") !== before.document) {
  throw new Error("SSR import created a global document");
}
if (Object.hasOwn(globalThis, "customElements") !== before.customElements) {
  throw new Error("SSR import created a global customElements registry");
}
console.log("Tarball root import is SSR-safe and exposes the documented API");
`,
    "utf8",
  );
  execFileSync(process.execPath, [runtimeConsumer], {
    cwd: consumerRoot,
    stdio: "inherit",
  });

  const typeConsumer = join(consumerRoot, "consumer.ts");
  const typeConfig = join(consumerRoot, "tsconfig.json");
  await writeFile(
    typeConsumer,
    `import { Button, Input, registerAllComponents, type ButtonProps } from "@elfui/kit";

const components: CustomElementConstructor[] = [Button, Input];
const props = { color: "primary" } satisfies Partial<ButtonProps>;
void components;
void props;
void registerAllComponents;
`,
    "utf8",
  );
  await writeFile(
    typeConfig,
    `${JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          lib: ["ES2022", "DOM", "ESNext.Disposable"],
          strict: true,
          skipLibCheck: false,
          noEmit: true,
        },
        files: ["consumer.ts"],
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  const typeScriptBin = join(repositoryRoot, "node_modules", "typescript", "bin", "tsc");
  execFileSync(process.execPath, [typeScriptBin, "-p", typeConfig], {
    cwd: consumerRoot,
    stdio: "inherit",
  });

  console.log(`Tarball consumer verified: ${packed.name}@${packed.version}`);
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
