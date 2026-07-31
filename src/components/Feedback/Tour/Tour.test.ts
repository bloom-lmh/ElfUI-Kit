import { ensureCustomElement } from "@elfui/core";
import { readFileSync } from "node:fs";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Tour } from "./index";
import type { TourStep } from "./types";

beforeAll(() => {
  ensureCustomElement(Tour);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

interface TourEl extends HTMLElement {
  steps?: TourStep[];
  visible?: boolean;
  current?: number;
  open?: () => void;
  next?: () => void;
  prev?: () => void;
  close?: () => void;
  mask?: boolean;
  showClose?: boolean;
  closeOnPressEscape?: boolean;
  contentStyle?: Record<string, string>;
}

const steps: TourStep[] = [
  { target: "#tour-target-one", title: "第一步", content: "说明一", placement: "bottom" },
  { target: "#tour-target-two", title: "第二步", content: "说明二", placement: "right" },
];

const createTarget = (id: string, left: number): HTMLElement => {
  const target = document.createElement("button");
  target.id = id;
  target.textContent = id;
  target.getBoundingClientRect = () =>
    ({
      left,
      top: 80,
      width: 120,
      height: 40,
      right: left + 120,
      bottom: 120,
      x: left,
      y: 80,
      toJSON: () => ({}),
    }) as DOMRect;
  document.body.appendChild(target);
  return target;
};

const mount = async (patch: Partial<TourEl> = {}): Promise<TourEl> => {
  const firstTarget = createTarget("tour-target-one", 40);
  createTarget("tour-target-two", 220);
  firstTarget.focus();
  const el = document.createElement("elf-tour") as TourEl;
  Object.assign(el, { steps, visible: true, current: 0, ...patch });
  document.body.appendChild(el);
  await tick();
  await frame();
  await tick();
  return el;
};

const finishTransition = async (element: HTMLElement | null): Promise<void> => {
  await frame();
  await frame();
  element?.dispatchEvent(new Event("transitionend", { bubbles: true }));
  await tick();
};

describe("elf-tour", () => {
  it("delegates structural motion and modal ownership to shared Core capabilities", () => {
    const source = readFileSync("src/components/Feedback/Tour/index.ts", "utf8");
    const cssText = readFileSync("src/components/Feedback/Tour/style.scss", "utf8");

    expect(source).toContain('<Transition\n      name="elf-tour"');
    expect(source).toContain("useModalOverlay({");
    expect(source).toContain("createMutateController(root");
    expect(source).toContain("@after-leave=${onAfterLeave}");
    expect(source).not.toMatch(
      /closeTimer|new MutationObserver|setTimeout\([^)]*180|resolveOverlay\(\)\?\.remove/,
    );
    expect(cssText).toContain(".elf-tour-enter-active");
    expect(cssText).toContain(".elf-tour-leave-active");
    expect(cssText).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("显示遮罩、高亮和当前步骤内容", async () => {
    await mount();

    expect(document.body.querySelector(".tour-layer")).toBeTruthy();
    expect(document.body.querySelector(".tour-highlight")).toBeTruthy();
    expect(document.body.querySelector(".tour-backdrop")).toBeNull();
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("第一步");
    expect(document.body.querySelector(".tour-close svg")).toBeTruthy();
  });

  it("目标不存在时仍显示安全遮罩和居中引导面板", async () => {
    await mount({
      steps: [{ target: "#missing-target", title: "备用引导", content: "目标暂不可用" }],
    });

    expect(document.body.querySelector(".tour-highlight")).toBeNull();
    expect(document.body.querySelector(".tour-backdrop")).toBeTruthy();
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("备用引导");
  });

  it("支持无蒙层、隐藏关闭按钮与内容样式", async () => {
    await mount({ mask: false, showClose: false, contentStyle: { width: "280px" } });

    expect(document.body.querySelector(".tour-highlight")?.classList.contains("without-mask")).toBe(
      true,
    );
    expect(document.body.querySelector(".tour-close")).toBeNull();
    expect((document.body.querySelector(".tour-panel") as HTMLElement).style.width).toBe("280px");
  });

  it("closeOnPressEscape=false 时保留当前引导", async () => {
    await mount({ closeOnPressEscape: false });

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await tick();

    expect(document.body.querySelector(".tour-layer")).toBeTruthy();
  });

  it("目标在引导期间被移除时自动切换为安全遮罩", async () => {
    await mount();
    expect(document.body.querySelector(".tour-highlight")).toBeTruthy();

    document.querySelector("#tour-target-one")?.remove();
    await tick();
    await frame();
    await tick();

    expect(document.body.querySelector(".tour-highlight")).toBeNull();
    expect(document.body.querySelector(".tour-backdrop")).toBeTruthy();
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("第一步");
  });

  it("目标靠近视口底部时自动向上翻转，操作区保持在视口内", async () => {
    const el = await mount();
    const target = document.querySelector("#tour-target-one") as HTMLElement;
    target.getBoundingClientRect = () =>
      ({
        left: 80,
        top: window.innerHeight - 50,
        width: 120,
        height: 40,
        right: 200,
        bottom: window.innerHeight - 10,
        x: 80,
        y: window.innerHeight - 50,
        toJSON: () => ({}),
      }) as DOMRect;

    window.dispatchEvent(new Event("resize"));
    await frame();
    await tick();

    const panel = document.body.querySelector<HTMLElement>(".tour-panel")!;
    expect(panel.style.transform).toBe("translate(-50%, -100%)");
    expect(el.visible).toBe(true);
  });

  it("next/prev 更新 current 并触发 change", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:current", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    el.next!();
    await tick();
    await frame();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(1);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      current: 1,
      step: steps[1],
    });
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("第二步");

    el.prev!();
    await tick();
    expect((onUpdate.mock.calls[1]![0] as CustomEvent).detail).toBe(0);
  });

  it("键盘方向键和完成按钮可驱动流程", async () => {
    const el = await mount();
    const onFinish = vi.fn();
    el.addEventListener("finish", onFinish);

    document.body
      .querySelector(".tour-layer")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("第二步");

    (document.body.querySelector(".tour-footer .tour-button--primary") as HTMLElement).click();
    await tick();
    expect(onFinish).toHaveBeenCalledTimes(1);
    await finishTransition(document.body.querySelector(".tour-layer"));
    expect(document.body.querySelector(".tour-layer")).toBeNull();
  });

  it("首步打开即建立焦点和全局键盘控制，并在关闭后恢复焦点", async () => {
    const el = await mount();
    const closeButton = document.body.querySelector<HTMLElement>(".tour-close")!;

    expect(document.activeElement).toBe(closeButton);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    await tick();
    expect(document.body.querySelector(".tour-title")?.textContent).toContain("第二步");

    el.close!();
    await finishTransition(document.body.querySelector(".tour-layer"));
    expect(document.activeElement?.id).toBe("tour-target-one");
  });

  it("retains scroll and focus ownership until the leave transition completes", async () => {
    const el = await mount();
    const trigger = document.querySelector<HTMLElement>("#tour-target-one")!;
    const onClose = vi.fn();
    el.addEventListener("close", onClose);

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement).toBe(document.body.querySelector(".tour-close"));

    el.close!();
    await tick();
    const leavingRoot = document.body.querySelector<HTMLElement>(".tour-layer");

    expect(leavingRoot).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
    expect(onClose).not.toHaveBeenCalled();

    await finishTransition(leavingRoot);

    expect(document.body.querySelector(".tour-layer")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("isolates a stale leave when the Tour is reopened rapidly", async () => {
    const el = await mount();
    const onClose = vi.fn();
    el.addEventListener("close", onClose);

    el.close!();
    await tick();
    const leavingRoot = document.body.querySelector<HTMLElement>(".tour-layer")!;

    el.open!();
    await tick();
    const roots = Array.from(document.body.querySelectorAll<HTMLElement>(".tour-layer"));
    const replacementRoot = roots.find((candidate) => candidate !== leavingRoot)!;

    expect(replacementRoot).toBeTruthy();
    await finishTransition(leavingRoot);
    expect(document.body.querySelector(".tour-layer")).toBe(replacementRoot);
    expect(document.body.style.overflow).toBe("hidden");
    expect(onClose).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(replacementRoot.querySelector(".tour-close"));

    document.querySelector("#tour-target-one")?.remove();
    await tick();
    await frame();
    await tick();
    expect(replacementRoot.querySelector(".tour-highlight")).toBeNull();
    expect(replacementRoot.querySelector(".tour-backdrop")).toBeTruthy();

    el.close!();
    await tick();
    await finishTransition(replacementRoot);

    expect(document.body.querySelector(".tour-layer")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("hands Escape ownership to the next Tour while the upper layer leaves", async () => {
    const lower = await mount();
    const upper = await mount();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();

    expect(lower.hasAttribute("data-open")).toBe(true);
    expect(upper.hasAttribute("data-open")).toBe(false);
    const leavingUpper = Array.from(document.body.querySelectorAll<HTMLElement>(".tour-layer")).at(
      -1,
    )!;

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(lower.hasAttribute("data-open")).toBe(false);

    const roots = Array.from(document.body.querySelectorAll<HTMLElement>(".tour-layer"));
    await finishTransition(leavingUpper);
    await finishTransition(roots.find((root) => root !== leavingUpper) ?? null);
    expect(document.body.querySelector(".tour-layer")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("step navigation cancels an offscreen scroll without stealing panel focus", async () => {
    const el = await mount();
    const closeButton = document.body.querySelector<HTMLElement>(".tour-close")!;
    const secondTarget = document.querySelector("#tour-target-two") as HTMLElement;
    secondTarget.getBoundingClientRect = () =>
      ({
        left: 220,
        top: window.innerHeight + 600,
        width: 120,
        height: 40,
        right: 340,
        bottom: window.innerHeight + 640,
        x: 220,
        y: window.innerHeight + 600,
        toJSON: () => ({}),
      }) as DOMRect;
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    el.next!();
    await tick();
    el.prev!();
    await wait(340);

    expect(scrollTo).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(closeButton);
  });

  it("visible 变更会关闭并触发 close", async () => {
    const el = await mount();
    const onClose = vi.fn();
    el.addEventListener("close", onClose);

    el.visible = false;
    await tick();
    await finishTransition(document.body.querySelector(".tour-layer"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector(".tour-layer")).toBeNull();
  });

  it("组件卸载时立即移除传送层，避免遮挡下一路由", async () => {
    const el = await mount();
    expect(document.body.querySelector(".tour-layer")).toBeTruthy();

    el.remove();
    await tick();

    expect(document.body.querySelector(".tour-layer")).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
