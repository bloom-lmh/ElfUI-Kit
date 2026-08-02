import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Parallax } from "./index";

interface ParallaxEl extends HTMLElement {
  src?: string;
  alt?: string;
  height?: string | number;
  scale?: number;
  disabled?: boolean;
  update?: () => void;
}

beforeAll(() => {
  registerComponents(Parallax);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-parallax", () => {
  it("renders a lazy image, slot content, and sizing CSS variables", async () => {
    const el = document.createElement("elf-parallax") as ParallaxEl;
    el.src = "hero.jpg";
    el.alt = "Mountain";
    el.height = 360;
    el.innerHTML = "<h2>Release monitor</h2>";
    document.body.appendChild(el);
    await tick();

    const image = el.shadowRoot!.querySelector("img") as HTMLImageElement;
    expect(image.getAttribute("src")).toBe("hero.jpg");
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(el.style.getPropertyValue("--_parallax-height")).toBe("360px");
    expect(el.shadowRoot!.querySelector("slot")?.assignedElements()[0]?.textContent).toBe(
      "Release monitor",
    );
  });

  it("updates transform offset on scroll with requestAnimationFrame", async () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("innerHeight", 600);

    const el = document.createElement("elf-parallax") as ParallaxEl;
    el.src = "hero.jpg";
    el.height = 300;
    el.scale = 1.4;
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      top: 120,
      bottom: 420,
      left: 0,
      right: 640,
      width: 640,
      height: 300,
      x: 0,
      y: 120,
      toJSON: () => ({}),
    } as DOMRect);
    document.body.appendChild(el);
    await tick();

    window.dispatchEvent(new Event("scroll"));
    await tick();

    expect(el.style.getPropertyValue("--_parallax-offset")).not.toBe("0px");
  });

  it("keeps the media fixed when disabled", async () => {
    const el = document.createElement("elf-parallax") as ParallaxEl;
    el.disabled = true;
    document.body.appendChild(el);
    await tick();

    expect(el.hasAttribute("data-disabled")).toBe(true);
    expect(el.style.getPropertyValue("--_parallax-offset")).toBe("0px");
  });

  it("keeps the media fixed when reduced motion is preferred", async () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true } as MediaQueryList);
    vi.stubGlobal("matchMedia", matchMedia);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    const el = document.createElement("elf-parallax") as ParallaxEl;
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      top: 100,
      bottom: 400,
      left: 0,
      right: 640,
      width: 640,
      height: 300,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    } as DOMRect);
    document.body.appendChild(el);
    await tick();

    window.dispatchEvent(new Event("scroll"));
    await tick();

    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    expect(el.style.getPropertyValue("--_parallax-offset")).toBe("0px");
  });

  it("delegates stable host resize observation to the Core lifecycle", async () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      queueMicrotask(() => callback(0));
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const observe = vi.fn();
    const disconnect = vi.fn();
    let resizeCallback!: ResizeObserverCallback;

    class ResizeObserverMock implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }

      observe = observe;
      unobserve = vi.fn();
      disconnect = disconnect;
    }

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const el = document.createElement("elf-parallax") as ParallaxEl;
    let top = 220;
    vi.spyOn(el, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          top,
          bottom: top + 240,
          left: 0,
          right: 640,
          width: 640,
          height: 240,
          x: 0,
          y: top,
          toJSON: () => ({}),
        }) as DOMRect,
    );
    document.body.appendChild(el);
    await tick();

    expect(observe).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledWith(el);

    const firstOffset = el.style.getPropertyValue("--_parallax-offset");
    top = 80;
    resizeCallback(
      [
        {
          target: el,
          contentRect: { width: 640, height: 240 },
        } as ResizeObserverEntry,
      ],
      {} as ResizeObserver,
    );
    await tick();
    await tick();

    expect(el.style.getPropertyValue("--_parallax-offset")).not.toBe(firstOffset);

    el.remove();
    await tick();

    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("updates from a nested scroll container instead of relying on window scroll", async () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("innerHeight", 800);

    const scroller = document.createElement("div");
    scroller.style.overflow = "auto";
    scroller.getBoundingClientRect = () =>
      ({
        top: 100,
        bottom: 500,
        left: 0,
        right: 640,
        width: 640,
        height: 400,
        x: 0,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect;
    const el = document.createElement("elf-parallax") as ParallaxEl;
    el.height = 240;
    el.scale = 1.5;
    let top = 220;
    vi.spyOn(el, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          top,
          bottom: top + 240,
          left: 0,
          right: 640,
          width: 640,
          height: 240,
          x: 0,
          y: top,
          toJSON: () => ({}),
        }) as DOMRect,
    );
    scroller.appendChild(el);
    document.body.appendChild(scroller);
    await tick();

    const firstOffset = el.style.getPropertyValue("--_parallax-offset");
    top = 120;
    scroller.dispatchEvent(new Event("scroll"));
    await tick();

    expect(el.style.getPropertyValue("--_parallax-offset")).not.toBe(firstOffset);
  });

  it("rebinds scroll ownership when moved to another scroll container", async () => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      queueMicrotask(() => callback(0));
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("innerHeight", 900);

    const createScroller = (top: number, bottom: number): HTMLDivElement => {
      const scroller = document.createElement("div");
      scroller.style.overflow = "auto";
      scroller.getBoundingClientRect = () =>
        ({
          top,
          bottom,
          left: 0,
          right: 640,
          width: 640,
          height: bottom - top,
          x: 0,
          y: top,
          toJSON: () => ({}),
        }) as DOMRect;
      return scroller;
    };

    const firstScroller = createScroller(50, 450);
    const secondScroller = createScroller(150, 650);
    const firstAddEventListener = vi.spyOn(firstScroller, "addEventListener");
    const firstRemoveEventListener = vi.spyOn(firstScroller, "removeEventListener");
    const secondAddEventListener = vi.spyOn(secondScroller, "addEventListener");
    const secondRemoveEventListener = vi.spyOn(secondScroller, "removeEventListener");
    const el = document.createElement("elf-parallax") as ParallaxEl;
    el.height = 240;
    el.scale = 1.5;
    let top = 220;
    vi.spyOn(el, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          top,
          bottom: top + 240,
          left: 0,
          right: 640,
          width: 640,
          height: 240,
          x: 0,
          y: top,
          toJSON: () => ({}),
        }) as DOMRect,
    );

    firstScroller.appendChild(el);
    document.body.append(firstScroller, secondScroller);
    await tick();
    await tick();

    expect(firstAddEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });

    const getComputedStyle = vi.spyOn(window, "getComputedStyle");
    const styleReadsBeforeUnrelatedMutation = getComputedStyle.mock.calls.length;
    document.body.appendChild(document.createElement("aside"));
    await tick();
    await tick();
    expect(getComputedStyle).toHaveBeenCalledTimes(styleReadsBeforeUnrelatedMutation);

    secondScroller.appendChild(el);
    await tick();
    await tick();
    expect(firstRemoveEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(secondAddEventListener).toHaveBeenCalledWith("scroll", expect.any(Function), {
      passive: true,
    });
    const reboundOffset = el.style.getPropertyValue("--_parallax-offset");

    top = 360;
    firstScroller.dispatchEvent(new Event("scroll"));
    await tick();
    expect(el.style.getPropertyValue("--_parallax-offset")).toBe(reboundOffset);

    secondScroller.dispatchEvent(new Event("scroll"));
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_parallax-offset")).not.toBe(reboundOffset);

    el.remove();
    await tick();
    expect(secondRemoveEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
