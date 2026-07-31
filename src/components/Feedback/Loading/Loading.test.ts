import { registerComponents } from "@elfui/core";
import type { DirectiveBinding, DirectiveHooks } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

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
const serviceInstances: LoadingInstance[] = [];

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
    let closed = 0;
    el.addEventListener("update:loading", (event) => {
      nextLoading = (event as CustomEvent).detail;
      el.loading = Boolean(nextLoading);
    });
    el.addEventListener("close", () => closed++);

    const button = el.shadowRoot!.querySelector<HTMLButtonElement>(".close")!;
    expect(button.textContent).toContain("退出全屏加载");
    expect(button.querySelector("svg")).toBeTruthy();
    button.click();

    expect(nextLoading).toBe(false);
    expect(closed).toBe(1);
    await tick();
    expect(el.shadowRoot!.querySelector(".overlay")).toBeNull();
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
    expect(target.querySelector("elf-loading")).toBeNull();
    expect(target.style.position).toBe("static");
    expect(document.body.style.overflow).toBe("");
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
    expect(el.closable).toBe(true);
    expect(el.shadowRoot!.activeElement).toBe(closeButton);
    expect(document.body.style.overflow).toBe("hidden");

    closeButton.click();

    expect(el.isConnected).toBe(false);
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);
    expect(closed).toBe(1);
  });

  it("keeps body locked until every locking service is closed", () => {
    const first = createService({ lock: true });
    const second = createService({ lock: true });
    expect(document.body.style.overflow).toBe("hidden");
    first.close();
    expect(document.body.style.overflow).toBe("hidden");
    second.close();
    expect(document.body.style.overflow).toBe("");
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
    await tick();
    declarative.loading = false;
    await tick();

    expect(document.body.style.overflow).toBe("hidden");
    service.close();
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
    expect(target.querySelector("elf-loading")).toBeNull();

    hooks.updated!(target, binding(true, false));
    expect(target.querySelector("elf-loading")).toBeTruthy();
    hooks.beforeUnmount!(target, binding(true));
    expect(target.querySelector("elf-loading")).toBeNull();
  });
});
