import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let controlledTag = "";
let dynamicTag = "";
let nestedTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageCollapseEx1 } = await import("./ex1");
  const { PageCollapseEx2 } = await import("./ex2");
  const { PageCollapseEx3 } = await import("./ex3");
  controlledTag = ensureCustomElement(PageCollapseEx1);
  dynamicTag = ensureCustomElement(PageCollapseEx2);
  nestedTag = ensureCustomElement(PageCollapseEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Collapse documentation", () => {
  it("keeps the controlled accordion and disabled state synchronized", async () => {
    const page = document.createElement(controlledTag);
    document.body.appendChild(page);
    await tick();

    const collapse = page.shadowRoot!.querySelector<HTMLElement>("elf-collapse")!;
    const headers = collapse.shadowRoot!.querySelectorAll<HTMLButtonElement>(".header");
    expect(headers).toHaveLength(3);
    expect(headers[0]!.getAttribute("aria-expanded")).toBe("true");
    expect(headers[2]!.disabled).toBe(true);

    page.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="deployment"]')!.click();
    await tick();
    expect(headers[1]!.getAttribute("aria-expanded")).toBe("true");
    expect(headers[0]!.getAttribute("aria-expanded")).toBe("false");
  });

  it("adds and removes panels while keeping the controlled open set valid", async () => {
    const page = document.createElement(dynamicTag);
    document.body.appendChild(page);
    await tick();

    const collapse = page.shadowRoot!.querySelector<HTMLElement>("elf-collapse")!;
    const headers = (): NodeListOf<HTMLButtonElement> =>
      collapse.shadowRoot!.querySelectorAll<HTMLButtonElement>(".header");
    expect(headers()).toHaveLength(3);

    page.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="add"]')!.click();
    await tick();
    expect(headers()).toHaveLength(4);

    headers()[3]!.click();
    await tick();
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("已展开 2");

    page.shadowRoot!.querySelector<HTMLButtonElement>('[data-action="remove"]')!.click();
    await tick();
    expect(headers()).toHaveLength(3);
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("已展开 1");
  });

  it("keeps nested model updates isolated from the outer panel", async () => {
    const page = document.createElement(nestedTag);
    document.body.appendChild(page);
    await tick();

    const collapses = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-collapse");
    expect(collapses).toHaveLength(2);
    const nestedItems = collapses[1]!.querySelectorAll("elf-collapse-item");
    nestedItems[1]!.shadowRoot!.querySelector<HTMLButtonElement>(".header")!.click();
    await tick();

    const status = page.shadowRoot!.querySelector('[slot="status"]')?.textContent ?? "";
    expect(status).toContain("外层 · account");
    expect(status).toContain("内层 · security, sessions");
  });
});
