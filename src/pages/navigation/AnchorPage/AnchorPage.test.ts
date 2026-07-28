import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let exampleTag = "";
let basicExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageAnchorEx2 } = await import("./ex2");
  const { PageAnchorEx1 } = await import("./ex1");
  exampleTag = ensureCustomElement(PageAnchorEx2);
  basicExampleTag = ensureCustomElement(PageAnchorEx1);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("Anchor documentation", () => {
  it("lets the basic example disable smooth scrolling", async () => {
    const page = document.createElement(basicExampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const root = page.shadowRoot!;
    const container = root.querySelector<HTMLElement>("#anchor-basic-scroll")!;
    const anchor = root.querySelector<HTMLElement>("elf-anchor")!;
    const checkbox = root.querySelector<HTMLElement>("elf-checkbox-group")!;

    expect(container.style.scrollBehavior).toBe("");
    const option = checkbox.shadowRoot!.querySelector<HTMLElement>("elf-checkbox")!;
    (option.shadowRoot!.querySelector(".box") as HTMLElement).click();
    await tick();
    await tick();
    expect((anchor as HTMLElement & { smooth?: boolean }).smooth).toBe(false);
  });

  it("keeps the horizontal navigation synchronized with its scroll container", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const anchor = page.shadowRoot!.querySelector<HTMLElement>('elf-anchor[direction="horizontal"]')!;
    const container = page.shadowRoot!.querySelector<HTMLElement>("#anchor-horizontal-scroll")!;
    (anchor as HTMLElement & { smooth?: boolean }).smooth = false;
    await tick();
    Object.defineProperties(container, {
      clientWidth: { configurable: true, value: 640 },
      scrollWidth: { configurable: true, value: 4480 },
      scrollLeft: { configurable: true, value: 0, writable: true }
    });
    container.getBoundingClientRect = vi.fn(() => ({
      top: 0, left: 0, right: 640, bottom: 300, width: 640, height: 300, x: 0, y: 0, toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    const sections = Array.from(container.querySelectorAll<HTMLElement>("section"));
    sections.forEach((section, index) => {
      section.getBoundingClientRect = vi.fn(() => ({
        top: 0, left: index * 640, right: index * 640 + 640, bottom: 340,
        width: 640, height: 340, x: index * 640, y: 0, toJSON: () => ({})
      })) as unknown as Element["getBoundingClientRect"];
    });
    const scrollTo = vi.fn();
    Object.defineProperty(container, "scrollTo", { configurable: true, value: scrollTo });

    const release = anchor.shadowRoot!.querySelector<HTMLAnchorElement>('a[href="#anchor-horizontal-release"]')!;
    release.click();
    await tick();
    await tick();

    expect(scrollTo).toHaveBeenCalledWith({ left: 3840, behavior: "auto" });
    expect(sections.every((section) => section.classList.contains("horizontal-section"))).toBe(true);
    const scrollbar = page.shadowRoot!.querySelector<HTMLInputElement>('.horizontal-scrollbar[type="range"]')!;
    expect(scrollbar).toBeTruthy();
    scrollbar.value = "500";
    scrollbar.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(container.scrollLeft).toBe(1920);
    expect(anchor.shadowRoot!.querySelector(".item.is-active")?.textContent).toMatch(/Release notes|发布说明/);
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("#anchor-horizontal-release");
  });
});
