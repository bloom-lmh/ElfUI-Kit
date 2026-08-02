import { beforeAll, beforeEach, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../index");
});

beforeEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-masonry", () => {
  it("normalizes columns, width and gap to host variables", async () => {
    const el = document.createElement("elf-masonry") as HTMLElement & Record<string, unknown>;
    el.columns = 4;
    el.minColumnWidth = "260";
    el.gap = "lg";
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_columns")).toBe("4");
    expect(el.style.getPropertyValue("--_min-column-width")).toBe("260px");
    expect(el.style.getPropertyValue("--_gap")).toBe("var(--elf-space-6)");
  });

  it("keeps slotted cards in the light DOM", async () => {
    const el = document.createElement("elf-masonry");
    el.innerHTML = "<article>A</article><article>B</article>";
    document.body.appendChild(el);
    await tick();
    expect(el.children).toHaveLength(2);
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });
});
