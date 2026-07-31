import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const auditScript = resolve("scripts/audit-docs-locale.mjs");
const fixtureRoots: string[] = [];

const createFixture = async (localized: boolean): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), "elfui-locale-audit-"));
  const pageDirectory = join(root, "src", "pages", "ExamplePage");
  fixtureRoots.push(root);
  await mkdir(pageDirectory, { recursive: true });
  await writeFile(
    join(pageDirectory, "index.ts"),
    localized
      ? 'import { createDocsTranslator } from "./docsLocale";\ncreateDocsTranslator({});\n'
      : "export const Page = {};\n",
    "utf8",
  );
  return root;
};

/**
 * Runs the public CLI against an isolated docs tree so exit semantics are tested end to end.
 */
const runAudit = (root: string, args: string[] = []) =>
  spawnSync(process.execPath, [auditScript, ...args], {
    cwd: root,
    encoding: "utf8",
  });

afterEach(async () => {
  await Promise.all(
    fixtureRoots.splice(0).map((root) => rm(root, { force: true, recursive: true })),
  );
});

describe("documentation locale audit CLI", () => {
  it("fails by default when a docs target is not localized", async () => {
    const result = runAudit(await createFixture(false));

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("0/1 localized, 1 missing");
    expect(result.stdout).toContain("src/pages/ExamplePage/index.ts");
  });

  it("supports a report-only mode for non-blocking diagnostics", async () => {
    const result = runAudit(await createFixture(false), ["--report-only"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("0/1 localized, 1 missing");
  });

  it("passes by default when every docs target is localized", async () => {
    const result = runAudit(await createFixture(true));

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("1/1 localized, 0 missing");
  });
});
