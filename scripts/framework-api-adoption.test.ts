import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(".");
const kitPath = (path: string): string => join("packages", "kit", path);
const matrixPath = join(
  repositoryRoot,
  "docs",
  "architecture",
  "2026-07-31-framework-api-adoption-matrix.md",
);
const matrix = readFileSync(matrixPath, "utf8");

const capabilities = [
  "Lifecycle",
  "Reactivity",
  "DOM events",
  "Observers",
  "Scroll lock",
  "Focus",
  "Form",
  "Teleport",
  "Transition",
  "TransitionGroup",
] as const;

type Status = "native" | "equivalent" | "adapter" | "missing";

interface MatrixRow {
  capability: string;
  authority: string;
  owner: string;
  status: Status;
  followUp: string;
}

/** Reads the five-column matrix while keeping the status vocabulary closed. */
const readRows = (): MatrixRow[] =>
  matrix
    .split("\n")
    .filter((line) => line.startsWith("| **") && !line.startsWith("| **Capability**"))
    .map((line) => {
      const columns = line
        .split("|")
        .slice(1, -1)
        .map((column) => column.trim());
      const [capabilityCell, authority, owner, statusCell, followUp] = columns;
      const capability = capabilityCell?.match(/^\*\*(.+?)\*\*$/)?.[1] ?? "";
      const status = statusCell?.replaceAll("`", "") as Status;
      return { capability, authority, owner, status, followUp };
    });

const expectedStatuses: Record<(typeof capabilities)[number], Status> = {
  Lifecycle: "equivalent",
  Reactivity: "native",
  "DOM events": "equivalent",
  Observers: "adapter",
  "Scroll lock": "equivalent",
  Focus: "adapter",
  Form: "adapter",
  Teleport: "native",
  Transition: "missing",
  TransitionGroup: "missing",
};

describe("framework API adoption matrix", () => {
  it("covers the OP-03 capability order and closed status vocabulary", () => {
    const rows = readRows();
    expect(rows).toHaveLength(capabilities.length);
    expect(rows.map((row) => row.capability)).toEqual([...capabilities]);
    for (const row of rows) {
      expect(["native", "equivalent", "adapter", "missing"]).toContain(row.status);
      expect(expectedStatuses[row.capability as (typeof capabilities)[number]]).toBe(row.status);
    }
  });

  it("records authority, owner, and an actionable boundary for every row", () => {
    for (const row of readRows()) {
      expect(row.authority).toContain("E:\\elfui-docs\\en\\");
      expect(row.owner).toContain("src/");
      expect(row.followUp.length).toBeGreaterThan(24);
    }
  });

  it("locks the shared resource owners and prevents the removed duplicates", () => {
    const source = (path: string): string => readFileSync(join(repositoryRoot, path), "utf8");
    const dialog = source(kitPath("src/components/Feedback/Dialog/index.ts"));

    expect(existsSync(join(repositoryRoot, kitPath("src/composables/useModalOverlay.ts")))).toBe(
      true,
    );
    expect(
      existsSync(join(repositoryRoot, kitPath("src/composables/useDismissibleOverlay.ts"))),
    ).toBe(true);
    expect(source(kitPath("src/composables/useModalOverlay.ts"))).toContain("useEventListener");
    expect(source(kitPath("src/composables/useDismissibleOverlay.ts"))).toContain(
      "useEventListener",
    );
    expect(source(kitPath("src/composables/useModalOverlay.ts"))).not.toContain(
      "document.addEventListener",
    );
    expect(source(kitPath("src/composables/useDismissibleOverlay.ts"))).not.toContain(
      "document.addEventListener",
    );
    expect(source(kitPath("src/components/Feedback/Loading/service.ts"))).toContain(
      "el.lock = options.lock ?? false",
    );
    expect(source(kitPath("src/components/Feedback/Loading/service.ts"))).not.toContain(
      "body.style.overflow",
    );
    expect(dialog).toContain("<Transition");
    expect(dialog).not.toContain("setTimeout");
    expect(matrix).toContain("first verified Core `<Transition>` owner");
    expect(matrix).toContain("does not close `OP-04`, `OP-05`, `OP-06`, or `OP-07`");
  });
});
