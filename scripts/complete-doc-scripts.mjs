import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

const root = resolve(process.cwd());
const write = process.argv.includes("--write");
const audit = JSON.parse(execFileSync(
  process.execPath,
  [resolve(root, "scripts/audit-doc-pages.mjs")],
  { cwd: root, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }
));

const targets = audit.pages
  .flatMap((page) => page.playgrounds)
  .filter((playground) =>
    (playground.needsScript && !playground.hasScript)
    || (playground.hasScript && playground.missingScriptDependencies.length > 0)
  );

const byFile = Map.groupBy(targets, (target) => target.file);
const summary = { files: 0, addedScripts: 0, completedScripts: 0, unresolved: [] };

const escapeTemplate = (value) => `\`${value
  .replaceAll("\\", "\\\\")
  .replaceAll("`", "\\`")
  .replaceAll("${", "\\${")}\``;

const scriptNameFor = (codeRef, names) => {
  const base = codeRef.endsWith("Code")
    ? `${codeRef.slice(0, -4)}Script`
    : codeRef === "code" ? "script" : `${codeRef}Script`;
  if (!names.has(base)) return base;
  let suffix = 2;
  while (names.has(`${base}${suffix}`)) suffix += 1;
  return `${base}${suffix}`;
};

const declarationNames = (statement) => {
  const names = [];
  const collect = (name) => {
    if (ts.isIdentifier(name)) names.push(name.text);
    else if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
      name.elements.forEach((element) => {
        if (ts.isBindingElement(element)) collect(element.name);
      });
    }
  };
  if (ts.isVariableStatement(statement)) {
    statement.declarationList.declarations.forEach((declaration) => collect(declaration.name));
  } else if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.name) {
    names.push(statement.name.text);
  }
  return names;
};

const referencedTopLevelNames = (statement, topLevelNames) => {
  const localNames = new Set();
  const collectBinding = (name) => {
    if (ts.isIdentifier(name)) localNames.add(name.text);
    else if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
      name.elements.forEach((element) => {
        if (ts.isBindingElement(element)) collectBinding(element.name);
      });
    }
  };
  const collectLocals = (node) => {
    if (ts.isParameter(node)) collectBinding(node.name);
    if (ts.isVariableDeclaration(node) && node.parent !== statement) collectBinding(node.name);
    ts.forEachChild(node, collectLocals);
  };
  collectLocals(statement);

  const names = new Set();
  const visit = (node) => {
    if (ts.isIdentifier(node)) {
      const parent = node.parent;
      const propertyName = (ts.isPropertyAccessExpression(parent) && parent.name === node)
        || (ts.isPropertyAssignment(parent) && parent.name === node)
        || (ts.isMethodDeclaration(parent) && parent.name === node);
      const declaration = (ts.isVariableDeclaration(parent) || ts.isParameter(parent)) && parent.name === node;
      if (!propertyName && !declaration && !localNames.has(node.text) && topLevelNames.has(node.text)) {
        names.add(node.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(statement);
  return names;
};

const javascriptForStatements = (statements, sourceFile) => {
  const source = statements
    .sort((a, b) => a.getStart(sourceFile) - b.getStart(sourceFile))
    .map((statement) => statement.getText(sourceFile))
    .join("\n\n");
  return ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      removeComments: false
    }
  }).outputText.trim();
};

