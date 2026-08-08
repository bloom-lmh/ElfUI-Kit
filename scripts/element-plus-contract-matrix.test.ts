// cspell:words Cascader

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
  "element-plus-2.14.4-contract-matrix.json",
);

const expectations: ParityMatrixExpectations = {
  matrixLabel: "Element Plus",
  repositoryRoot,
  planPath: "docs/NEXT_GENERATION_PLAN.md",
  kind: "contract",
  upstreamPackage: "element-plus",
  upstreamVersion: "2.14.4",
  elfuiPackage: "@elfui/kit",
  elfuiVersion: "0.0.2-beta.2",
  idPrefix: "element-plus",
  sourceVersionToken: "2.14.4",
};

const expectedIds: readonly string[] = [
  "element-plus.form",
  "element-plus.date-picker",
  "element-plus.time-picker",
  "element-plus.tabs",
  "element-plus.upload",
  "element-plus.table",
  "element-plus.cascader",
  "element-plus.tree",
  "element-plus.menu",
  "element-plus.select",
  "element-plus.scoped-slots",
];

const expectedStatuses: Record<string, Status> = {
  "element-plus.form": "equivalent",
  "element-plus.date-picker": "equivalent",
  "element-plus.time-picker": "equivalent",
  "element-plus.tabs": "equivalent",
  "element-plus.upload": "equivalent",
  "element-plus.table": "equivalent",
  "element-plus.cascader": "implement",
  "element-plus.tree": "equivalent",
  "element-plus.menu": "equivalent",
  "element-plus.select": "equivalent",
  "element-plus.scoped-slots": "implement",
};

function getEntry(matrix: Matrix, id: string): MatrixEntry {
  const entry = matrix.entries.find((e) => e.id === id);
  if (!entry) throw new Error(`Entry not found: ${id}`);
  return entry;
}

function cloneRaw(obj: unknown): Record<string, unknown> {
  return JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
}

