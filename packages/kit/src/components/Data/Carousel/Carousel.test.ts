import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

const originalMatchMedia = window.matchMedia;

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(() => {
  document.body.innerHTML = "";
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: originalMatchMedia,
  });
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-carousel", () => {
  it("renders the default height and navigation arrows", async () => {
    const el = document.createElement("elf-carousel");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    const root = el.shadowRoot!;
    expect((root.querySelector(".carousel") as HTMLElement).style.height).toBe("320px");
    expect(root.querySelector(".arrow-left")).toBeTruthy();
    expect(root.querySelector(".arrow-right")).toBeTruthy();
  });

  it("keeps a fade track untransformed", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("effect", "fade");
    document.body.appendChild(el);
    await tick();

    expect((el.shadowRoot!.querySelector(".track") as HTMLElement).style.transform).toBeFalsy();
  });

  it("applies initial-index and exposes imperative navigation", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & {
      activeIndex: number;
      next: () => void;
      setActiveItem: (item: number | string) => void;
    };
    el.setAttribute("autoplay", "false");
    el.setAttribute("initial-index", "1");
    el.innerHTML =
      '<div label="first">A</div><div label="second">B</div><div label="third">C</div>';
    document.body.appendChild(el);
    await tick();

    expect(el.activeIndex).toBe(1);
    el.next();
    expect(el.activeIndex).toBe(2);
    el.setActiveItem("first");
    expect(el.activeIndex).toBe(0);
  });

  it("honors click indicator trigger and vertical keyboard navigation", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("autoplay", "false");
    el.setAttribute("trigger", "click");
    el.setAttribute("direction", "vertical");
    el.innerHTML = "<div>A</div><div>B</div><div>C</div>";
    document.body.appendChild(el);
    await tick();

    const root = el.shadowRoot!.querySelector(".carousel") as HTMLElement;
    const dots = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".dot");
    dots[2].click();
    await tick();
    expect((el.shadowRoot!.querySelector(".track") as HTMLElement).style.transform).toBe(
      "translateY(-300%)",
    );

    root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    await tick();
    expect((el.shadowRoot!.querySelector(".track") as HTMLElement).style.transform).toBe(
      "translateY(-200%)",
    );
  });

  it("hides arrows and indicators when visibility props request it", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("arrow", "never");
    el.setAttribute("indicator-position", "none");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".arrows")).toBeNull();
    expect(el.shadowRoot!.querySelector(".indicators")).toBeNull();
  });

  it("renders outside indicators next to the clipped carousel viewport", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("autoplay", "false");
    el.setAttribute("indicator-position", "outside");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    const root = el.shadowRoot!;
    const carousel = root.querySelector(".carousel")!;
    const indicators = root.querySelector(".indicators")!;

    expect(carousel.contains(indicators)).toBe(false);
    expect(indicators.previousElementSibling).toBe(carousel);
    expect(indicators.querySelectorAll(".dot")).toHaveLength(2);
  });

  it("emits only for a real transition and not at a non-looping boundary", async () => {
    const el = document.createElement("elf-carousel");
    let changes = 0;
    el.addEventListener("change", () => changes++);
    el.setAttribute("autoplay", "false");
    el.setAttribute("loop", "false");
    el.setAttribute("initial-index", "1");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    (el.shadowRoot!.querySelector(".arrow-right") as HTMLButtonElement).click();
    expect(changes).toBe(0);
    (el.shadowRoot!.querySelector(".arrow-left") as HTMLButtonElement).click();
    expect(changes).toBe(1);
  });

  it("uses CarouselItem labels and names for imperative navigation", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & {
      activeIndex: number;
      setActiveItem: (item: number | string) => void;
    };
    el.setAttribute("autoplay", "false");
    el.innerHTML = `
      <elf-carousel-item name="welcome" label="Welcome">A</elf-carousel-item>
      <elf-carousel-item name="plans" label="Plans">B</elf-carousel-item>
    `;
    document.body.appendChild(el);
    await tick();

    const items = el.querySelectorAll<HTMLElement>("elf-carousel-item");
    expect(items[0].shadowRoot!.querySelector("[role=group]")?.getAttribute("aria-label")).toBe(
      "Welcome，第 1 张，共 2 张",
    );
    expect(items[0].hasAttribute("active")).toBe(true);
    expect(items[1].getAttribute("aria-hidden")).toBe("true");
    expect(items[1].hasAttribute("inert")).toBe(true);

    el.setActiveItem("plans");
    await tick();
    expect(el.activeIndex).toBe(1);
    expect(items[1].hasAttribute("active")).toBe(true);
    expect(
      items[1].shadowRoot!.querySelector("[role=group]")?.getAttribute("aria-roledescription"),
    ).toBe("slide");
    expect(items[1].shadowRoot!.querySelector(".carousel-item__label")?.textContent).toBe("Plans");
  });

  it("preserves a CarouselItem custom accessible label", async () => {
    const el = document.createElement("elf-carousel");
    el.setAttribute("autoplay", "false");
    el.innerHTML =
      '<elf-carousel-item label="Decorative" aria-label="Featured announcement">A</elf-carousel-item>';
    document.body.appendChild(el);
    await tick();

    expect(
      el
        .querySelector("elf-carousel-item")!
        .shadowRoot!.querySelector("[role=group]")
        ?.getAttribute("aria-label"),
    ).toBe("Featured announcement");
  });

  it("enables card layout only for direct CarouselItem children", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & { next: () => void };
    el.setAttribute("type", "card");
    el.setAttribute("autoplay", "false");
    el.innerHTML =
      "<elf-carousel-item>A</elf-carousel-item><elf-carousel-item>B</elf-carousel-item>";
    document.body.appendChild(el);
    await tick();

    const items = el.querySelectorAll<HTMLElement>("elf-carousel-item");
    expect(items[0].style.getPropertyValue("--_card-offset")).toBe("0");
    expect(items[1].style.getPropertyValue("--_card-offset")).toBe("1");
    expect((el.shadowRoot!.querySelector(".track") as HTMLElement).style.transform).toBeFalsy();

    el.next();
    await tick();
    expect(items[0].style.getPropertyValue("--_card-offset")).toBe("-1");
    expect(items[1].style.getPropertyValue("--_card-offset")).toBe("0");

    const fallback = document.createElement("elf-carousel");
    fallback.setAttribute("type", "card");
    fallback.setAttribute("autoplay", "false");
    fallback.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(fallback);
    await tick();
    expect(
      (fallback.querySelector("div") as HTMLElement).style.getPropertyValue("--_card-offset"),
    ).toBe("");
  });

  it("uses inert boundary clones and resets the visual track after a loop transition", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & {
      activeIndex: number;
      next: () => void;
    };
    el.setAttribute("autoplay", "false");
    el.setAttribute("initial-index", "1");
    el.innerHTML = '<a id="first" href="#first">First</a><button id="last">Last</button>';
    document.body.appendChild(el);
    await tick();

    const track = el.shadowRoot!.querySelector<HTMLElement>(".track")!;
    const firstClone = el.shadowRoot!.querySelector<HTMLElement>(".loop-clone--first")!;
    expect(firstClone.querySelector("[id]")).toBeNull();
    expect(firstClone.firstElementChild?.getAttribute("tabindex")).toBe("-1");

    el.next();
    await tick();
    expect(el.activeIndex).toBe(0);
    expect(track.style.transform).toBe("translateX(-300%)");

    const transitionEnd = new Event("transitionend", { bubbles: true });
    Object.defineProperty(transitionEnd, "propertyName", { value: "transform" });
    track.dispatchEvent(transitionEnd);
    await tick();
    expect(track.style.transform).toBe("translateX(-100%)");
    expect(track.classList.contains("is-resetting")).toBe(true);
  });

  it("supports horizontal pointer swipes without changing short taps", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & { activeIndex: number };
    el.setAttribute("autoplay", "false");
    el.innerHTML = "<div>A</div><div>B</div><div>C</div>";
    document.body.appendChild(el);
    await tick();

    const viewport = el.shadowRoot!.querySelector<HTMLElement>(".carousel")!;
    viewport.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        pointerId: 1,
        pointerType: "touch",
        clientX: 180,
      }),
    );
    viewport.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        pointerId: 1,
        pointerType: "touch",
        clientX: 160,
      }),
    );
    expect(el.activeIndex).toBe(0);

    viewport.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        pointerId: 2,
        pointerType: "touch",
        clientX: 180,
      }),
    );
    viewport.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        pointerId: 2,
        pointerType: "touch",
        clientX: 80,
      }),
    );
    expect(el.activeIndex).toBe(1);
  });

  it("supports an accessible manual playback control and pauses while focused", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & {
      isPlaying: boolean;
      play: () => void;
      pause: () => void;
    };
    el.setAttribute("show-play-control", "");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    const viewport = el.shadowRoot!.querySelector<HTMLElement>(".carousel")!;
    const control = el.shadowRoot!.querySelector<HTMLButtonElement>(".play-control")!;
    expect(el.isPlaying).toBe(true);
    expect(viewport.getAttribute("aria-live")).toBe("off");
    expect(control.getAttribute("aria-label")).toBe("暂停轮播");

    control.click();
    await tick();
    expect(el.isPlaying).toBe(false);
    expect(viewport.getAttribute("aria-live")).toBe("polite");
    expect(control.getAttribute("aria-label")).toBe("播放轮播");

    el.play();
    viewport.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await tick();
    expect(el.isPlaying).toBe(false);

    viewport.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    await tick();
    expect(el.isPlaying).toBe(true);
  });

  it("blocks automatic movement for reduced motion until the user explicitly plays", async () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn(() => ({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const el = document.createElement("elf-carousel") as HTMLElement & { isPlaying: boolean };
    el.setAttribute("show-play-control", "");
    el.innerHTML = "<div>A</div><div>B</div>";
    document.body.appendChild(el);
    await tick();

    expect(el.isPlaying).toBe(false);
    expect(el.hasAttribute("reduced-motion")).toBe(true);
    const control = el.shadowRoot!.querySelector<HTMLButtonElement>(".play-control")!;
    expect(control.getAttribute("aria-label")).toBe("播放轮播");

    control.click();
    await tick();
    expect(el.isPlaying).toBe(true);
    expect(el.hasAttribute("reduced-motion")).toBe(false);
  });

  it("clamps the active index and controls after dynamic slides are removed", async () => {
    const el = document.createElement("elf-carousel") as HTMLElement & {
      activeIndex: number;
      setActiveItem: (item: number | string) => void;
    };
    el.setAttribute("autoplay", "false");
    el.setAttribute("trigger", "click");
    el.setAttribute("loop", "false");
    el.innerHTML = "<div>A</div><div>B</div><div>C</div>";
    document.body.appendChild(el);
    await tick();

    el.setActiveItem(2);
    const changes: Array<[number, number]> = [];
    el.addEventListener("change", (event) => {
      changes.push((event as CustomEvent<[number, number]>).detail);
    });
    el.lastElementChild?.remove();
    el.shadowRoot!.querySelector("slot")!.dispatchEvent(new Event("slotchange"));
    await tick();

    expect(el.activeIndex).toBe(1);
    expect(el.shadowRoot!.querySelectorAll(".dot")).toHaveLength(2);
    expect(el.shadowRoot!.querySelector<HTMLButtonElement>(".arrow-right")?.disabled).toBe(true);
    expect((el.shadowRoot!.querySelector(".track") as HTMLElement).style.transform).toBe(
      "translateX(-200%)",
    );
    expect(changes).toContainEqual([1, 2]);
  });
});
