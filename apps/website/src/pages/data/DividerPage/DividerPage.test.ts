import { afterEach, beforeAll, describe, expect, it } from "vitest";

let stylesExampleTag = "";
let rtlExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageDividerEx1 } = await import("./ex1");
  const { PageDividerEx2 } = await import("./ex2");
  stylesExampleTag = ensureCustomElement(PageDividerEx1);
  rtlExampleTag = ensureCustomElement(PageDividerEx2);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Divider documentation", () => {
  it("combines line styles and text positions into one comparison matrix", async () => {
    const page = document.createElement(stylesExampleTag);
    document.body.appendChild(page);
    await tick();

    const dividers = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-divider");
    expect(dividers).toHaveLength(4);
    expect(Array.from(dividers, (divider) => divider.getAttribute("border-style"))).toEqual([
      "solid",
      "dashed",
      "dotted",
      "double",
    ]);
    expect(Array.from(dividers, (divider) => divider.getAttribute("content-position"))).toEqual([
      "left",
      "center",
      "right",
      "center",
    ]);
    expect(
      Array.from(dividers).every((divider) => divider.getAttribute("role") === "separator"),
    ).toBe(true);
  });

  it("switches writing direction while preserving vertical separator semantics", async () => {
    const page = document.createElement(rtlExampleTag);
    document.body.appendChild(page);
    await tick();

    const stage = page.shadowRoot!.querySelector<HTMLElement>(".divider-rtl-stage")!;
    expect(stage.getAttribute("dir")).toBe("ltr");

    page.shadowRoot!.querySelector<HTMLButtonElement>(".divider-demo-actions button")!.click();
    await tick();

    expect(stage.getAttribute("dir")).toBe("rtl");
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("从右到左");
    const vertical = page.shadowRoot!.querySelector<HTMLElement>(
      'elf-divider[direction="vertical"]',
    )!;
    expect(vertical.getAttribute("aria-orientation")).toBe("vertical");
  });
});
