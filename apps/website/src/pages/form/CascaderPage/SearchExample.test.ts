import { afterEach, beforeAll, describe, expect, it } from "vitest";

let searchExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageCascaderEx6 } = await import("./ex6");
  searchExampleTag = ensureCustomElement(PageCascaderEx6);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("Cascader searchable path example", () => {
  it("owns its update handler and closes safely after selecting a result", async () => {
    const page = document.createElement(searchExampleTag);
    document.body.appendChild(page);
    await wait();

    const cascader = page.shadowRoot!.querySelector<HTMLElement>("elf-cascader")!;
    const trigger = cascader.shadowRoot!.querySelector<HTMLButtonElement>(".trigger")!;
    trigger.click();
    await wait();

    const input = cascader.shadowRoot!.querySelector<HTMLInputElement>(".filter-input")!;
    input.value = "杭州";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await wait(320);

    const option = cascader.shadowRoot!.querySelector<HTMLButtonElement>(".filter-option")!;
    option.focus();
    option.click();
    await wait();

    expect(cascader.hasAttribute("data-open")).toBe(false);
    expect(cascader.shadowRoot!.activeElement).toBe(trigger);
    const playground = page.shadowRoot!.querySelector<HTMLElement & { script?: string }>(
      "elf-playground",
    )!;
    expect(playground.script).toContain("onSearchUpdate");
  });
});
