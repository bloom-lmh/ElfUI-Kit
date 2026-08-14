import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { cpus, platform, release, totalmem } from "node:os";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

import prettier from "prettier";
import { rollup } from "rollup";
import ts from "typescript";

const repositoryRoot = resolve(import.meta.dirname, "..");
const kitSourceRoot = join(repositoryRoot, "packages", "kit", "src");
const websiteSourceRoot = join(repositoryRoot, "apps", "website", "src");
const scriptsRoot = join(repositoryRoot, "scripts");
const kitDistRoot = join(repositoryRoot, "packages", "kit", "lib-dist");
const websiteDistRoot = join(repositoryRoot, "apps", "website", "dist");
const baselineRoot = join(repositoryRoot, "docs", "baselines");
const performancePath = join(baselineRoot, "current-critical-pages.json");
const jsonOutputPath = join(baselineRoot, "current-repository-baseline.json");
const markdownOutputPath = join(baselineRoot, "current-repository-baseline.md");

const ignoredDirectories = new Set([
  ".git",
  ".pnpm-store",
  "coverage",
  "dist",
  "lib-dist",
  "node_modules",
  "output",
]);

const toRepositoryPath = (path) => relative(repositoryRoot, path).replaceAll("\\", "/");

const collectFiles = (directory) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : collectFiles(path);
    }
    return [path];
  });
};

const readText = (path) => readFileSync(path, "utf8");
const readJson = (path) => JSON.parse(readText(path));
const isTypeScript = (path) => [".ts", ".tsx", ".mts", ".cts"].includes(extname(path));
const isTestSource = (path) => {
  const normalized = path.replaceAll("\\", "/");
  const file = basename(normalized);
  return (
    normalized.includes("/__tests__/") ||
    /\.(?:test|spec)\./.test(file) ||
    /\.playwright\./.test(file) ||
    /\.(?:test|spec)-component\./.test(file)
  );
};
const countLines = (source) => (source.length === 0 ? 0 : source.split(/\r?\n/).length);
const countMatches = (source, expression) => source.match(expression)?.length ?? 0;

const commandOutput = (command, args) =>
  execFileSync(command, args, { cwd: repositoryRoot, encoding: "utf8" }).trim();

const collectArea = (root) => {
  const files = collectFiles(root).filter(isTypeScript);
  const production = files.filter((path) => !isTestSource(path));
  const tests = files.filter(isTestSource);
  return {
    files: files.length,
    productionFiles: production.length,
    testFiles: tests.length,
    productionLines: production.reduce((sum, path) => sum + countLines(readText(path)), 0),
    testLines: tests.reduce((sum, path) => sum + countLines(readText(path)), 0),
  };
};

const allTypeScriptFiles = [
  ...collectFiles(kitSourceRoot),
  ...collectFiles(websiteSourceRoot),
  ...collectFiles(scriptsRoot),
].filter(isTypeScript);
const allTestFiles = allTypeScriptFiles.filter(isTestSource);
const testSource = allTestFiles.map(readText).join("\n");
const componentSources = collectFiles(join(kitSourceRoot, "components"))
  .filter(isTypeScript)
  .filter((path) => !isTestSource(path));
const countDefineHtmlCalls = (path) => {
  const sourceFile = ts.createSourceFile(path, readText(path), ts.ScriptTarget.Latest, true);
  let calls = 0;
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "defineHtml"
    ) {
      calls += 1;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return calls;
};
const macroComponentEntries = componentSources
  .map((path) => ({ path, definitions: countDefineHtmlCalls(path) }))
  .filter((entry) => entry.definitions > 0);
const macroComponentFiles = macroComponentEntries.map((entry) => entry.path);

