import { readFileSync } from "node:fs";

import { registerComponents } from "@elfui/core";
import type { DirectiveBinding, DirectiveHooks } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Loading } from "./index";
import { loadingDirective } from "./directive";
import { ElfLoading } from "./service";
import type { LoadingDirectiveValue, LoadingInstance } from "./types";

beforeAll(() => {
  registerComponents(Loading);
});

afterEach(() => {
  for (const instance of serviceInstances.splice(0)) instance.close();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const serviceInstances: LoadingInstance[] = [];

const overlay = (el: LoadingEl): HTMLElement | null =>
  el.shadowRoot?.querySelector<HTMLElement>(".overlay") ?? null;

const finishTransition = async (element: HTMLElement | null): Promise<void> => {
  await frame();
  await frame();
  element?.dispatchEvent(new Event("transitionend", { bubbles: true }));
  await tick();
};

const createService = (...args: Parameters<typeof ElfLoading>): LoadingInstance => {
  const instance = ElfLoading(...args);
  serviceInstances.push(instance);
  return instance;
};

interface LoadingEl extends HTMLElement {
  text?: string;
  loading?: boolean;
  fullscreen?: boolean;
  closable?: boolean;
  variant?: string;
  svg?: string;
  svgViewBox?: string;
  lock?: boolean;
}

describe("elf-loading", () => {
  it("uses Core Transition as the structural resource owner", () => {
    const source = readFileSync("src/components/Feedback/Loading/index.ts", "utf8");
    const service = readFileSync("src/components/Feedback/Loading/service.ts", "utf8");
    const cssText = readFileSync("src/components/Feedback/Loading/style.scss", "utf8");

    expect(source).toContain('<Transition\n      name="elf-loading"');
    expect(source).toContain("@after-leave=${onAfterLeave}");
    expect(source).toContain('emit("closed")');
    expect(source).not.toContain("queueMicrotask");
    expect(service).toContain("acquireTargetPositionContext(target)");
    expect(service).not.toContain("targetPositionStates");
    expect(service).not.toContain("setTimeout");
    expect(service).not.toContain("queueMicrotask");
    expect(cssText).toContain(".elf-loading-enter-active");
    expect(cssText).toContain(".elf-loading-leave-active");
    expect(cssText).toMatch(/prefers-reduced-motion[\s\S]*transition: none/);
    expect(cssText).toMatch(/prefers-reduced-motion[\s\S]*animation: none/);
  });

  it("renders overlay text", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    el.text = "Loading";
    el.loading = true;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".overlay")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain("Loading");
  });

  it("does not block its content until loading is explicitly enabled", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".overlay")).toBeNull();
  });

  it("renders distinct structures for every built-in loading variant", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    el.loading = true;
    document.body.appendChild(el);

    const expectations = {
      spinner: [".spinner", 1],
      dots: [".dot", 3],
      pulse: [".pulse", 1],
      bars: [".bar", 3],
    } as const;

    for (const [variant, [selector, count]] of Object.entries(expectations)) {
      el.variant = variant;
      await tick();
      expect(el.shadowRoot!.querySelector(`.indicator.is-${variant}`)).toBeTruthy();
      expect(el.shadowRoot!.querySelectorAll(selector)).toHaveLength(count);
    }
  });

  it("全屏加载提供可见退出按钮并发出受控更新", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    el.loading = true;
    el.fullscreen = true;
    el.closable = true;
    document.body.appendChild(el);
    await tick();

    let nextLoading: unknown = true;
    let closeRequests = 0;
    let completed = 0;
    el.addEventListener("update:loading", (event) => {
      nextLoading = (event as CustomEvent).detail;
      el.loading = Boolean(nextLoading);
    });
    el.addEventListener("close", () => closeRequests++);
    el.addEventListener("closed", () => completed++);

    const button = el.shadowRoot!.querySelector<HTMLButtonElement>(".close")!;
    const leavingOverlay = overlay(el);
    expect(button.textContent).toContain("退出全屏加载");
    expect(button.querySelector("svg")).toBeTruthy();
    button.click();

    expect(nextLoading).toBe(false);
    expect(closeRequests).toBe(1);
    expect(completed).toBe(0);
    expect(overlay(el)).toBe(leavingOverlay);

    await finishTransition(leavingOverlay);
    expect(completed).toBe(1);
    expect(overlay(el)).toBeNull();
  });

  it("manages fullscreen Top Layer state from Transition hooks", async () => {
    const originalShow = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "showPopover");
    const originalHide = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "hidePopover");
    const showPopover = vi.fn();
    const hidePopover = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "showPopover", {
      configurable: true,
      value: showPopover,
    });
    Object.defineProperty(HTMLElement.prototype, "hidePopover", {
      configurable: true,
      value: hidePopover,
    });

    try {
      const el = document.createElement("elf-loading") as LoadingEl;
      el.loading = true;
      el.fullscreen = true;
      document.body.appendChild(el);
      await tick();

      expect(showPopover).toHaveBeenCalledOnce();
      const leavingOverlay = overlay(el);
      el.loading = false;
      await tick();
      expect(hidePopover).not.toHaveBeenCalled();

      await finishTransition(leavingOverlay);
      expect(hidePopover).toHaveBeenCalledOnce();
    } finally {
      if (originalShow) Object.defineProperty(HTMLElement.prototype, "showPopover", originalShow);
      else delete (HTMLElement.prototype as HTMLElement & { showPopover?: () => void }).showPopover;
      if (originalHide) Object.defineProperty(HTMLElement.prototype, "hidePopover", originalHide);
      else delete (HTMLElement.prototype as HTMLElement & { hidePopover?: () => void }).hidePopover;
    }
  });

  it("ignores a stale leave when loading rapidly reopens", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    el.loading = true;
    el.lock = true;
    let completed = 0;
    el.addEventListener("closed", () => completed++);
    document.body.appendChild(el);
    await tick();
    await finishTransition(overlay(el));

    const firstOverlay = overlay(el)!;
    el.loading = false;
    await tick();
    el.loading = true;
    await tick();

    const replacement = Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>(".overlay")).find(
      (candidate) => candidate !== firstOverlay,
    )!;
    expect(replacement).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");

    await finishTransition(firstOverlay);
    expect(completed).toBe(0);
    expect(replacement.isConnected).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    el.loading = false;
    await finishTransition(replacement);
    expect(completed).toBe(1);
    expect(document.body.style.overflow).toBe("");
  });

  it("renders a custom SVG path with its configured view box", async () => {
    const el = document.createElement("elf-loading") as LoadingEl;
    el.loading = true;
    el.svg = "M25 5 A20 20 0 0 1 45 25";
    el.svgViewBox = "0 0 50 50";
    document.body.appendChild(el);
    await tick();

    const svg = el.shadowRoot!.querySelector<SVGElement>(".custom-spinner")!;
    expect(svg.getAttribute("viewBox")).toBe("0 0 50 50");
    expect(svg.querySelector("path")!.getAttribute("d")).toBe("M25 5 A20 20 0 0 1 45 25");
    expect(el.shadowRoot!.querySelector(".spinner")).toBeNull();
  });

  it("creates and closes a local service while restoring target and scroll state", async () => {
    const target = document.createElement("section");
    target.style.position = "static";
    document.body.appendChild(target);
    let closed = 0;

    const instance = createService({
      target,
      text: "读取报表",
      variant: "bars",
      lock: true,
      customClass: "report-loading",
      onClose: () => closed++,
    });
    await tick();

    const el = target.querySelector<LoadingEl>("elf-loading[data-loading-service]")!;
    expect(el).toBeTruthy();
    expect(el.text).toBe("读取报表");
    expect(el.variant).toBe("bars");
    expect(el.classList.contains("report-loading")).toBe(true);
    expect(target.style.position).toBe("relative");
    expect(document.body.style.overflow).toBe("hidden");

    instance.setText("即将完成");
    await tick();
    expect(el.shadowRoot!.textContent).toContain("即将完成");

    instance.close();
    instance.close();
    expect(target.querySelector("elf-loading")).toBe(el);
    expect(target.style.position).toBe("relative");
    expect(document.body.style.overflow).toBe("hidden");
    expect(closed).toBe(0);

    await finishTransition(overlay(el));
    expect(target.querySelector("elf-loading")).toBeNull();
    expect(target.style.position).toBe("static");
    expect(document.body.style.overflow).toBe("");
    expect(closed).toBe(1);
  });

  it("finalizes service resources when an active host is externally unmounted", async () => {
    const target = document.createElement("section");
    target.style.position = "static";
    document.body.appendChild(target);
    let closed = 0;
    const instance = createService({ target, lock: true, onClose: () => closed++ });
    await tick();

    const el = target.querySelector<LoadingEl>("elf-loading[data-loading-service]")!;
    expect(target.style.position).toBe("relative");
    expect(document.body.style.overflow).toBe("hidden");
    el.remove();
    await tick();

    expect(target.style.position).toBe("static");
    expect(document.body.style.overflow).toBe("");
    expect(closed).toBe(1);
    instance.close();
    expect(closed).toBe(1);
  });

  it("supports fullscreen and body-mounted target geometry", async () => {
    const fullscreen = createService({ text: "全屏处理中" });
    const fullscreenEl = document.body.querySelector<LoadingEl>(
      "elf-loading[data-loading-service]",
    )!;
    expect(fullscreenEl.fullscreen).toBe(true);
    expect(fullscreenEl.style.position).toBe("fixed");
    expect(fullscreenEl.style.zIndex).toBe("10000");
    fullscreen.close();
    await finishTransition(overlay(fullscreenEl));

    const target = document.createElement("section");
    target.getBoundingClientRect = () =>
      ({
        left: 12,
        top: 24,
        width: 320,
        height: 180,
        right: 332,
        bottom: 204,
        x: 12,
        y: 24,
        toJSON: () => ({}),
      }) as DOMRect;
    document.body.appendChild(target);
    const bodyMounted = createService({ target, body: true, fullscreen: false });
    const bodyEl = document.body.querySelector<LoadingEl>("elf-loading[data-loading-service]")!;
    expect(bodyEl.parentElement).toBe(document.body);
    expect(bodyEl.style.left).toBe("12px");
    expect(bodyEl.style.top).toBe("24px");
    expect(bodyEl.style.width).toBe("320px");
    expect(bodyEl.style.height).toBe("180px");
    bodyMounted.close();
    await finishTransition(overlay(bodyEl));
  });

  it("lets users exit a fullscreen service and restores focus and scroll state", async () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    let closed = 0;

    createService({ text: "正在同步", variant: "bars", lock: true, onClose: () => closed++ });
    await tick();
    await tick();

    const el = document.body.querySelector<LoadingEl>("elf-loading[data-loading-service]")!;
    const closeButton = el.shadowRoot!.querySelector<HTMLButtonElement>(".close")!;
    await finishTransition(overlay(el));
    expect(el.closable).toBe(true);
    expect(el.shadowRoot!.activeElement).toBe(closeButton);
    expect(document.body.style.overflow).toBe("hidden");

    closeButton.click();

    expect(el.isConnected).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).not.toBe(trigger);
    expect(closed).toBe(0);

    await finishTransition(overlay(el));
    expect(el.isConnected).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);
    expect(closed).toBe(1);
  });

  it("keeps body locked until every locking service completes leave", async () => {
    const first = createService({ lock: true });
    const second = createService({ lock: true });
    const elements = Array.from(
      document.body.querySelectorAll<LoadingEl>("elf-loading[data-loading-service]"),
    );
    expect(document.body.style.overflow).toBe("hidden");
    first.close();
    await finishTransition(overlay(elements[0]!));
    expect(document.body.style.overflow).toBe("hidden");
    second.close();
    expect(document.body.style.overflow).toBe("hidden");
    await finishTransition(overlay(elements[1]!));
    expect(document.body.style.overflow).toBe("");
  });

  it("keeps the shared target positioning lease until every local service leaves", async () => {
    const target = document.createElement("section");
    target.style.position = "static";
    document.body.appendChild(target);
    const first = createService({ target });
    const second = createService({ target });
    const elements = Array.from(
      target.querySelectorAll<LoadingEl>("elf-loading[data-loading-service]"),
    );

    expect(target.style.position).toBe("relative");
    first.close();
    await finishTransition(overlay(elements[0]!));
    expect(target.style.position).toBe("relative");

    second.close();
    await finishTransition(overlay(elements[1]!));
    expect(target.style.position).toBe("static");
  });

  it("shares Core scroll-lock ownership between declarative and service instances", async () => {
    document.body.style.overflow = "scroll";
    const declarative = document.createElement("elf-loading") as LoadingEl;
    declarative.loading = true;
    declarative.lock = true;
    document.body.appendChild(declarative);
    await tick();

    expect(document.body.style.overflow).toBe("hidden");

    const service = createService({ lock: true });
    const serviceEl = document.body.querySelector<LoadingEl>("elf-loading[data-loading-service]")!;
    await tick();
    const declarativeOverlay = overlay(declarative);
    declarative.loading = false;
    await finishTransition(declarativeOverlay);

    expect(document.body.style.overflow).toBe("hidden");
    service.close();
    expect(document.body.style.overflow).toBe("hidden");
    await finishTransition(overlay(serviceEl));
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("mounts, updates, and disposes v-loading directive instances", async () => {
    const target = document.createElement("section");
    target.style.position = "relative";
    document.body.appendChild(target);
    const hooks = loadingDirective as DirectiveHooks<LoadingDirectiveValue, HTMLElement>;
    const binding = (
      value: LoadingDirectiveValue,
      oldValue?: LoadingDirectiveValue,
    ): DirectiveBinding<LoadingDirectiveValue> => ({
      value,
      oldValue,
      modifiers: Object.freeze({}),
    });

    hooks.mounted!(target, binding({ loading: true, text: "指令加载", variant: "dots" }));
    await tick();
    const serviceEl = target.querySelector<LoadingEl>("elf-loading[data-loading-service]")!;
    expect(serviceEl.text).toBe("指令加载");
    expect(serviceEl.variant).toBe("dots");

    hooks.updated!(target, binding(false, true));
    expect(target.querySelector("elf-loading")).toBe(serviceEl);
    await finishTransition(overlay(serviceEl));
    expect(target.querySelector("elf-loading")).toBeNull();

    hooks.updated!(target, binding(true, false));
    const replacement = target.querySelector<LoadingEl>("elf-loading[data-loading-service]")!;
    expect(replacement).toBeTruthy();
    hooks.beforeUnmount!(target, binding(true));
    await finishTransition(overlay(replacement));
    expect(target.querySelector("elf-loading")).toBeNull();
  });
});
