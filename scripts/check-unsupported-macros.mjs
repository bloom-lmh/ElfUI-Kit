import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import ts from "typescript";

const root = resolve(process.cwd());
const sourceRoot = join(root, "src");
const unsupported = new Set(["fragment", "defineFragment"]);

const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const sourceFiles = walk(sourceRoot).filter((path) => /\.[cm]?[jt]sx?$/u.test(path));
const findings = [];

const report = (sourceFile, node, name) => {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  findings.push({
    file: relative(root, sourceFile.fileName).replaceAll("\\", "/"),
    line: position.line + 1,
    column: position.character + 1,
    name,
  });
};

for (const filename of sourceFiles) {
  const source = readFileSync(filename, "utf8");
  const sourceFile = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    filename.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const namespaceImports = new Set();

  for (const statement of sourceFile.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text === "@elfui/core"
    ) {
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const specifier of bindings.elements) {
          const importedName = specifier.propertyName?.text ?? specifier.name.text;
          if (unsupported.has(importedName)) report(sourceFile, specifier, importedName);
        }
      } else if (bindings && ts.isNamespaceImport(bindings)) {
        namespaceImports.add(bindings.name.text);
      }
    }

    if (
      ts.isExportDeclaration(statement) &&
      statement.moduleSpecifier &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.moduleSpecifier.text === "@elfui/core" &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const specifier of statement.exportClause.elements) {
        const exportedName = specifier.propertyName?.text ?? specifier.name.text;
        if (unsupported.has(exportedName)) report(sourceFile, specifier, exportedName);
      }
    }
  }

  if (namespaceImports.size > 0) {
    const visit = (node) => {
      if (
        ts.isPropertyAccessExpression(node) &&
        ts.isIdentifier(node.expression) &&
        namespaceImports.has(node.expression.text) &&
        unsupported.has(node.name.text)
      ) {
        report(sourceFile, node.name, node.name.text);
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
}

findings.sort((left, right) =>
  left.file.localeCompare(right.file) ||
  left.line - right.line ||
  left.column - right.column,
);

if (findings.length > 0) {
  for (const finding of findings) {
    process.stderr.write(
      `${finding.file}:${finding.line}:${finding.column} unsupported ElfUI macro '${finding.name}'\n`,
    );
  }
  process.stderr.write(
    `Unsupported macro check failed with ${findings.length} finding(s). ` +
      "Use a direct defineHtml() template and keyed v-for instead.\n",
  );
  process.exit(1);
}

process.stdout.write(
  `Unsupported macro check scanned ${sourceFiles.length} source files: 0 findings.\n`,
);
