import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import ts from "typescript";

const repoRoot = process.cwd();
const formatHost = {
  getCanonicalFileName: (fileName) => fileName,
  getCurrentDirectory: () => repoRoot,
  getNewLine: () => ts.sys.newLine
};
const tsconfigPath = path.join(repoRoot, "tsconfig.lib.json");
const localFrameworkRoot = path.resolve(repoRoot, "..", "elfui");
const localCompilerEntry = path.join(
  localFrameworkRoot,
  "packages",
  "compiler",
  "dist",
  "macro-component.js"
);
const localCoreDist = path.join(localFrameworkRoot, "packages", "core", "dist");
const useLocalFramework =
  process.env.ELFUI_KIT_LOCAL_FRAMEWORK !== "0" &&
  existsSync(localCompilerEntry) &&
  existsSync(path.join(localCoreDist, "index.d.ts"));

const compilerModule = useLocalFramework
  ? await import(pathToFileURL(localCompilerEntry).href)
  : await import("@elfui/compiler/macro-component");
const { compileMacroComponent, formatElfDiagnostic } = compilerModule;

const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
if (configFile.error) {
  console.error(ts.formatDiagnosticsWithColorAndContext([configFile.error], formatHost));
  process.exit(1);
}

const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, repoRoot, {
  noCheck: false,
  noEmit: true,
  declaration: false,
  declarationMap: false,
  emitDeclarationOnly: false,
  incremental: false,
  composite: false
});
if (parsed.errors.length > 0) {
  console.error(ts.formatDiagnosticsWithColorAndContext(parsed.errors, formatHost));
  process.exit(1);
}

if (useLocalFramework) {
  parsed.options.baseUrl = repoRoot;
  parsed.options.paths = {
    ...(parsed.options.paths ?? {}),
    "@elfui/core": [path.join(localCoreDist, "index.d.ts")],
    "@elfui/core/internal": [path.join(localCoreDist, "internal.d.ts")]
  };
}

const normalized = (file) => path.resolve(file).replaceAll("\\", "/").toLowerCase();
const virtualSources = new Map();
const macroDiagnostics = [];
let macroFileCount = 0;

for (const file of parsed.fileNames) {
  if (!/\.tsx?$/u.test(file) || file.endsWith(".d.ts")) continue;
  const source = readFileSync(file, "utf8");
  if (!isMacroComponent(source)) continue;

  const filename = path.relative(repoRoot, file).replaceAll("\\", "/");
  const result = compileMacroComponent(source, {
    filename,
    sourceId: filename,
    templateTypeCheck: true
  });
  macroFileCount++;
  virtualSources.set(normalized(file), maskHtmlTemplates(source, file));
  macroDiagnostics.push(...result.diagnostics);
}

const macroErrors = macroDiagnostics.filter((diagnostic) => diagnostic.severity === "error");
for (const diagnostic of macroDiagnostics) {
  const stream = diagnostic.severity === "error" ? process.stderr : process.stdout;
  stream.write(`${formatElfDiagnostic(diagnostic)}\n`);
}

const host = ts.createCompilerHost(parsed.options, true);
const defaultReadFile = host.readFile.bind(host);
host.readFile = (fileName) => virtualSources.get(normalized(fileName)) ?? defaultReadFile(fileName);
host.getSourceFile = (fileName, languageVersionOrOptions, onError) => {
  const source = host.readFile(fileName);
  if (source === undefined) {
    onError?.(`Cannot read file '${fileName}'.`);
    return undefined;
  }
  return ts.createSourceFile(
    fileName,
    source,
    languageVersionOrOptions,
    true,
    ts.getScriptKindFromFileName(fileName)
  );
};

const program = ts.createProgram({
  rootNames: parsed.fileNames,
  options: parsed.options,
  projectReferences: parsed.projectReferences,
  host
});
const typescriptDiagnostics = ts.getPreEmitDiagnostics(program).filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
);

if (typescriptDiagnostics.length > 0) {
  console.error(ts.formatDiagnosticsWithColorAndContext(typescriptDiagnostics, formatHost));
}

const frameworkSource = useLocalFramework ? "local ElfUI workspace" : "installed packages";
const summary =
  `macro-aware typecheck scanned ${macroFileCount} macro component files against ${frameworkSource}: ` +
  `${macroErrors.length} macro errors, ${typescriptDiagnostics.length} TypeScript errors.`;

if (macroErrors.length > 0 || typescriptDiagnostics.length > 0) {
  console.error(summary);
  process.exit(1);
}

console.log(summary);

function isMacroComponent(source) {
  return (
    /from\s+["']@elfui\/core["']/u.test(source) &&
    /\bdefineHtml\b/u.test(source)
  );
}

function maskHtmlTemplates(source, fileName) {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const ranges = [];

  const visit = (node) => {
    if (ts.isTaggedTemplateExpression(node) && ts.isIdentifier(node.tag) && node.tag.text === "html") {
      ranges.push([node.template.getStart(sourceFile), node.template.getEnd()]);
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  let output = source;
  for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) {
    output = `${output.slice(0, start)}\`\`${output.slice(end)}`;
  }
  return output;
}
