import { readFileSync } from "node:fs";
import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Image } from "./index";

beforeAll(() => {
  registerComponents(Image);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

interface ImageEl extends HTMLElement {
  src?: string;
  srcset?: string;
  sizes?: string;
  width?: number | string;
  height?: number | string;
  fit?: string;
  lazy?: boolean;
  previewSrcList?: string[];
  initialIndex?: number;
  previewTeleported?: boolean;
  zoomRate?: number;
  retry?(): void;
  openPreview?(): void;
  closePreview?(): void;
}

const mountLoadedPreview = async (teleported = false): Promise<ImageEl> => {
  const el = document.createElement("elf-image") as ImageEl;
  el.src = "first.png";
  el.previewSrcList = ["first.png", "second.png", "third.png"];
  el.initialIndex = 1;
  el.zoomRate = 2;
  el.previewTeleported = teleported;
  document.body.appendChild(el);
  await tick();
  el.shadowRoot!.querySelector("img")!.dispatchEvent(new Event("load"));
  await tick();
  return el;
};

describe("elf-image", () => {
  it("renders responsive source metadata and normalized size", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "small.png";
    el.srcset = "small.png 480w, large.png 960w";
    el.sizes = "(max-width: 600px) 100vw, 50vw";
    el.width = 120;
    document.body.appendChild(el);
    await tick();

    const image = el.shadowRoot!.querySelector("img") as HTMLImageElement;
    expect(image.getAttribute("src")).toBe("small.png");
    expect(image.getAttribute("srcset")).toBe("small.png 480w, large.png 960w");
    expect(image.getAttribute("sizes")).toBe("(max-width: 600px) 100vw, 50vw");
    expect(image.getAttribute("decoding")).toBe("async");
    expect(el.style.getPropertyValue("--_image-width")).toBe("120px");
  });

  it("normalizes numeric size attributes and invalid fit values", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.setAttribute("src", "x.png");
    el.setAttribute("width", "420");
    el.setAttribute("height", "220");
    el.fit = "invalid";
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_image-width")).toBe("420px");
    expect(el.style.getPropertyValue("--_image-height")).toBe("220px");
    expect(el.style.getPropertyValue("--_image-fit")).toBe("fill");
    expect(el.getAttribute("fit")).toBe("fill");
  });

  it.each(["fill", "contain", "cover", "none", "scale-down"])(
    "applies the %s object-fit mode immediately",
    async (fit) => {
      const el = document.createElement("elf-image") as ImageEl;
      el.src = "sample.png";
      el.fit = fit;
      document.body.appendChild(el);
      await tick();

      expect(el.style.getPropertyValue("--_image-fit")).toBe(fit);
      expect(el.shadowRoot!.querySelector("img")?.classList.contains(`fit-${fit}`)).toBe(true);
    },
  );

  it("updates fixed dimensions and fit after mount", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "sample.png";
    document.body.appendChild(el);
    await tick();

    el.width = 320;
    el.height = "180px";
    el.fit = "contain";
    await tick();

    expect(el.style.getPropertyValue("--_image-width")).toBe("320px");
    expect(el.style.getPropertyValue("--_image-height")).toBe("180px");
    expect(el.style.getPropertyValue("--_image-fit")).toBe("contain");
  });

  it("defers src and srcset until the lazy image intersects", async () => {
    let notify: IntersectionObserverCallback = () => {};
    const observe = vi.fn();
    const disconnect = vi.fn();
    class FakeIntersectionObserver {
      readonly root = null;
      readonly rootMargin = "120px 0px";
      readonly thresholds = [0];
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = (): IntersectionObserverEntry[] => [];
    }
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    const el = document.createElement("elf-image") as ImageEl;
    el.src = "lazy.png";
    el.srcset = "lazy.png 1x, lazy@2x.png 2x";
    el.lazy = true;
    document.body.appendChild(el);
    await tick();

    expect(observe).toHaveBeenCalledWith(el);
    expect(el.shadowRoot!.querySelector("img")).toBeNull();
    expect(el.shadowRoot!.querySelector(".pending")).toBeTruthy();

    notify([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    await tick();

    const image = el.shadowRoot!.querySelector("img") as HTMLImageElement;
    expect(image.getAttribute("src")).toBe("lazy.png");
    expect(image.getAttribute("srcset")).toBe("lazy.png 1x, lazy@2x.png 2x");
    image.dispatchEvent(new Event("load"));
    await tick();
    expect(image.classList.contains("is-loaded")).toBe(true);
    expect(el.shadowRoot!.querySelector(".pending")).toBeNull();
    expect(disconnect).toHaveBeenCalled();
  });

  it("provides motion-safe loading and preview transitions", () => {
    const cssText = readFileSync("packages/kit/src/components/Data/Image/style.scss", "utf8");
    const previewCss = readFileSync("packages/kit/src/components/Data/Image/preview.scss", "utf8");
    expect(cssText).toContain("img.is-loaded { opacity: 1; }");
    expect(cssText).toContain("animation: image-pending");
    expect(cssText).toContain("@media (prefers-reduced-motion: reduce)");
    expect(previewCss).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("allows the lazy-loading indicator to be replaced", async () => {
    class HiddenIntersectionObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = (): IntersectionObserverEntry[] => [];
    }
    vi.stubGlobal("IntersectionObserver", HiddenIntersectionObserver);

    const el = document.createElement("elf-image") as ImageEl;
    el.src = "lazy.png";
    el.lazy = true;
    const custom = document.createElement("span");
    custom.slot = "loading";
    custom.textContent = "Loading illustration";
    el.appendChild(custom);
    document.body.appendChild(el);
    await tick();

    const slot = el.shadowRoot!.querySelector('slot[name="loading"]') as HTMLSlotElement;
    expect(slot.assignedElements()).toEqual([custom]);
  });

  it("emits load and error events and exposes reflected state", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "sample.png";
    const onLoad = vi.fn();
    const onError = vi.fn();
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    document.body.appendChild(el);
    await tick();

    const image = el.shadowRoot!.querySelector("img") as HTMLImageElement;
    image.dispatchEvent(new Event("load"));
    await tick();
    expect(el.hasAttribute("loaded")).toBe(true);

    image.dispatchEvent(new Event("error"));
    await tick();
    expect(el.hasAttribute("error")).toBe(true);
    expect(onLoad).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledOnce();
  });

  it("retries the same failed source from the default error state", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "unstable.png";
    document.body.appendChild(el);
    await tick();

    el.shadowRoot!.querySelector("img")!.dispatchEvent(new Event("error"));
    await tick();
    const retry = el.shadowRoot!.querySelector<HTMLButtonElement>(".error button")!;
    expect(retry.textContent).toContain("重试");

    retry.click();
    await tick();
    expect(el.hasAttribute("error")).toBe(false);
    expect(el.shadowRoot!.querySelector("img")?.getAttribute("src")).toBe("unstable.png");
    expect(el.shadowRoot!.querySelector(".pending")).toBeTruthy();
  });

  it("opens from Enter, supports preview shortcuts, traps focus, and restores the trigger", async () => {
    const el = await mountLoadedPreview();
    const trigger = el.shadowRoot!.querySelector<HTMLElement>(".image")!;
    expect(trigger.getAttribute("role")).toBe("button");
    expect(trigger.getAttribute("tabindex")).toBe("0");
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", cancelable: true }));
    await tick();
    await tick();

    const preview = el.shadowRoot!.querySelector<HTMLElement>(".elf-image-preview")!;
    expect(preview).toBeTruthy();
    expect(preview.querySelector(".elf-image-preview__counter")?.textContent?.trim()).toBe("2 / 3");
    expect(el.shadowRoot!.activeElement).toBe(preview.querySelector('[aria-label="关闭"]'));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", cancelable: true }));
    await tick();
    expect(preview.querySelector(".elf-image-preview__counter")?.textContent?.trim()).toBe("3 / 3");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "+", cancelable: true }));
    await tick();
    expect(
      (preview.querySelector(".elf-image-preview__image") as HTMLElement).style.transform,
    ).toBe("scale(2)");

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        cancelable: true,
      }),
    );
    await tick();
    expect(el.shadowRoot!.activeElement).toBe(preview.querySelector('[aria-label="放大"]'));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", cancelable: true }));
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".elf-image-preview")).toBeNull();
    expect(el.shadowRoot!.activeElement).toBe(trigger);
  });

  it("teleports the preview and localizes its dialog controls", async () => {
    const el = await mountLoadedPreview(true);
    el.openPreview?.();
    await tick();
    await tick();

    const preview = document.body.querySelector<HTMLElement>(".elf-image-preview")!;
    expect(preview.getAttribute("aria-label")).toBe("图片预览");
    expect(preview.querySelector('[aria-label="上一步"]')).toBeTruthy();
    expect(preview.querySelector('[aria-label="下一步"]')).toBeTruthy();

    el.closePreview?.();
    await tick();
    expect(document.body.querySelector(".elf-image-preview")).toBeNull();
  });

  it("closes an open preview when its source list becomes empty", async () => {
    const el = await mountLoadedPreview();
    el.openPreview?.();
    await tick();
    expect(el.hasAttribute("preview-open")).toBe(true);

    el.previewSrcList = [];
    await tick();
    await tick();
    expect(el.hasAttribute("preview-open")).toBe(false);
    expect(el.shadowRoot!.querySelector(".elf-image-preview")).toBeNull();
  });

  it("resets the error state after src changes", async () => {
    const el = document.createElement("elf-image") as ImageEl;
    el.src = "broken.png";
    document.body.appendChild(el);
    await tick();

    el.shadowRoot!.querySelector("img")!.dispatchEvent(new Event("error"));
    await tick();
    expect(el.shadowRoot!.querySelector(".error")).toBeTruthy();

    el.src = "recovered.png";
    await tick();
    expect(el.shadowRoot!.querySelector("img")?.getAttribute("src")).toBe("recovered.png");
    expect(el.hasAttribute("error")).toBe(false);
  });
});