for (const [relativeFile, fileTargets] of byFile) {
  const filename = resolve(root, relativeFile);
  let source = readFileSync(filename, "utf8");
  const sourceFile = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const statements = sourceFile.statements.filter((statement) => declarationNames(statement).length > 0);
  const declarations = new Map();
  for (const statement of statements) {
    for (const name of declarationNames(statement)) declarations.set(name, statement);
  }
  const topLevelNames = new Set(declarations.keys());
  const references = new Map(statements.map((statement) => [
    statement,
    referencedTopLevelNames(statement, topLevelNames)
  ]));
  const closureFor = (requestedNames, excludedNames = new Set()) => {
    const selected = new Set();
    const pending = [...requestedNames];
    while (pending.length > 0) {
      const name = pending.pop();
      if (!name || excludedNames.has(name)) continue;
      const statement = declarations.get(name);
      if (!statement) {
        summary.unresolved.push({ file: relativeFile, name });
        continue;
      }
      if (selected.has(statement)) continue;
      selected.add(statement);
      for (const dependency of references.get(statement) || []) {
        if (!excludedNames.has(dependency)) pending.push(dependency);
      }
    }
    return [...selected];
  };

  const changes = [];
  const allNames = new Set(topLevelNames);
  const groupedExisting = Map.groupBy(
    fileTargets.filter((target) => target.hasScript),
    (target) => target.scriptRef
  );
  for (const [scriptRef, scriptTargets] of groupedExisting) {
    if (!scriptRef) continue;
    const declaration = declarations.get(scriptRef);
    if (!declaration || !ts.isVariableStatement(declaration)) continue;
    const variable = declaration.declarationList.declarations.find((item) =>
      ts.isIdentifier(item.name) && item.name.text === scriptRef
    );
    if (!variable?.initializer || !ts.isStringLiteralLike(variable.initializer)) continue;
    const missingNames = new Set(scriptTargets.flatMap((target) => target.missingScriptDependencies));
    const existingNames = new Set(
      [...topLevelNames].filter((name) => new RegExp(`\\b${name.replace(/[$]/g, "\\$")}\\b`).test(variable.initializer.text))
    );
    existingNames.add(scriptRef);
    const dependencyStatements = closureFor(missingNames, existingNames);
    const addition = javascriptForStatements(dependencyStatements, sourceFile);
    if (!addition) continue;
    const completed = `${variable.initializer.text.trimEnd()}\n\n${addition}`;
    changes.push({ start: variable.initializer.getStart(sourceFile), end: variable.initializer.end, text: escapeTemplate(completed) });
    summary.completedScripts += 1;
  }

  for (const target of fileTargets.filter((item) => !item.hasScript)) {
    const codeDeclaration = declarations.get(target.codeRef);
    if (!codeDeclaration) {
      summary.unresolved.push({ file: relativeFile, name: target.codeRef || "(codeRef)" });
      continue;
    }
    const dependencyStatements = closureFor(target.dependencies, new Set([target.codeRef]));
    const scriptBody = javascriptForStatements(dependencyStatements, sourceFile);
    if (!scriptBody) {
      summary.unresolved.push({ file: relativeFile, name: `${target.codeRef}:empty-script` });
      continue;
    }
    const scriptRef = scriptNameFor(target.codeRef, allNames);
    allNames.add(scriptRef);
    changes.push({
      start: codeDeclaration.end,
      end: codeDeclaration.end,
      text: `\n\nconst ${scriptRef} = ${escapeTemplate(scriptBody)};`
    });

    const codeAttribute = new RegExp(`:code\\s*=\\s*(?:\\$\\{${target.codeRef}\\}|["']${target.codeRef}["'])`);
    const playgroundPattern = /<elf-playground\b[\s\S]*?>/g;
    const opening = [...source.matchAll(playgroundPattern)].find((match) => codeAttribute.test(match[0]));
    if (!opening || opening.index === undefined) {
      summary.unresolved.push({ file: relativeFile, name: `${target.codeRef}:playground` });
      continue;
    }
    const insertAt = opening.index + opening[0].lastIndexOf(">");
    changes.push({ start: insertAt, end: insertAt, text: ` :script=\${${scriptRef}}` });
    summary.addedScripts += 1;
  }

  if (changes.length === 0) continue;
  changes.sort((a, b) => b.start - a.start || b.end - a.end);
  for (const change of changes) source = `${source.slice(0, change.start)}${change.text}${source.slice(change.end)}`;
  if (write) writeFileSync(filename, source, "utf8");
  summary.files += 1;
}

process.stdout.write(`${JSON.stringify({ write, ...summary }, null, 2)}\n`);
