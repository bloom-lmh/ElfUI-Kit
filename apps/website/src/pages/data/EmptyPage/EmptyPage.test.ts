import { afterEach, beforeAll, describe, expect, it } from "vitest";

let densityExampleTag = "";
let searchExampleTag = "";
let actionExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageEmptyEx1 } = await import("./ex1");
  const { PageEmptyEx2 } = await import("./ex2");
  const { PageEmptyEx3 } = await import("./ex3");
  densityExampleTag = ensureCustomElement(PageEmptyEx1);
  searchExampleTag = ensureCustomElement(PageEmptyEx2);
  actionExampleTag = ensureCustomElement(PageEmptyEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Empty documentation", () => {
  it("compares default and compact density", async () => {
    const page = document.createElement(densityExampleTag);
    document.body.appendChild(page);
    await tick();

    const emptyStates = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-empty");
    expect(emptyStates).toHaveLength(2);
    expect(emptyStates[0]?.getAttribute("size")).toBe("default");
    expect(emptyStates[1]?.getAttribute("size")).toBe("compact");
    expect(emptyStates[1]?.style.getPropertyValue("--_empty-image-size")).toBe("72px");
  });

  it("resets and reruns a search without results", async () => {
    const page = document.createElement(searchExampleTag);
    document.body.appendChild(page);
    await tick();

    expect(page.shadowRoot!.querySelector("elf-empty")).toBeTruthy();
    page.shadowRoot!.querySelector<HTMLElement>("elf-empty elf-button")!.click();
    await tick();
    expect(page.shadowRoot!.querySelector("elf-empty")).toBeNull();
    expect(page.shadowRoot!.querySelectorAll(".empty-result-list article")).toHaveLength(3);

    page.shadowRoot!.querySelector<HTMLButtonElement>(".empty-demo-command")!.click();
    await tick();
    expect(page.shadowRoot!.querySelector("elf-empty")).toBeTruthy();
  });

  it("creates and resets the first project from the empty action area", async () => {
    const page = document.createElement(actionExampleTag);
    document.body.appendChild(page);
    await tick();

    const buttons = page.shadowRoot!.querySelectorAll<HTMLElement>(
      ".empty-first-use-panel elf-button",
    );
    expect(buttons).toHaveLength(2);
    buttons[1]!.click();
    await tick();

    expect(page.shadowRoot!.querySelector("elf-empty")).toBeNull();
    expect(page.shadowRoot!.querySelector(".empty-created-project")).toBeTruthy();

    page.shadowRoot!.querySelector<HTMLButtonElement>(".empty-demo-command")!.click();
    await tick();
    expect(page.shadowRoot!.querySelector("elf-empty")).toBeTruthy();
  });
});
