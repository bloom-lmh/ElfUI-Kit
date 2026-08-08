// cspell:words vuetifyjs

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  type Matrix,
  type MatrixEntry,
  type ParityMatrixExpectations,
  type Status,
  VALID_STATUSES,
  readParityMatrix,
  validateParityMatrix,
} from "./parity-matrix";

const repositoryRoot = resolve(".");
const jsonPath = join(
  repositoryRoot,
  "docs",
  "architecture",
  "vuetify-4.1.8-capability-matrix.json",
);

const expectations: ParityMatrixExpectations = {
  matrixLabel: "Vuetify",
  repositoryRoot,
  planPath: "docs/NEXT_GENERATION_PLAN.md",
  kind: "capability",
  upstreamPackage: "vuetify",
  upstreamVersion: "4.1.8",
  elfuiPackage: "@elfui/kit",
  elfuiVersion: "0.0.2-beta.2",
  idPrefix: "vuetify",
  sourceVersionToken: "v4.1.8",
};

const expectedIds: readonly string[] = [
  "vuetify.defaults",
  "vuetify.theme",
  "vuetify.locale",
  "vuetify.icons",
  "vuetify.display",
  "vuetify.layout",
  "vuetify.platform",
  "vuetify.date",
  "vuetify.goto",
  "vuetify.overlay",
  "vuetify.services",
  "vuetify.directives",
  "vuetify.aliases",
  "vuetify.tokens",
  "vuetify.ssr",
];

const expectedStatuses: Record<string, Status> = {
  "vuetify.defaults": "equivalent",
  "vuetify.theme": "equivalent",
  "vuetify.locale": "equivalent",
  "vuetify.icons": "equivalent",
  "vuetify.display": "equivalent",
  "vuetify.layout": "implement",
  "vuetify.platform": "implement",
  "vuetify.date": "equivalent",
  "vuetify.goto": "equivalent",
  "vuetify.overlay": "equivalent",
  "vuetify.services": "non-goal",
  "vuetify.directives": "equivalent",
  "vuetify.aliases": "implement",
  "vuetify.tokens": "equivalent",
  "vuetify.ssr": "implement",
};

function getEntry(matrix: Matrix, id: string): MatrixEntry {
  const entry = matrix.entries.find((e) => e.id === id);
  if (!entry) throw new Error(`Entry not found: ${id}`);
  return entry;
}

function cloneRaw(obj: unknown): Record<string, unknown> {
  return JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
}

