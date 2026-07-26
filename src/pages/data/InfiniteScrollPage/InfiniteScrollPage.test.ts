import { afterEach, beforeAll, describe, expect, it } from "vitest";

let asyncExampleTag = "";
let containerExampleTag = "";
let directiveExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageInfiniteScrollEx1 } = await import("./ex1");
  const { PageInfiniteScrollEx2 } = await import("./ex2");
  const { PageInfiniteScrollEx3 } = await import("./ex3");
  asyncExampleTag = ensureCustomElement(PageInfiniteScrollEx1);
  containerExampleTag = ensureCustomElement(PageInfiniteScrollEx2);
  directiveExampleTag = ensureCustomElement(PageInfiniteScrollEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("InfiniteScroll documentation", () => {
  it("documents async loading, failure recovery, and completion state", async () => {
    const page = document.createElement(asyncExampleTag);
    document.body.appendChild(page);
    await tick();

    const scroller = page.shadowRoot!.querySelector<HTMLElement>("elf-infinite-scroll")!;
    expect(scroller.hasAttribute("immediate")).toBe(true);
    expect(scroller.shadowRoot!.querySelector(".scroll")!.getAttribute("aria-label")).toBeTruthy();
    expect(page.shadowRoot!.querySelectorAll(".infinite-feed-row")).toHaveLength(8);
    expect(page.shadowRoot!.querySelector("[data-action='fail']")).toBeTruthy();
  });

  it("switches between internal, external, and window targets", async () => {
    const page = document.createElement(containerExampleTag);
    document.body.appendChild(page);
    await tick();

    const buttons = page.shadowRoot!.querySelectorAll<HTMLButtonElement>(
      ".infinite-demo-actions [data-mode]"
    );
    const scroller = page.shadowRoot!.querySelector<HTMLElement>("elf-infinite-scroll")!;
    expect(buttons).toHaveLength(3);
    expect(scroller.getAttribute("height")).toBe("280px");

    buttons[1]!.click();
    await tick();
    expect(page.shadowRoot!.querySelector(".infinite-external-viewport")!.classList.contains("is-active")).toBe(true);
    expect((scroller as HTMLElement & { container?: unknown }).container).toBeTruthy();

    buttons[2]!.click();
    await tick();
    expect(scroller.getAttribute("height")).toBe("auto");
    expect((scroller as HTMLElement & { container?: unknown }).container).toBe(window);
  });

  it("mounts and removes the directive container cleanly", async () => {
    const page = document.createElement(directiveExampleTag);
    document.body.appendChild(page);
    await tick();

    const toggle = page.shadowRoot!.querySelector<HTMLButtonElement>(".infinite-demo-actions button")!;
    expect(page.shadowRoot!.querySelector(".infinite-directive-viewport")).toBeTruthy();
    toggle.click();
    await tick();
    expect(page.shadowRoot!.querySelector(".infinite-directive-viewport")).toBeNull();
    expect(page.shadowRoot!.querySelector(".infinite-unmounted-state")).toBeTruthy();

    toggle.click();
    await tick();
    expect(page.shadowRoot!.querySelector(".infinite-directive-viewport")).toBeTruthy();
  });
});
