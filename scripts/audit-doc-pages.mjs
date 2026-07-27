import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import ts from "typescript";

const root = resolve(process.cwd());
const pagesRoot = join(root, "src", "pages");
const routesSource = readFileSync(join(root, "src", "routes", "index.ts"), "utf8");

const walk = (directory) => readdirSync(directory).flatMap((entry) => {
  const path = join(directory, entry);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

const routePattern = /path:\s*"([^"]+)"[\s\S]*?component:\s*\(\)\s*=>\s*import\("([^"]+)"\)/g;
const routes = [];
for (const match of routesSource.matchAll(routePattern)) {
  const [, path, importPath] = match;
  if (!path || !importPath || path === "/" || path === "/form/debug") continue;
  routes.push({ path, importPath });
}

const stringConstants = (source, filename) => {
  const values = new Map();
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      if (ts.isStringLiteralLike(node.initializer)) {
        values.set(node.name.text, node.initializer.text);
      } else if (ts.isTemplateExpression(node.initializer)) {
        let value = node.initializer.head.text;
        for (const span of node.initializer.templateSpans) {
          value += `\${${span.expression.getText(file)}}${span.literal.text}`;
        }
        values.set(node.name.text, value);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return values;
};

const expressionRef = (attributes, name) => {
  const expression = attributes.match(new RegExp(`:${name}\\s*=\\s*\\$\\{([A-Za-z_$][\\w$]*)\\}`));
  if (expression?.[1]) return expression[1];
  const quoted = attributes.match(new RegExp(`:${name}\\s*=\\s*["']([A-Za-z_$][\\w$]*)["']`));
  return quoted?.[1] || "";
};

const literalAttribute = (attributes, name) =>
  attributes.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`))?.[1] || "";

const needsScript = (code) => ({
  event: /@[\w:-]+\s*=/.test(code),
  model: /v-model|:model-?value|:modelValue/.test(code),
  directive: /v-(?:for|if|show)\s*=/.test(code),
  dynamic: /\$\{[^}]+\}|:[\w-]+(?:\.prop)?\s*=/.test(code)
});

const ignoredIdentifiers = new Set([
  "true", "false", "null", "undefined", "event", "Math", "Date",
  "String", "Number", "Array", "Object", "JSON", "$event"
]);

const expressionIdentifiers = (expression) => {
  const source = ts.createSourceFile(
    "audit-expression.ts",
    `const __auditExpression = (${expression});`,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const locals = new Set(["__auditExpression"]);
  const collectBindings = (name) => {
    if (ts.isIdentifier(name)) locals.add(name.text);
    else if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
      name.elements.forEach((element) => {
        if (ts.isBindingElement(element)) collectBindings(element.name);
      });
    }
  };
  const collectLocals = (node) => {
    if (ts.isParameter(node) || ts.isVariableDeclaration(node)) collectBindings(node.name);
    ts.forEachChild(node, collectLocals);
  };
  collectLocals(source);

  const names = new Set();
  const visit = (node) => {
    if (ts.isIdentifier(node)) {
      const parent = node.parent;
      const isPropertyName = (ts.isPropertyAccessExpression(parent) && parent.name === node)
        || (ts.isPropertyAssignment(parent) && parent.name === node && !ts.isShorthandPropertyAssignment(parent))
        || (ts.isMethodDeclaration(parent) && parent.name === node);
      const isDeclaration = (ts.isVariableDeclaration(parent) || ts.isParameter(parent)) && parent.name === node;
      if (!isPropertyName && !isDeclaration && !locals.has(node.text) && !ignoredIdentifiers.has(node.text)) {
        names.add(node.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return [...names].filter((name) => /^[A-Za-z_$]/.test(name));
};

const codeDependencies = (code) => {
  const names = new Set();
  const localAliases = new Set();
  for (const match of code.matchAll(/v-for\s*=\s*["']\s*(\([^)]*\)|[A-Za-z_$][\w$]*)\s+in\s+/g)) {
    for (const alias of (match[1] || "").matchAll(/[A-Za-z_$][\w$]*/g)) localAliases.add(alias[0]);
  }
  for (const match of code.matchAll(/\$\{([^}]+)\}/g)) {
    expressionIdentifiers(match[1] || "").forEach((name) => names.add(name));
  }
  for (const match of code.matchAll(/(?:@|:|v-)[\w:.-]+\s*=\s*["']([^"']+)["']/g)) {
    const expression = match[1] || "";
    const forMatch = expression.match(/^\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s+in\s+([\s\S]+)$/);
    expressionIdentifiers(forMatch?.[1] || expression).forEach((name) => names.add(name));
  }
  for (const match of code.matchAll(/\{\{([\s\S]*?)\}\}/g)) {
    expressionIdentifiers(match[1] || "").forEach((name) => names.add(name));
  }
  return [...names].filter((name) => !localAliases.has(name));
};

const uniqueRoutes = new Map();
for (const route of routes) {
  const pageDirectory = dirname(resolve(join(root, "src", "routes"), route.importPath));
  const key = relative(pagesRoot, pageDirectory).replaceAll("\\", "/");
  const current = uniqueRoutes.get(key) || { page: key, routes: [], pageDirectory };
  current.routes.push(route.path);
  uniqueRoutes.set(key, current);
}

const pages = [];
for (const entry of uniqueRoutes.values()) {
  const files = walk(entry.pageDirectory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));
  const testFiles = walk(entry.pageDirectory).filter((file) => file.endsWith(".test.ts"));
  const playgrounds = [];
  let h1 = "";
  let hasApi = false;

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const constants = stringConstants(source, file);
    h1 ||= source.match(/<h1>([^<]+)<\/h1>/)?.[1]?.trim() || "";
    hasApi ||= /<h2>\s*API\s*<\/h2>/i.test(source);

    for (const match of source.matchAll(/<elf-playground\b([\s\S]*?)>/g)) {
      const attributes = match[1] || "";
      const codeRef = expressionRef(attributes, "code");
      const scriptRef = expressionRef(attributes, "script");
      const code = codeRef ? constants.get(codeRef) || "" : "";
      const script = scriptRef ? constants.get(scriptRef) || "" : "";
      const signals = needsScript(code);
      const dependencies = codeDependencies(code);
      const scriptRequired = signals.event || signals.directive || /\bv-model/.test(code) || dependencies.length > 0;
      const missingScriptDependencies = dependencies.filter((name) =>
        !new RegExp(`\\b${name.replace(/[$]/g, "\\$")}\\b`).test(script)
      );
      playgrounds.push({
        file: relative(root, file).replaceAll("\\", "/"),
        title: literalAttribute(attributes, "title") || "(dynamic title)",
        codeRef,
        scriptRef,
        hasCode: Boolean(codeRef || literalAttribute(attributes, "code")),
        hasScript: Boolean(scriptRef || literalAttribute(attributes, "script")),
        resolvedCode: Boolean(code),
        resolvedScript: Boolean(script),
        needsScript: scriptRequired,
        signals,
        dependencies,
        missingScriptDependencies
      });
    }
  }

  pages.push({
    page: entry.page,
    category: entry.routes[0]?.split("/")[1] || "unknown",
    routes: entry.routes,
    h1,
    hasApi,
    testFiles: testFiles.map((file) => relative(root, file).replaceAll("\\", "/")),
    playgrounds
  });
}

pages.sort((a, b) => a.routes[0].localeCompare(b.routes[0]));
const playgrounds = pages.flatMap((page) => page.playgrounds.map((item) => ({ page: page.page, ...item })));
const result = {
  generatedAt: new Date().toISOString(),
  version: "0.0.2-beta.1",
  totals: {
    uniquePages: pages.length,
    routes: pages.reduce((sum, page) => sum + page.routes.length, 0),
    playgrounds: playgrounds.length,
    withScript: playgrounds.filter((item) => item.hasScript).length,
    withoutScript: playgrounds.filter((item) => !item.hasScript).length,
    missingRequiredScript: playgrounds.filter((item) => item.needsScript && !item.hasScript).length,
    incompleteScript: playgrounds.filter((item) => item.hasScript && item.missingScriptDependencies.length > 0).length,
    pagesWithTests: pages.filter((page) => page.testFiles.length > 0).length
  },
  missingRequiredScript: playgrounds.filter((item) => item.needsScript && !item.hasScript),
  pages
};

const mode = process.argv[2] || "--json";
if (mode === "--summary") {
  const categories = Object.groupBy(pages, (page) => page.category);
  const categoryRows = Object.entries(categories).map(([category, categoryPages]) => {
    const items = categoryPages.flatMap((page) => page.playgrounds);
    return {
      category,
      pages: categoryPages.length,
      playgrounds: items.length,
      withScript: items.filter((item) => item.hasScript).length,
      missingRequiredScript: items.filter((item) => item.needsScript && !item.hasScript).length,
      pagesWithTests: categoryPages.filter((page) => page.testFiles.length > 0).length
    };
  });
  process.stdout.write(`${JSON.stringify({ totals: result.totals, categories: categoryRows }, null, 2)}\n`);
} else if (mode === "--missing-script") {
  for (const item of result.missingRequiredScript) {
    const signals = Object.entries(item.signals).filter(([, active]) => active).map(([name]) => name).join(",");
    process.stdout.write(`${item.page}\t${item.file}\t${item.title}\t${item.codeRef}\t${signals}\n`);
  }
} else if (mode === "--incomplete-script") {
  for (const item of playgrounds.filter((entry) => entry.hasScript && entry.missingScriptDependencies.length > 0)) {
    process.stdout.write(`${item.page}\t${item.file}\t${item.title}\t${item.scriptRef}\t${item.missingScriptDependencies.join(",")}\n`);
  }
} else {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
