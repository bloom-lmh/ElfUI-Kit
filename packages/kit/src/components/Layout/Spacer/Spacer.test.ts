import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-spacer", () => {
  it("注册为无交互、无插槽的弹性占位元素", async () => {
    const spacer = document.createElement("elf-spacer");
    document.body.appendChild(spacer);
    await tick();

    expect(customElements.get("elf-spacer")).toBeTruthy();
    expect(spacer.shadowRoot?.querySelector("slot, button, input, [tabindex]")).toBeNull();
  });

  it("注入 Shadow DOM 样式", async () => {
    const spacer = document.createElement("elf-spacer");
    document.body.appendChild(spacer);
    await tick();

    const adopted = spacer.shadowRoot?.adoptedStyleSheets?.length ?? 0;
    const styleTags = spacer.shadowRoot?.querySelectorAll("style").length ?? 0;
    expect(adopted + styleTags).toBeGreaterThan(0);
  });
});
