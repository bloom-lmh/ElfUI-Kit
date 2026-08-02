import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSpace } = await import("./index");
  pageTag = ensureCustomElement(PageSpace);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("SpacePage", () => {
  it("展示核心案例、源码和 API", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const playgrounds = page.shadowRoot?.querySelectorAll<HTMLElement & { code?: string }>(
      "elf-playground",
    );
    expect(playgrounds).toHaveLength(3);
    expect(page.shadowRoot?.querySelectorAll("elf-space").length).toBeGreaterThanOrEqual(7);
    expect(playgrounds?.[2]?.code).toContain("fill-ratio");
    expect(page.shadowRoot?.querySelectorAll("elf-props-table")).toHaveLength(2);
  });
});
