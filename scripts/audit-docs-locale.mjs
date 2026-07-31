import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const root = process.cwd();
const pagesRoot = join(root, "src", "pages");
const targetName = /^(?:index|props|ex\d+)\.ts$/;
const reportOnly = process.argv.includes("--report-only");
const categoryOf = (file) => {
  const name = file.replaceAll("\\", "/").split("/").at(-1) || "";
  if (name === "index.ts") return "pages";
  if (name === "props.ts") return "props";
  return "examples";
};

const files = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (extname(entry.name) === ".ts" && targetName.test(entry.name)) files.push(path);
  }
};
walk(pagesRoot);

const records = files.map((file) => {
  const source = readFileSync(file, "utf8");
  return {
    file: relative(root, file).split(sep).join("/"),
    category: categoryOf(file),
    localized: /createDocs(?:Translator|Picker)/.test(source),
  };
});

const categories = ["pages", "examples", "props"];
const summary = Object.fromEntries(
  categories.map((category) => {
    const scoped = records.filter((record) => record.category === category);
    const localized = scoped.filter((record) => record.localized).length;
    return [category, { total: scoped.length, localized, missing: scoped.length - localized }];
  }),
);
const missing = records.filter((record) => !record.localized);

if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify({ summary, missing }, null, 2)}\n`);
} else {
  console.log("Documentation locale coverage");
  for (const category of categories) {
    const item = summary[category];
    console.log(
      `${category.padEnd(8)} ${String(item.localized).padStart(3)}/${String(item.total).padEnd(3)} localized, ${item.missing} missing`,
    );
  }
  console.log(
    `total    ${records.length - missing.length}/${records.length} localized, ${missing.length} missing`,
  );
  if (missing.length) {
    console.log("\nMissing files:");
    for (const record of missing) console.log(record.file);
  }
}

if (!reportOnly && missing.length) process.exitCode = 1;
