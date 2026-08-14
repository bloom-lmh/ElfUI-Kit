import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";

import ts from "typescript";

const TYPESCRIPT_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".cts"]);

export const isTypeScriptSource = (path) => TYPESCRIPT_EXTENSIONS.has(extname(path));

export const isTypeScriptTestSource = (path) => {
  const normalized = path.replaceAll("\\", "/");
  const file = basename(normalized);
  return (
    normalized.includes("/__tests__/") ||
    /\.(?:test|spec)\./.test(file) ||
    /\.playwright\./.test(file) ||
    /\.(?:test|spec)-component\./.test(file)
  );
};

const importClauseIsTypeOnly = (clause) => {
  if (!clause) return false;
  if (clause.isTypeOnly) return true;
  if (clause.name || !clause.namedBindings || !ts.isNamedImports(clause.namedBindings)) {
    return false;
  }
  return (
    clause.namedBindings.elements.length > 0 &&
    clause.namedBindings.elements.every((element) => element.isTypeOnly)
  );
};

const exportDeclarationIsTypeOnly = (declaration) => {
  if (declaration.isTypeOnly) return true;
  return Boolean(
    declaration.exportClause &&
    ts.isNamedExports(declaration.exportClause) &&
    declaration.exportClause.elements.length > 0 &&
    declaration.exportClause.elements.every((element) => element.isTypeOnly),
  );
};

export const readTypeScriptModuleSpecifiers = (path) => {
  const sourceFile = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const specifiers = [];
  const visit = (node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      specifiers.push({
        specifier: node.moduleSpecifier.text,
        typeOnly: importClauseIsTypeOnly(node.importClause),
        dynamic: false,
      });
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      specifiers.push({
        specifier: node.moduleSpecifier.text,
        typeOnly: exportDeclarationIsTypeOnly(node),
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

export const resolveTypeScriptModule = (source, specifier) => {
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
        existsSync(candidate) && statSync(candidate).isFile() && isTypeScriptSource(candidate),
    ) ?? null
  );
};

const findStronglyConnectedComponents = (nodes, edges) => {
  const graph = new Map(nodes.map((node) => [node, []]));
  for (const edge of edges) graph.get(edge.source)?.push(edge.target);
  const indexes = new Map();
  const lowestIndexes = new Map();
  const active = new Set();
  const stack = [];
  const components = [];
  let currentIndex = 0;

  const visit = (node) => {
    indexes.set(node, currentIndex);
    lowestIndexes.set(node, currentIndex);
    currentIndex += 1;
    stack.push(node);
    active.add(node);

    for (const target of graph.get(node) ?? []) {
      if (!indexes.has(target)) {
        visit(target);
        lowestIndexes.set(node, Math.min(lowestIndexes.get(node), lowestIndexes.get(target)));
      } else if (active.has(target)) {
        lowestIndexes.set(node, Math.min(lowestIndexes.get(node), indexes.get(target)));
      }
    }

    if (lowestIndexes.get(node) !== indexes.get(node)) return;
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

const packageName = (specifier) => {
  const segments = specifier.split("/");
  return specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
};

const dependencyLayer = (path, sourceRoot) => {
  const segments = relative(sourceRoot, path).replaceAll("\\", "/").split("/");
  return segments[0] === "components" ? `components/${segments[1] ?? "root"}` : segments[0];
};

export const analyzeTypeScriptDependencies = ({ files, repositoryRoot, sourceRoot }) => {
  const normalizedFiles = [...new Set(files.map((path) => resolve(path)))].sort();
  const nodes = new Set(normalizedFiles);
  const edges = [];
  const unresolvedRelativeImports = [];
  const externalUsage = new Map();
  const toRepositoryPath = (path) => relative(repositoryRoot, path).replaceAll("\\", "/");

  for (const source of normalizedFiles) {
    for (const dependency of readTypeScriptModuleSpecifiers(source)) {
      if (!dependency.specifier.startsWith(".")) {
        const name = packageName(dependency.specifier);
        externalUsage.set(name, (externalUsage.get(name) ?? 0) + 1);
        continue;
      }
      const target = resolveTypeScriptModule(source, dependency.specifier);
      if (!target) {
        if (!/\.(?:css|scss|sass|less|svg|png|jpg|json)(?:\?|$)/.test(dependency.specifier)) {
          unresolvedRelativeImports.push(`${toRepositoryPath(source)} -> ${dependency.specifier}`);
        }
        continue;
      }
      if (nodes.has(target)) edges.push({ source, target, ...dependency });
    }
  }

  const cycles = findStronglyConnectedComponents(normalizedFiles, edges)
    .filter(
      (component) =>
        component.length > 1 ||
        edges.some((edge) => edge.source === component[0] && edge.target === component[0]),
    )
    .map((component) => component.sort())
    .sort((left, right) => left[0].localeCompare(right[0]));
  const layerEdges = new Map();
  for (const edge of edges) {
    const key = `${dependencyLayer(edge.source, sourceRoot)} -> ${dependencyLayer(edge.target, sourceRoot)}`;
    layerEdges.set(key, (layerEdges.get(key) ?? 0) + 1);
  }

  return {
    files: normalizedFiles,
    edges,
    cycles,
    unresolvedRelativeImports: [...new Set(unresolvedRelativeImports)].sort(),
    externalPackages: Object.fromEntries([...externalUsage.entries()].sort()),
    layerEdges: Object.fromEntries([...layerEdges.entries()].sort()),
  };
};

export const summarizeTypeScriptDependencies = (analysis, toPath) => ({
  nodes: analysis.files.length,
  edges: analysis.edges.length,
  typeOnlyEdges: analysis.edges.filter((edge) => edge.typeOnly).length,
  dynamicEdges: analysis.edges.filter((edge) => edge.dynamic).length,
  stronglyConnectedComponents: analysis.cycles.map((component) => component.map(toPath).sort()),
  cycleCount: analysis.cycles.length,
  unresolvedRelativeImports: analysis.unresolvedRelativeImports,
  externalPackages: analysis.externalPackages,
  layerEdges: analysis.layerEdges,
});
