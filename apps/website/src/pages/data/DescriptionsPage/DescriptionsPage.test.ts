import { afterEach, beforeAll, describe, expect, it } from "vitest";

let responsiveExampleTag = "";
let variantsExampleTag = "";
let slotsExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageDescriptionsEx1 } = await import("./ex1");
  const { PageDescriptionsEx2 } = await import("./ex2");
  const { PageDescriptionsEx3 } = await import("./ex3");
  responsiveExampleTag = ensureCustomElement(PageDescriptionsEx1);
  variantsExampleTag = ensureCustomElement(PageDescriptionsEx2);
  slotsExampleTag = ensureCustomElement(PageDescriptionsEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Descriptions documentation", () => {
  it("demonstrates field mapping, long content, and empty-value formatting", async () => {
    const page = document.createElement(responsiveExampleTag);
    document.body.appendChild(page);
    await tick();

    const descriptions = page.shadowRoot!.querySelector<HTMLElement>("elf-descriptions")!;
    const text = descriptions.shadowRoot!.textContent ?? "";
    expect(descriptions.getAttribute("responsive")).toBe("");
    expect(text).toContain("v0.0.2-beta.1");
    expect(text).toContain("https://api.elfui.dev");
    expect(text).toContain("暂未填写");

    page.shadowRoot!.querySelector<HTMLButtonElement>('[data-width="compact"]')!.click();
    await tick();
    expect(page.shadowRoot!.querySelector(".descriptions-responsive-frame")?.className).toContain(
      "is-compact",
    );
  });

  it("switches direction and density from the Playground title row", async () => {
    const page = document.createElement(variantsExampleTag);
    document.body.appendChild(page);
    await tick();

    const descriptions = page.shadowRoot!.querySelector<HTMLElement>("elf-descriptions")!;
    page.shadowRoot!.querySelector<HTMLButtonElement>('[data-direction="vertical"]')!.click();
    page.shadowRoot!.querySelector<HTMLButtonElement>('[data-size="lg"]')!.click();
    await tick();

    expect(descriptions.getAttribute("direction")).toBe("vertical");
    expect(descriptions.getAttribute("size")).toBe("lg");
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("垂直");
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("宽松");
  });

  it("uses title and action slots without shortcut props and reveals the empty slot", async () => {
    const page = document.createElement(slotsExampleTag);
    document.body.appendChild(page);
    await tick();

    const descriptions = page.shadowRoot!.querySelector<HTMLElement>("elf-descriptions")!;
    expect(descriptions.hasAttribute("title")).toBe(false);
    expect(descriptions.querySelectorAll("elf-descriptions-item")).toHaveLength(4);
    expect(descriptions.shadowRoot!.querySelector<HTMLElement>(".header")!.style.display).not.toBe(
      "none",
    );

    page.shadowRoot!.querySelector<HTMLButtonElement>(".descriptions-slot-action")!.click();
    await tick();

    expect(descriptions.querySelectorAll("elf-descriptions-item")).toHaveLength(0);
    expect(descriptions.shadowRoot!.querySelector(".empty")).toBeTruthy();
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("空集合");
  });
});
