import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { compileMacroComponent } from "@elfui/compiler/macro-component";
import { describe, expect, it } from "vitest";

const srcRoot = join(process.cwd(), "src");
const componentsRoot = join(srcRoot, "components");

const collectSourceFiles = (dir: string): string[] => {
  const files: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "__tests__") continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }
    if (!entry.name.endsWith(".ts")) continue;
    if (entry.name.endsWith(".d.ts") || entry.name.endsWith(".test.ts")) continue;
    files.push(fullPath);
  }

  return files;
};

const sourceFiles = collectSourceFiles(srcRoot);
const componentFiles = collectSourceFiles(componentsRoot);

const toRelativePath = (file: string): string => relative(srcRoot, file).replace(/\\/g, "/");

const toRelativeComponentPath = (file: string): string =>
  relative(componentsRoot, file).replace(/\\/g, "/");

const read = (file: string): string => readFileSync(file, "utf8");

describe("ui-kit macro migration", () => {
  it("keeps non-test source off the builder API", () => {
    const offenders = sourceFiles
      .filter((file) => read(file).includes("ElfUI.create" + "Component("))
      .map(toRelativePath);

    expect(offenders).toEqual([]);
  });

  it("exports defineHtml component files for automatic macro detection", () => {
    const offenders = sourceFiles
      .filter((file) => {
        const code = read(file);
        const isComponentFile = /defineHtml(?:<[^>]+>)?\s*\(\s*html/.test(code);
        const hasNamedExport = /export\s*\{[^}]+\}/.test(code);
        const hasInlineExport = /export\s+(?:default\s+)?(?:const\s+\w+\s*=\s*)?defineHtml/.test(
          code,
        );
        return isComponentFile && !hasNamedExport && !hasInlineExport;
      })
      .map(toRelativePath);

    expect(offenders).toEqual([]);
  });

  it("keeps ui-kit component implementations on defineHtml constructors", () => {
    const offenders = componentFiles
      .filter((file) => {
        const code = read(file);
        return (
          code.includes("defineName(") ||
          code.includes("defineOptions({ register: false })") ||
          code.includes("export default " + "html")
        );
      })
      .map(toRelativeComponentPath);

    expect(offenders).toEqual([]);
  });

  it("keeps page and app macros on defineHtml constructors", () => {
    const offenders = sourceFiles
      .filter((file) => read(file).includes("export default " + "html"))
      .map(toRelativePath);

    expect(offenders).toEqual([]);
  });

  it("keeps component group entries on explicit registerComponents calls", () => {
    const offenders = componentFiles
      .filter((file) => /import\s+["']\.\/[^"']+\/index["'];/.test(read(file)))
      .map(toRelativeComponentPath);

    expect(offenders).toEqual([]);
  });

  it("type-checks real ui-kit local component props and events through useComponents", () => {
    const result = compileMacroComponent(
      `
import { defineHtml,
  useComponents
} from "@elfui/core";
import { Button } from "../../components/Basic/Button/index";
import { Badge } from "../../components/Basic/Badge/index";

useComponents(Button, Badge);

export const Probe = defineHtml(\`
  <Button variant="not-real" @typo=\${() => undefined}>
    <template #ghost>Ghost</template>
  </Button>
  <Badge :value=\${true}></Badge>
\`);
      `,
      {
        filename: join(srcRoot, "app", "__tests__", "local-component-probe.ts"),
        templateTypeCheck: true,
      },
    );

    const messages = result.diagnostics.map((diagnostic) => diagnostic.message).join("\n");

    expect(messages).toContain("ButtonVariant");
    expect(messages).toContain("not-real");
    expect(messages).toContain("typo");
    expect(messages).toContain("ghost");
    expect(messages).toContain("string | number");
  });
});