const sourceInventory = {
  areas: {
    kit: collectArea(kitSourceRoot),
    website: collectArea(websiteSourceRoot),
    scripts: collectArea(scriptsRoot),
  },
  macroComponents: {
    definitions: macroComponentEntries.reduce((sum, entry) => sum + entry.definitions, 0),
    files: macroComponentFiles.length,
    sourceFiles: macroComponentFiles.map(toRepositoryPath).sort(),
  },
  tests: {
    files: allTestFiles.length,
    declarations: countMatches(testSource, /\b(?:it|test)\s*\(/g),
    skippedAnnotations: countMatches(testSource, /\b(?:describe|it|test)\.skip\s*\(/g),
    todoAnnotations: countMatches(testSource, /\b(?:it|test)\.todo\s*\(/g),
  },
};

const workspaceManifest = readJson(join(repositoryRoot, "package.json"));
const kitManifest = readJson(join(repositoryRoot, "packages", "kit", "package.json"));
const libraryPath = join(kitSourceRoot, "library.ts");
const librarySource = readText(libraryPath);
const tsConfigPath = join(repositoryRoot, "packages", "kit", "tsconfig.lib.json");
const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
if (tsConfig.error) {
  throw new Error(`Unable to read ${toRepositoryPath(tsConfigPath)}`);
}
const parsedTsConfig = ts.parseJsonConfigFileContent(
  tsConfig.config,
  ts.sys,
  dirname(tsConfigPath),
  undefined,
  tsConfigPath,
);
const program = ts.createProgram({
  rootNames: parsedTsConfig.fileNames,
  options: parsedTsConfig.options,
});
const checker = program.getTypeChecker();
const libraryFile = program.getSourceFile(libraryPath);
const librarySymbol = libraryFile ? checker.getSymbolAtLocation(libraryFile) : undefined;
const publicSymbols = librarySymbol
  ? checker
      .getExportsOfModule(librarySymbol)
      .map((symbol) => symbol.getName())
      .sort()
  : [];
const packageExports = Object.entries(kitManifest.exports ?? {}).map(([entry, value]) => ({
  entry,
  value,
}));
const publicContract = {
  packageName: kitManifest.name,
  packageVersion: kitManifest.version,
  sideEffects: kitManifest.sideEffects,
  packageEntries: packageExports,
  packageEntryCount: packageExports.length,
  rootSource: toRepositoryPath(libraryPath),
  rootExportStatements: librarySource
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("export ")),
  publicSymbolCount: publicSymbols.length,
  publicSymbols,
  runtimeDependencies: Object.keys(kitManifest.dependencies ?? {}).sort(),
};

const styleFiles = collectFiles(join(kitSourceRoot, "components")).filter(
  (path) => basename(path) === "style.scss",
);
const styleAndComponentSources = [
  ...componentSources,
  ...collectFiles(join(kitSourceRoot, "styles")).filter((path) => extname(path) === ".scss"),
  ...styleFiles,
];
const styleApiSource = [...new Set(styleAndComponentSources)].map(readText).join("\n");
const publicCustomProperties = [
  ...new Set(styleApiSource.match(/--elf-[a-zA-Z0-9_-]+/g) ?? []),
].sort();
const internalCustomProperties = [
  ...new Set(styleApiSource.match(/--_[a-zA-Z0-9_-]+/g) ?? []),
].sort();
const publicParts = [
  ...new Set(
    componentSources.flatMap((path) =>
      [...readText(path).matchAll(/\bpart\s*=\s*["'`]([^"'`]+)["'`]/g)].flatMap((match) =>
        match[1].split(/\s+/).filter((part) => /^[a-z][a-z0-9_-]*$/i.test(part)),
      ),
    ),
  ),
].sort();
const styleApi = {
  componentStyleFiles: styleFiles.length,
  macroComponentsWithSiblingStyle: macroComponentFiles.filter((path) =>
    existsSync(join(dirname(path), "style.scss")),
  ).length,
  componentFilesWithParts: componentSources.filter((path) => /\bpart\s*=/.test(readText(path)))
    .length,
  publicParts,
  publicPartCount: publicParts.length,
  publicCustomProperties,
  publicCustomPropertyCount: publicCustomProperties.length,
  internalCustomPropertyCount: internalCustomProperties.length,
  hostStateApis: Object.fromEntries(
    ["useHostAttr", "useHostFlag", "useHostCssVar", "useHostClass", "useHostStyle"].map((api) => [
      api,
      countMatches(styleApiSource, new RegExp(`\\b${api}\\s*\\(`, "g")),
    ]),
  ),
};

const readModuleSpecifiers = (path) => {
  const sourceFile = ts.createSourceFile(path, readText(path), ts.ScriptTarget.Latest, true);
  const specifiers = [];
  const visit = (node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      specifiers.push({
        specifier: node.moduleSpecifier.text,
        typeOnly: Boolean(node.importClause?.isTypeOnly),
        dynamic: false,
      });
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      specifiers.push({
        specifier: node.moduleSpecifier.text,
        typeOnly: Boolean(node.isTypeOnly),
        dynamic: false,
      });
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      specifiers.push({
        specifier: node.arguments[0].text,
        typeOnly: false,
        dynamic: true,
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return specifiers;
};

const resolveTypeScriptImport = (source, specifier) => {
  if (!specifier.startsWith(".")) return null;
  const cleanSpecifier = specifier.split("?")[0];
  const base = resolve(dirname(source), cleanSpecifier);
  const importBase = /\.[cm]?js$/.test(base) ? base.replace(/\.[cm]?js$/, "") : base;
  const candidates = [
    base,
    importBase,
    `${importBase}.ts`,
    `${importBase}.tsx`,
    `${importBase}.mts`,
    `${importBase}.cts`,
    `${importBase}.d.ts`,
    join(importBase, "index.ts"),
    join(importBase, "index.tsx"),
  ];
  return (
    candidates.find(
      (candidate) =>
        existsSync(candidate) && statSync(candidate).isFile() && isTypeScript(candidate),
    ) ?? null
  );
};

const packageName = (specifier) => {
  const segments = specifier.split("/");
  return specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
};

const dependencyFiles = collectFiles(kitSourceRoot).filter(
  (path) => isTypeScript(path) && !isTestSource(path),
);
const dependencyNodes = new Set(dependencyFiles);
const dependencyEdges = [];
const unresolvedRelativeImports = [];
const externalUsage = new Map();
for (const source of dependencyFiles) {
  for (const dependency of readModuleSpecifiers(source)) {
    if (!dependency.specifier.startsWith(".")) {
      const name = packageName(dependency.specifier);
      externalUsage.set(name, (externalUsage.get(name) ?? 0) + 1);
      continue;
    }
    const target = resolveTypeScriptImport(source, dependency.specifier);
    if (!target) {
      if (!/\.(?:css|scss|sass|less|svg|png|jpg|json)(?:\?|$)/.test(dependency.specifier)) {
        unresolvedRelativeImports.push(`${toRepositoryPath(source)} -> ${dependency.specifier}`);
      }
      continue;
    }
    if (dependencyNodes.has(target)) {
      dependencyEdges.push({ source, target, ...dependency });
    }
  }
}

const stronglyConnectedComponents = (nodes, edges) => {
  const graph = new Map([...nodes].map((node) => [node, []]));
  for (const edge of edges) graph.get(edge.source)?.push(edge.target);
  const indexes = new Map();
  const lowLinks = new Map();
  const active = new Set();
  const stack = [];
  const components = [];
  let currentIndex = 0;

  const visit = (node) => {
    indexes.set(node, currentIndex);
    lowLinks.set(node, currentIndex);
    currentIndex += 1;
    stack.push(node);
    active.add(node);

    for (const target of graph.get(node) ?? []) {
      if (!indexes.has(target)) {
        visit(target);
        lowLinks.set(node, Math.min(lowLinks.get(node), lowLinks.get(target)));
      } else if (active.has(target)) {
        lowLinks.set(node, Math.min(lowLinks.get(node), indexes.get(target)));
      }
    }

    if (lowLinks.get(node) !== indexes.get(node)) return;
    const component = [];
    let member;
    do {
      member = stack.pop();
      active.delete(member);
      component.push(member);
    } while (member !== node);
    components.push(component);
  };

  for (const node of nodes) if (!indexes.has(node)) visit(node);
  return components;
};

const dependencyLayer = (path) => {
  const local = toRepositoryPath(path).replace("packages/kit/src/", "");
  const segments = local.split("/");
  return segments[0] === "components" ? `components/${segments[1] ?? "root"}` : segments[0];
};
const layerEdges = new Map();
for (const edge of dependencyEdges) {
  const key = `${dependencyLayer(edge.source)} -> ${dependencyLayer(edge.target)}`;
  layerEdges.set(key, (layerEdges.get(key) ?? 0) + 1);
}
const cycles = stronglyConnectedComponents(dependencyNodes, dependencyEdges)
  .filter(
    (component) =>
      component.length > 1 ||
      dependencyEdges.some((edge) => edge.source === component[0] && edge.target === component[0]),
  )
  .map((component) => component.map(toRepositoryPath).sort())
  .sort((left, right) => left[0].localeCompare(right[0]));
const dependencyGraph = {
  nodes: dependencyNodes.size,
  edges: dependencyEdges.length,
  typeOnlyEdges: dependencyEdges.filter((edge) => edge.typeOnly).length,
  dynamicEdges: dependencyEdges.filter((edge) => edge.dynamic).length,
  stronglyConnectedComponents: cycles,
  cycleCount: cycles.length,
  unresolvedRelativeImports: [...new Set(unresolvedRelativeImports)].sort(),
  externalPackages: Object.fromEntries([...externalUsage.entries()].sort()),
  layerEdges: Object.fromEntries([...layerEdges.entries()].sort()),
};

const resourcePatterns = {
  addEventListener: /\.addEventListener\s*\(/g,
  removeEventListener: /\.removeEventListener\s*\(/g,
  useEventListener: /\buseEventListener\s*\(/g,
  mutationObserver: /\bnew\s+MutationObserver\s*\(/g,
  resizeObserver: /\bnew\s+ResizeObserver\s*\(/g,
  useResizeObserver: /\buseResizeObserver\s*\(/g,
  intersectionObserver: /\bnew\s+IntersectionObserver\s*\(/g,
  useIntersectionObserver: /\buseIntersectionObserver\s*\(/g,
  observerDisconnect: /\.disconnect\s*\(/g,
  setTimeout: /\bsetTimeout\s*\(/g,
  clearTimeout: /\bclearTimeout\s*\(/g,
  setInterval: /\bsetInterval\s*\(/g,
  clearInterval: /\bclearInterval\s*\(/g,
  requestAnimationFrame: /\brequestAnimationFrame\s*\(/g,
  cancelAnimationFrame: /\bcancelAnimationFrame\s*\(/g,
  abortController: /\bnew\s+AbortController\s*\(/g,
  createObjectURL: /\bURL\.createObjectURL\s*\(/g,
  revokeObjectURL: /\bURL\.revokeObjectURL\s*\(/g,
};
const resourceInventory = {
  staticOnly: true,
  disclaimer:
    "Occurrence counts locate resource owners; unequal acquire/release totals do not prove a leak. Dynamic mount/unmount release gates belong to NG-703.",
  patterns: Object.fromEntries(
    Object.entries(resourcePatterns).map(([name, expression]) => {
      const matches = dependencyFiles
        .map((path) => ({
          path: toRepositoryPath(path),
          occurrences: countMatches(readText(path), expression),
        }))
        .filter((entry) => entry.occurrences > 0);
      return [
        name,
        {
          occurrences: matches.reduce((sum, entry) => sum + entry.occurrences, 0),
          files: matches.length,
          sourceFiles: matches,
        },
      ];
    }),
  ),
};

if (!existsSync(kitDistRoot) || !existsSync(websiteDistRoot)) {
  throw new Error(
    "Missing build artifacts. Run `pnpm build:lib && pnpm build:website` before collecting the report.",
  );
}
if (!existsSync(performancePath)) {
  throw new Error(
    "Missing current browser measurements. Run `pnpm baseline:critical-pages` before collecting the report.",
  );
}

const sizeOf = (code) => {
  const buffer = Buffer.from(code);
  return {
    rawBytes: buffer.length,
    gzipBytes: gzipSync(buffer).length,
    brotliBytes: brotliCompressSync(buffer).length,
  };
};

const builtEntry = join(kitDistRoot, "elfui-kit.js");
const buildConsumerBundle = async (key, consumerSource) => {
  const virtualEntry = `\0elfui-baseline:${key}`;
  const builtPackageId = `virtual:elfui-kit:${key}`;
  const bundle = await rollup({
    input: virtualEntry,
    external(id) {
      if (id === virtualEntry || id === builtPackageId) return false;
      return !id.startsWith(".") && !id.startsWith("\0") && !resolve(id).startsWith(kitDistRoot);
    },
    plugins: [
      {
        name: "elfui-baseline-consumer",
        resolveId(id) {
          if (id === virtualEntry) return id;
          if (id === builtPackageId) return builtEntry;
          return null;
        },
        load(id) {
          return id === virtualEntry
            ? consumerSource.replaceAll("__ELFUI_KIT__", JSON.stringify(builtPackageId))
            : null;
        },
      },
    ],
    treeshake: { moduleSideEffects: (_id, external) => external },
  });
  const generated = await bundle.generate({ format: "es", inlineDynamicImports: true });
  await bundle.close();
  const chunks = generated.output.filter((output) => output.type === "chunk");
  const code = chunks.map((chunk) => chunk.code).join("\n");
  return {
    ...sizeOf(code),
    modules: new Set(chunks.flatMap((chunk) => Object.keys(chunk.modules))).size,
  };
};

const namedImportBundle = await buildConsumerBundle(
  "button-input",
  "import { Button, Input } from __ELFUI_KIT__;\nglobalThis.__ELFUI_COMPONENTS__ = [Button, Input];",
);
const fullRegistrationBundle = await buildConsumerBundle(
  "register-all",
  "import { registerAllComponents } from __ELFUI_KIT__;\nglobalThis.__ELFUI_REGISTER_ALL__ = registerAllComponents;",
);

const describeJavaScriptAssets = (directory) => {
  const files = collectFiles(directory)
    .filter((path) => extname(path) === ".js")
    .map((path) => ({
      path: toRepositoryPath(path).replace(/-[a-zA-Z0-9_-]{8,}(?=\.js$)/, "-content-hash"),
      ...sizeOf(readFileSync(path)),
    }))
    .sort((left, right) => right.rawBytes - left.rawBytes);
  return {
    files: files.length,
    rawBytes: files.reduce((sum, file) => sum + file.rawBytes, 0),
    gzipBytes: files.reduce((sum, file) => sum + file.gzipBytes, 0),
    brotliBytes: files.reduce((sum, file) => sum + file.brotliBytes, 0),
    largestFiles: files.slice(0, 5),
  };
};
const bundleInventory = {
  excludesExternalDependencies: true,
  consumers: {
    namedButtonInput: namedImportBundle,
    registerAllComponents: fullRegistrationBundle,
  },
  publishedJavaScript: describeJavaScriptAssets(kitDistRoot),
  websiteJavaScript: describeJavaScriptAssets(websiteDistRoot),
};

const criticalPages = readJson(performancePath);
const playwrightConfigSource = readText(join(repositoryRoot, "playwright.baseline.config.ts"));
const configuredProjects = [
  ...playwrightConfigSource.matchAll(/name:\s*["'](chromium|firefox|webkit)["']/g),
].map((match) => match[1]);
const workflowSource = existsSync(join(repositoryRoot, ".github", "workflows"))
  ? collectFiles(join(repositoryRoot, ".github", "workflows"))
      .map(readText)
      .join("\n")
  : "";
const browserMatrix = {
  playwrightVersion: readJson(
    join(repositoryRoot, "node_modules", "@playwright", "test", "package.json"),
  ).version,
  currentPerformanceEvidence: toRepositoryPath(performancePath),
  audits: {
    documentationNavigation: {
      script: "scripts/audit-doc-navigation.playwright.js",
      ciWired: workflowSource.includes("audit-doc-navigation.playwright.js"),
    },
    lightDarkTheme: {
      script: "scripts/theme-light-dark-audit.playwright.js",
      ciWired: workflowSource.includes("theme-light-dark-audit.playwright.js"),
    },
  },
  engines: ["chromium", "firefox", "webkit"].map((engine) => ({
    engine,
    configured: configuredProjects.includes(engine),
    measured:
      criticalPages.browserName === engine ||
      criticalPages.browserName?.toLowerCase().includes(engine),
    version:
      criticalPages.browserName === engine ||
      criticalPages.browserName?.toLowerCase().includes(engine)
        ? criticalPages.browser
        : null,
    status:
      criticalPages.browserName === engine ||
      criticalPages.browserName?.toLowerCase().includes(engine)
        ? "current-performance-baseline"
        : "not-automated-yet (NG-700)",
  })),
};

const gitCommand = process.platform === "win32" ? "git.exe" : "git";
const baseline = {
  schemaVersion: 1,
  capturedAt: new Date().toISOString(),
  repository: {
    baseCommit: commandOutput(gitCommand, ["rev-parse", "HEAD"]),
    branch: commandOutput(gitCommand, ["branch", "--show-current"]),
    workingTreeIncluded: true,
  },
  environment: {
    node: process.version,
    pnpm: String(workspaceManifest.packageManager).replace(/^pnpm@/, ""),
    platform: platform(),
    platformRelease: release(),
    architecture: process.arch,
    cpu: cpus()[0]?.model ?? "unknown",
    logicalCpuCount: cpus().length,
    memoryBytes: totalmem(),
  },
  source: sourceInventory,
  publicContract,
  styleApi,
  dependencyGraph,
  bundles: bundleInventory,
  criticalPages: {
    evidence: toRepositoryPath(performancePath),
    capturedAt: criticalPages.capturedAt,
    browserName: criticalPages.browserName,
    browser: criticalPages.browser,
    viewport: criticalPages.viewport,
    statistic: criticalPages.statistic,
    summary: criticalPages.summary,
  },
  resources: resourceInventory,
  browsers: browserMatrix,
};

const kib = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;
const tableCell = (value) => String(value ?? "—").replaceAll("|", "\\|");
const table = (headers, rows) => [
  `| ${headers.map(tableCell).join(" | ")} |`,
  `| ${headers.map(() => "---").join(" | ")} |`,
  ...rows.map((row) => `| ${row.map(tableCell).join(" | ")} |`),
];
const performanceRows = Object.entries(baseline.criticalPages.summary).map(([key, scenario]) => [
  key,
  scenario.route,
  scenario.sourceItems,
  scenario.workloadSatisfied ? "yes" : "no",
  `${scenario.renderMs} ms`,
  `${scenario.settledActionMs} ms`,
  `${scenario.targetElementsBefore}/${scenario.targetElementsAfter}`,
  scenario.renderedItemsAfter,
]);
const resourceRows = Object.entries(baseline.resources.patterns).map(([name, value]) => [
  name,
  value.occurrences,
  value.files,
]);
const cycleRows = baseline.dependencyGraph.stronglyConnectedComponents.map((component, index) => [
  index + 1,
  component.join(" → "),
]);
const markdown = [
  "# ElfUI Kit current repository baseline",
  "",
  `Captured at: ${baseline.capturedAt}.`,
  "",
  `Generation base: \`${baseline.repository.branch}\` at \`${baseline.repository.baseCommit}\`, plus the current working tree.`,
  "",
  "This report is generated from the current checkout. It does not reuse counts or timing from an older plan. Regenerate it with `pnpm baseline:collect`.",
  "",
  "## Source and tests",
  "",
  ...table(
    ["Area", "Production TS", "Production lines", "Test files", "Test lines"],
    Object.entries(baseline.source.areas).map(([area, value]) => [
      area,
      value.productionFiles,
      value.productionLines,
      value.testFiles,
      value.testLines,
    ]),
  ),
  "",
  `- Macro component definitions: ${baseline.source.macroComponents.definitions} in ${baseline.source.macroComponents.files} files.`,
  `- Test files: ${baseline.source.tests.files}; direct \`it()/test()\` declarations: ${baseline.source.tests.declarations}; source-annotated skipped: ${baseline.source.tests.skippedAnnotations}; source-annotated todo: ${baseline.source.tests.todoAnnotations}.`,
  "",
  "## Public package and bundle",
  "",
  `- Published entries: ${baseline.publicContract.packageEntries.map(({ entry }) => `\`${entry}\``).join(", ")} (${baseline.publicContract.packageEntryCount} total).`,
  `- Root named symbols: ${baseline.publicContract.publicSymbolCount}.`,
  `- \`sideEffects\`: \`${baseline.publicContract.sideEffects}\`. External dependencies are excluded from consumer bundle figures.`,
  "",
  ...table(
    ["Bundle", "Raw", "Gzip", "Brotli", "Internal modules"],
    [
      [
        "Button + Input named import",
        kib(namedImportBundle.rawBytes),
        kib(namedImportBundle.gzipBytes),
        kib(namedImportBundle.brotliBytes),
        namedImportBundle.modules,
      ],
      [
        "registerAllComponents",
        kib(fullRegistrationBundle.rawBytes),
        kib(fullRegistrationBundle.gzipBytes),
        kib(fullRegistrationBundle.brotliBytes),
        fullRegistrationBundle.modules,
      ],
      [
        "Website JavaScript total",
        kib(bundleInventory.websiteJavaScript.rawBytes),
        kib(bundleInventory.websiteJavaScript.gzipBytes),
        kib(bundleInventory.websiteJavaScript.brotliBytes),
        bundleInventory.websiteJavaScript.files,
      ],
    ],
  ),
  "",
  "## Style API",
  "",
  `- Component style files: ${baseline.styleApi.componentStyleFiles}; macro files with a sibling style: ${baseline.styleApi.macroComponentsWithSiblingStyle}.`,
  `- Public Shadow DOM parts: ${baseline.styleApi.publicPartCount} across ${baseline.styleApi.componentFilesWithParts} component files.`,
  `- Public \`--elf-*\` custom properties: ${baseline.styleApi.publicCustomPropertyCount}; internal \`--_*\` properties: ${baseline.styleApi.internalCustomPropertyCount}.`,
  `- Core host-state API calls: ${Object.entries(baseline.styleApi.hostStateApis)
    .map(([name, count]) => `\`${name}\` ${count}`)
    .join(", ")}.`,
  "",
  "## Dependency graph",
  "",
  `- Nodes: ${baseline.dependencyGraph.nodes}; internal edges: ${baseline.dependencyGraph.edges}; type-only edges: ${baseline.dependencyGraph.typeOnlyEdges}; dynamic edges: ${baseline.dependencyGraph.dynamicEdges}.`,
  `- Strongly connected components: ${baseline.dependencyGraph.cycleCount}; unresolved relative TypeScript imports: ${baseline.dependencyGraph.unresolvedRelativeImports.length}.`,
  "",
  ...(cycleRows.length > 0
    ? [...table(["SCC", "Members"], cycleRows), ""]
    : ["No source SCC was found by the current full non-test TypeScript scan.", ""]),
  "## Critical-page performance",
  "",
  `Browser: ${baseline.criticalPages.browserName} ${baseline.criticalPages.browser}; viewport: ${baseline.criticalPages.viewport.width} × ${baseline.criticalPages.viewport.height}; statistic: ${baseline.criticalPages.statistic} of five isolated runs.`,
  "",
  ...table(
    [
      "Scenario",
      "Route",
      "Source items",
      "Workload met",
      "Render",
      "Settled action",
      "Target DOM before/after",
      "Rendered items",
    ],
    performanceRows,
  ),
  "",
  "Workloads below 10k are recorded as current coverage gaps, not presented as 10k evidence. Expanding those fixtures and adding regression thresholds belongs to the NG-700 performance gate.",
  "",
  "## Listener, observer and timer inventory",
  "",
  ...table(["Pattern", "Occurrences", "Files"], resourceRows),
  "",
  `> ${baseline.resources.disclaimer}`,
  "",
  "## Browser matrix",
  "",
  ...table(
    ["Engine", "Configured", "Measured", "Version", "Status"],
    baseline.browsers.engines.map((engine) => [
      engine.engine,
      engine.configured ? "yes" : "no",
      engine.measured ? "yes" : "no",
      engine.version,
      engine.status,
    ]),
  ),
  "",
  `- Documentation navigation browser audit is in \`${baseline.browsers.audits.documentationNavigation.script}\`; CI wired: ${baseline.browsers.audits.documentationNavigation.ciWired}.`,
  `- Light/dark browser audit is in \`${baseline.browsers.audits.lightDarkTheme.script}\`; CI wired: ${baseline.browsers.audits.lightDarkTheme.ciWired}.`,
  "- Firefox/WebKit automation is deliberately reported as missing until NG-700; Chromium evidence must not be described as a three-browser gate.",
  "",
  "## Reproduce",
  "",
  "```bash",
  "pnpm install --frozen-lockfile",
  "pnpm exec playwright install chromium",
  "pnpm baseline:collect",
  "```",
  "",
].join("\n");

writeFileSync(
  jsonOutputPath,
  await prettier.format(JSON.stringify(baseline), { filepath: jsonOutputPath }),
  "utf8",
);
writeFileSync(
  markdownOutputPath,
  await prettier.format(markdown, { filepath: markdownOutputPath }),
  "utf8",
);
console.log(
  `Repository baseline written to ${toRepositoryPath(markdownOutputPath)} and ${toRepositoryPath(jsonOutputPath)}`,
);