describe("Vuetify capability matrix", () => {
  // ── readParityMatrix validates ────────────────────────────────────

  it("readParityMatrix succeeds on valid data", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    expect(matrix.schemaVersion).toBe(1);
    expect(matrix.entries).toHaveLength(15);
  });

  it("validateParityMatrix returns zero errors for valid data", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const errors = validateParityMatrix(matrix, expectations);
    expect(errors).toHaveLength(0);
  });

  // ── Entry coverage ─────────────────────────────────────────────────

  it("has exactly 15 entries with correct ids and expected statuses", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    expect(matrix.entries).toHaveLength(15);
    expect(matrix.entries.map((e) => e.id)).toEqual([...expectedIds]);
    for (const entry of matrix.entries) {
      expect(expectedStatuses[entry.id], entry.id).toBe(entry.status);
      expect(VALID_STATUSES).toContain(entry.status);
    }
  });

  it("has 10 equivalent, 4 implement, 1 non-goal — no legacy statuses", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    expect(matrix.entries.filter((e) => e.status === "equivalent")).toHaveLength(10);
    expect(matrix.entries.filter((e) => e.status === "implement")).toHaveLength(4);
    expect(matrix.entries.filter((e) => e.status === "combined")).toHaveLength(0);
    expect(matrix.entries.filter((e) => e.status === "non-goal")).toHaveLength(1);
  });

  // ── Gap assertions ─────────────────────────────────────────────────

  it("Layout, Platform, Aliases, SSR are implement with gap descriptions", () => {
    const matrix = readParityMatrix(jsonPath, expectations);

    const layout = getEntry(matrix, "vuetify.layout");
    expect(layout.status).toBe("implement");
    expect(layout.difference).toContain("No shared Kit owner");
    expect(layout.elfuiOwner.plannedTask).toBe("NG-500");

    const platform = getEntry(matrix, "vuetify.platform");
    expect(platform.status).toBe("implement");
    expect(platform.difference).toContain("no complete platform owner");
    expect(platform.elfuiOwner.plannedTask).toBe("NG-502");

    const aliases = getEntry(matrix, "vuetify.aliases");
    expect(aliases.status).toBe("implement");
    expect(aliases.difference).toContain("No shared alias resolver");
    expect(aliases.elfuiOwner.plannedTask).toBe("NG-506");

    const ssr = getEntry(matrix, "vuetify.ssr");
    expect(ssr.status).toBe("implement");
    expect(ssr.difference).toContain("no single platform/hydration owner");
    expect(ssr.elfuiOwner.plannedTask).toBe("NG-502");
  });

  it("Services is non-goal with service-defaults owner and Web Components rationale", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const s = getEntry(matrix, "vuetify.services");
    expect(s.status).toBe("non-goal");
    expect(s.elfuiOwner.current[0]).toContain("service-defaults.ts");
    expect(s.elfuiOwner.plannedTask).toBe("NG-307");
    expect(s.difference).toContain("Web Components");
  });

  it("Icons references resolveIcon, GoTo references goTo, Tokens references on-colors and NG-600", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    expect(getEntry(matrix, "vuetify.icons").difference).toContain("resolveIcon");
    expect(getEntry(matrix, "vuetify.goto").difference).toContain("goTo");
    expect(getEntry(matrix, "vuetify.tokens").difference).toContain("on-colors");
    expect(getEntry(matrix, "vuetify.tokens").difference).toContain("NG-600");
  });

  // ── Validation: source version pinning ────────────────────────────

  it("detects source URL missing the expected version token", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const eu = (raw.entries as Record<string, unknown>[])[1].upstream as Record<string, unknown>;
    eu.source = [
      "https://github.com/vuetifyjs/vuetify/blob/v9.9.9/packages/vuetify/src/composables/theme.ts",
    ];
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) =>
          e.startsWith("Vuetify") &&
          e.includes("vuetify.theme") &&
          e.includes("upstream.source") &&
          e.includes("v4.1.8"),
      ),
    ).toBe(true);
  });

  // ── Validation: implement missing plannedTask ─────────────────────

  it("detects implement entry with null plannedTask", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.layout");
    const eo = (raw.entries as Record<string, unknown>[])[idx].elfuiOwner as Record<
      string,
      unknown
    >;
    eo.plannedTask = null;
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some((e) => e.includes("vuetify.layout") && e.includes("requires a plannedTask")),
    ).toBe(true);
  });

  // ── Validation: implement empty tests/docs — field-level ───────────

  it("detects implement entry with empty tests — must be a non-empty array", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.layout");
    (raw.entries as Record<string, unknown>[])[idx].tests = [];
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) => e.includes("vuetify.layout") && e.includes("tests must be a non-empty array"),
      ),
    ).toBe(true);
  });

  it("detects implement entry with empty docs — must be a non-empty array", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.layout");
    (raw.entries as Record<string, unknown>[])[idx].docs = [];
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) => e.includes("vuetify.layout") && e.includes("docs must be a non-empty array"),
      ),
    ).toBe(true);
  });

  // ── Validation: equivalent only matrix test — no impl-focused test ──

  it("detects equivalent entry with only matrix test — no implementation-focused test", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.defaults");
    (raw.entries as Record<string, unknown>[])[idx].tests = [
      "scripts/vuetify-capability-matrix.test.ts",
    ];
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) => e.includes("vuetify.defaults") && e.includes("implementation-focused test"),
      ),
    ).toBe(true);
  });

  // ── Validation: path with duplicate slash ──────────────────────────

  it("detects path with duplicate slash — invalid segment", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.defaults");
    (raw.entries as Record<string, unknown>[])[idx].tests = [
      "packages/kit//src/Providers/DefaultsProvider/DefaultsProvider.test.ts",
    ];
    const errors = validateParityMatrix(raw, expectations);
    expect(errors.some((e) => e.includes("vuetify.defaults") && e.includes("segment"))).toBe(true);
  });

  // ── Validation: legacy references ─────────────────────────────────

  it("detects VU- reference in difference", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.defaults");
    (raw.entries as Record<string, unknown>[])[idx].difference = "See VU-01 for details";
    const errors = validateParityMatrix(raw, expectations);
    expect(errors.some((e) => e.includes("vuetify.defaults") && e.includes("legacy"))).toBe(true);
  });

  it("detects OP- reference in difference", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.overlay");
    (raw.entries as Record<string, unknown>[])[idx].difference = "Tracked by OP-07";
    const errors = validateParityMatrix(raw, expectations);
    expect(errors.some((e) => e.includes("vuetify.overlay") && e.includes("legacy"))).toBe(true);
  });

  // ── Validation: malformed entry ────────────────────────────────────

  it("detects null entry in entries array", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    (raw.entries as unknown[])[2] = null;
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some((e) => e.includes("Vuetify") && e.includes("entries[2]") && e.includes("null")),
    ).toBe(true);
  });

  it("detects non-goal missing Web Components rationale", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.services");
    (raw.entries as Record<string, unknown>[])[idx].difference = "Not needed.";
    const errors = validateParityMatrix(raw, expectations);
    expect(errors.some((e) => e.includes("vuetify.services") && e.includes("Web Components"))).toBe(
      true,
    );
  });

  // ── Validation: bad test/doc path ──────────────────────────────────

  it("detects non-existent test path", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.defaults");
    (raw.entries as Record<string, unknown>[])[idx].tests = [
      "packages/kit/src/nonexistent/test.ts",
    ];
    const errors = validateParityMatrix(raw, expectations);
    expect(errors.some((e) => e.includes("vuetify.defaults") && e.includes("file not found"))).toBe(
      true,
    );
  });

  it("detects absolute path in docs", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "vuetify.defaults");
    (raw.entries as Record<string, unknown>[])[idx].docs = ["/absolute/path/doc.ts"];
    const errors = validateParityMatrix(raw, expectations);
    expect(errors.some((e) => e.includes("vuetify.defaults") && e.includes("absolute"))).toBe(true);
  });

  // ── Human Markdown guide ───────────────────────────────────────────

  it("Markdown guide links JSON source of truth and mentions key gaps", () => {
    const markdownPath = join(
      repositoryRoot,
      "docs",
      "architecture",
      "2026-07-31-vuetify-capability-matrix.md",
    );
    const md = readFileSync(markdownPath, "utf8");
    expect(md).toContain("vuetify-4.1.8-capability-matrix.json");
    expect(md).toContain("single source of truth");
    expect(md).toContain("vuetify@4.1.8");
    expect(md).toContain("Layout");
    expect(md).toContain("Platform");
    expect(md).toContain("Aliases");
    expect(md).toContain("SSR");
    expect(md).toContain("Services");
  });
});
