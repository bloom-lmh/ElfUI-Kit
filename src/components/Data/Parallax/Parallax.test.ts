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
    expect(el.shadowRoot!.querySelector("slot")?.assignedElements()[0]?.textContent).toBe("Release monitor");
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
      toJSON: () => ({})
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
      ({ top: 100, bottom: 500, left: 0, right: 640, width: 640, height: 400, x: 0, y: 100, toJSON: () => ({}) }) as DOMRect;
    const el = document.createElement("elf-parallax") as ParallaxEl;
    el.height = 240;
    el.scale = 1.5;
    let top = 220;
    vi.spyOn(el, "getBoundingClientRect").mockImplementation(() =>
      ({ top, bottom: top + 240, left: 0, right: 640, width: 640, height: 240, x: 0, y: top, toJSON: () => ({}) }) as DOMRect
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
});