describe("Element Plus public contract matrix", () => {
  // ── readParityMatrix validates ────────────────────────────────────

  it("readParityMatrix succeeds on valid data", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    expect(matrix.schemaVersion).toBe(1);
    expect(matrix.entries).toHaveLength(11);
  });

  it("validateParityMatrix returns zero errors for valid data", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const errors = validateParityMatrix(matrix, expectations);
    expect(errors).toHaveLength(0);
  });

  // ── Entry coverage ─────────────────────────────────────────────────

  it("has exactly 11 entries with correct ids and expected statuses", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    expect(matrix.entries).toHaveLength(11);
    expect(matrix.entries.map((e) => e.id)).toEqual([...expectedIds]);
    for (const entry of matrix.entries) {
      expect(expectedStatuses[entry.id], entry.id).toBe(entry.status);
      expect(VALID_STATUSES).toContain(entry.status);
    }
  });

  it("has 9 equivalent, 2 implement — no legacy statuses", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    expect(matrix.entries.filter((e) => e.status === "equivalent")).toHaveLength(9);
    expect(matrix.entries.filter((e) => e.status === "implement")).toHaveLength(2);
    expect(matrix.entries.filter((e) => e.status === "combined")).toHaveLength(0);
    expect(matrix.entries.filter((e) => e.status === "non-goal")).toHaveLength(0);
  });

  // ── Gap assertions ─────────────────────────────────────────────────

  it("Cascader is implement — change payload gap documented", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const c = getEntry(matrix, "element-plus.cascader");
    expect(c.status).toBe("implement");
    expect(c.difference).toContain("CascaderChangeDetail");
    expect(c.difference).toContain("change(value)");
    expect(c.elfuiOwner.plannedTask).toBe("NG-421");
  });

  it("Scoped Slots is implement — compiler contract gap documented", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const s = getEntry(matrix, "element-plus.scoped-slots");
    expect(s.status).toBe("implement");
    expect(s.difference).toContain("fake slot event");
    expect(s.elfuiOwner.plannedTask).toBe("NG-403");
  });

  it("Menu equivalent documents routerResult as not copied", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const m = getEntry(matrix, "element-plus.menu");
    expect(m.status).toBe("equivalent");
    expect(m.difference).toContain("routerResult");
  });

  // ── Validation: bad source version pinning ────────────────────────

  it("detects source URL missing the expected version token in label: id: field format", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const eu = (raw.entries as Record<string, unknown>[])[0].upstream as Record<string, unknown>;
    eu.source = ["https://unpkg.com/element-plus@9.9.9/es/components/form/src/form.mjs"];
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) =>
          e.startsWith("Element Plus") &&
          e.includes("element-plus.form") &&
          e.includes("upstream.source") &&
          e.includes("2.14.4"),
      ),
    ).toBe(true);
  });

  // ── Validation: implement missing plannedTask ─────────────────────

  it("detects implement entry with null plannedTask", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "element-plus.cascader");
    const eo = (raw.entries as Record<string, unknown>[])[idx].elfuiOwner as Record<
      string,
      unknown
    >;
    eo.plannedTask = null;
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) => e.includes("element-plus.cascader") && e.includes("requires a plannedTask"),
      ),
    ).toBe(true);
  });

  // ── Validation: implement empty tests/docs — field-level ───────────

  it("detects implement entry with empty tests — must be a non-empty array", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "element-plus.cascader");
    (raw.entries as Record<string, unknown>[])[idx].tests = [];
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) => e.includes("element-plus.cascader") && e.includes("tests must be a non-empty array"),
      ),
    ).toBe(true);
  });

  it("detects implement entry with empty docs — must be a non-empty array", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "element-plus.cascader");
    (raw.entries as Record<string, unknown>[])[idx].docs = [];
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) => e.includes("element-plus.cascader") && e.includes("docs must be a non-empty array"),
      ),
    ).toBe(true);
  });

  // ── Validation: equivalent only matrix test — no impl-focused test ──

  it("detects equivalent entry with only matrix test — no implementation-focused test", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "element-plus.form");
    (raw.entries as Record<string, unknown>[])[idx].tests = [
      "scripts/element-plus-contract-matrix.test.ts",
    ];
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) => e.includes("element-plus.form") && e.includes("implementation-focused test"),
      ),
    ).toBe(true);
  });

  // ── Validation: path with duplicate slash ──────────────────────────

  it("detects path with duplicate slash — invalid segment", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "element-plus.form");
    (raw.entries as Record<string, unknown>[])[idx].tests = ["packages/kit//src/Form/Form.test.ts"];
    const errors = validateParityMatrix(raw, expectations);
    expect(errors.some((e) => e.includes("element-plus.form") && e.includes("segment"))).toBe(true);
  });

  // ── Validation: legacy references ─────────────────────────────────

  it("detects EP- reference in difference", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "element-plus.form");
    (raw.entries as Record<string, unknown>[])[idx].difference = "Tracked by EP-01";
    const errors = validateParityMatrix(raw, expectations);
    expect(errors.some((e) => e.includes("element-plus.form") && e.includes("legacy"))).toBe(true);
  });

  it("detects OP- reference in difference", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "element-plus.form");
    (raw.entries as Record<string, unknown>[])[idx].difference = "Tracked by OP-03";
    const errors = validateParityMatrix(raw, expectations);
    expect(errors.some((e) => e.includes("element-plus.form") && e.includes("legacy"))).toBe(true);
  });

  // ── Validation: malformed entry ────────────────────────────────────

  it("detects null entry in entries array", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    (raw.entries as unknown[])[0] = null;
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some(
        (e) => e.includes("Element Plus") && e.includes("entries[0]") && e.includes("null"),
      ),
    ).toBe(true);
  });

  // ── Validation: bad test/doc path ──────────────────────────────────

  it("detects non-existent test path", () => {
    const matrix = readParityMatrix(jsonPath, expectations);
    const raw = cloneRaw(matrix);
    const idx = matrix.entries.findIndex((e) => e.id === "element-plus.form");
    (raw.entries as Record<string, unknown>[])[idx].tests = [
      "packages/kit/src/nonexistent/test.ts",
    ];
    const errors = validateParityMatrix(raw, expectations);
    expect(
      errors.some((e) => e.includes("element-plus.form") && e.includes("file not found")),
    ).toBe(true);
  });

  // ── Human Markdown guide ───────────────────────────────────────────

  it("Markdown guide links JSON source of truth and mentions key gaps", () => {
    const markdownPath = join(
      repositoryRoot,
      "docs",
      "architecture",
      "2026-07-31-element-plus-contract-matrix.md",
    );
    const md = readFileSync(markdownPath, "utf8");
    expect(md).toContain("element-plus-2.14.4-contract-matrix.json");
    expect(md).toContain("single source of truth");
    expect(md).toContain("element-plus@2.14.4");
    expect(md).toContain("Cascader");
    expect(md).toContain("Scoped Slots");
  });
});
