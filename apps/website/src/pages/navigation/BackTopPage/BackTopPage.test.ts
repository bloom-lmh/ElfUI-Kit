import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageBacktopEx1 } = await import("./ex1");
  exampleTag = ensureCustomElement(PageBacktopEx1);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("BackTop documentation", () => {
  it("uses ElfUI Scrollbar as the BackTop target", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const root = page.shadowRoot!;
    const scrollbar = root.querySelector<HTMLElement & { wrapRef: HTMLElement | null }>(
      "#backtop-basic-scroll",
    )!;
    const wrap = scrollbar.wrapRef!;
    const backTop = root.querySelector<HTMLElement>("elf-back-top")!;
    const scrollTo = vi.fn((options: ScrollToOptions) => {
      wrap.scrollTop = Number(options.top ?? 0);
    });
    Object.defineProperty(wrap, "scrollTo", { configurable: true, value: scrollTo });

    expect(scrollbar.tagName).toBe("ELF-SCROLLBAR");
    expect(root.querySelector('[style*="overflow:auto"]')).toBeNull();

    wrap.scrollTop = 160;
    wrap.dispatchEvent(new Event("scroll"));
    await tick();
    await tick();
    expect(backTop.shadowRoot?.querySelector(".backtop")).toBeTruthy();

    (backTop as HTMLElement & { smooth?: boolean }).smooth = false;
    await tick();
    (backTop.shadowRoot!.querySelector(".backtop") as HTMLButtonElement).click();
    await tick();
    expect(wrap.scrollTop).toBe(0);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
