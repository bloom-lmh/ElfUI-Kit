import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let playbackExampleTag = "";
let dynamicExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageCarouselEx1 } = await import("./ex1");
  const { PageCarouselEx2 } = await import("./ex2");
  playbackExampleTag = ensureCustomElement(PageCarouselEx1);
  dynamicExampleTag = ensureCustomElement(PageCarouselEx2);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Carousel documentation", () => {
  it("keeps the playback status synchronized with the built-in control", async () => {
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
      })),
    );
    const page = document.createElement(playbackExampleTag);
    document.body.appendChild(page);
    await tick();

    const carousel = page.shadowRoot!.querySelector<HTMLElement>("elf-carousel")!;
    const control = carousel.shadowRoot!.querySelector<HTMLButtonElement>(".play-control")!;
    expect((carousel as HTMLElement & { isPlaying: boolean }).isPlaying).toBe(true);
    expect(control.getAttribute("aria-label")).toBe("暂停轮播");
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("自动播放中");

    control.click();
    await tick();
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("已暂停");

    control.click();
    await tick();
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("自动播放中");
  });

  it("adds and removes dynamic slides while keeping controls in sync", async () => {
    const page = document.createElement(dynamicExampleTag);
    document.body.appendChild(page);
    await tick();

    const carousel = page.shadowRoot!.querySelector<HTMLElement>("elf-carousel")!;
    const actions = page.shadowRoot!.querySelectorAll<HTMLButtonElement>(
      ".carousel-demo-actions button",
    );
    expect(carousel.children).toHaveLength(3);

    actions[0]!.click();
    await tick();
    expect(carousel.children).toHaveLength(4);
    expect(carousel.shadowRoot!.querySelectorAll(".dot")).toHaveLength(4);

    actions[1]!.click();
    await tick();
    expect(carousel.children).toHaveLength(3);
    expect(carousel.shadowRoot!.querySelectorAll(".dot")).toHaveLength(3);
  });
});
