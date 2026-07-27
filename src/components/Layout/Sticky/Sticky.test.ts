import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface StickyEl extends HTMLElement {
  offset?: number | string;
  position?: "top" | "bottom";
  target?: string;
  top?: number | string;
  bottom?: number | string;
  zIndex?: number | string;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  disabled?: boolean;
  update(): void;
  updateRoot(): void;
}

const mount = async (patch: Partial<StickyEl> = {}): Promise<StickyEl> => {
  const el = document.createElement("elf-sticky") as StickyEl;
  Object.assign(el, patch);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-sticky", () => {
  it("通过 CSS 变量设置吸附偏移和层级", async () => {
    const el = await mount({ top: 12, zIndex: 30 });

    expect(el.style.getPropertyValue("--sticky-top")).toBe("12px");
    expect(el.style.getPropertyValue("--sticky-z-index")).toBe("30");
  });

  it("bottom 模式会反射 data-bottom", async () => {
    const el = await mount({ bottom: 16 });

    expect(el.hasAttribute("data-bottom")).toBe(true);
    expect(el.style.getPropertyValue("--sticky-bottom")).toBe("16px");
  });

  it("supports offset and position aliases with semantic reflection", async () => {
    const el = await mount({ offset: 24, position: "bottom" });

    expect(el.getAttribute("data-position")).toBe("bottom");
    expect(el.style.getPropertyValue("--sticky-offset")).toBe("24px");
    expect(el.style.getPropertyValue("--sticky-bottom")).toBe("24px");
  });

  it("滚动到吸附位置时触发 change", async () => {
    const el = await mount({ top: 8 });
    const onChange = vi.fn();
    const onScroll = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    el.addEventListener("scroll", onScroll as EventListener);
    el.getBoundingClientRect = () =>
      ({
        top: 4,
        right: 100,
        bottom: 44,
        left: 0,
        width: 100,
        height: 40,
        x: 0,
        y: 4,
        toJSON: () => ({})
      }) as DOMRect;

    window.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await tick();

    expect(el.hasAttribute("data-stuck")).toBe(true);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
    expect((onScroll.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual({ scrollTop: 0, fixed: true });
  });

  it("在内部滚动容器中按容器边界判断吸附状态", async () => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "auto";
    document.body.appendChild(wrapper);
    wrapper.getBoundingClientRect = () =>
      ({
        top: 100,
        right: 300,
        bottom: 300,
        left: 0,
        width: 300,
        height: 200,
        x: 0,
        y: 100,
        toJSON: () => ({})
      }) as DOMRect;
    const el = document.createElement("elf-sticky") as StickyEl;
    el.top = 12;
    wrapper.appendChild(el);
    await tick();
    await tick();
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    el.getBoundingClientRect = () =>
      ({
        top: 108,
        right: 300,
        bottom: 148,
        left: 0,
        width: 300,
        height: 40,
        x: 0,
        y: 108,
        toJSON: () => ({})
      }) as DOMRect;

    wrapper.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await tick();

    expect(el.hasAttribute("data-stuck")).toBe(true);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
  });

  it("exposes update methods and resolves a target container", async () => {
    const target = document.createElement("section");
    target.id = "sticky-boundary";
    document.body.appendChild(target);
    const el = await mount({ target: "#sticky-boundary" });

    expect(typeof el.update).toBe("function");
    expect(typeof el.updateRoot).toBe("function");
    expect(() => el.updateRoot()).not.toThrow();
    expect(() => el.update()).not.toThrow();
  });

  it("projects light DOM into appendTo when teleported", async () => {
    const target = document.createElement("div");
    target.id = "sticky-portal";
    document.body.appendChild(target);
    const el = document.createElement("elf-sticky") as StickyEl;
    el.teleported = true;
    el.appendTo = target;
    el.innerHTML = "<button>保存</button>";
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    expect(target.querySelector(".elf-sticky-portal button")?.textContent).toBe("保存");
    expect(el.hasAttribute("data-teleported")).toBe(true);
  });

  it("teleported 模式会把可见层固定在目标容器边界内", async () => {
    const wrapper = document.createElement("section");
    wrapper.id = "sticky-scroll-boundary";
    wrapper.style.overflow = "auto";
    wrapper.getBoundingClientRect = () =>
      ({ top: 100, right: 320, bottom: 300, left: 20, width: 300, height: 200, x: 20, y: 100, toJSON: () => ({}) }) as DOMRect;
    document.body.appendChild(wrapper);

    const el = document.createElement("elf-sticky") as StickyEl;
    el.target = "#sticky-scroll-boundary";
    el.top = 12;
    el.teleported = true;
    el.innerHTML = "<strong>目标工具栏</strong>";
    wrapper.appendChild(el);
    await tick();
    await tick();
    await tick();

    el.getBoundingClientRect = () =>
      ({ top: 60, right: 300, bottom: 100, left: 30, width: 270, height: 40, x: 30, y: 60, toJSON: () => ({}) }) as DOMRect;
    const portal = document.querySelector<HTMLElement>(".elf-sticky-portal")!;
    portal.getBoundingClientRect = () =>
      ({ top: 60, right: 300, bottom: 100, left: 30, width: 270, height: 40, x: 30, y: 60, toJSON: () => ({}) }) as DOMRect;

    wrapper.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await tick();

    expect(portal.dataset.fixed).toBe("true");
    expect(portal.style.top).toBe("112px");
    expect(portal.style.left).toBe("30px");
    expect(portal.style.width).toBe("270px");
  });

  it("外层滚动容器移动目标区域时会持续重算 Teleport 边界", async () => {
    const outer = document.createElement("main");
    outer.style.overflow = "auto";
    document.body.appendChild(outer);
    const target = document.createElement("section");
    target.id = "nested-sticky-target";
    target.style.overflow = "auto";
    outer.appendChild(target);

    let targetTop = 180;
    target.getBoundingClientRect = () =>
      ({ top: targetTop, right: 420, bottom: targetTop + 240, left: 20, width: 400, height: 240, x: 20, y: targetTop, toJSON: () => ({}) }) as DOMRect;

    const el = document.createElement("elf-sticky") as StickyEl;
    el.target = "#nested-sticky-target";
    el.offset = 12;
    el.teleported = true;
    el.innerHTML = "<strong>边界工具栏</strong>";
    target.appendChild(el);
    await tick();
    await tick();
    await tick();

    const portal = document.querySelector<HTMLElement>(".elf-sticky-portal")!;
    el.getBoundingClientRect = () =>
      ({ top: targetTop - 40, right: 410, bottom: targetTop, left: 30, width: 380, height: 40, x: 30, y: targetTop - 40, toJSON: () => ({}) }) as DOMRect;
    portal.getBoundingClientRect = () =>
      ({ top: targetTop - 40, right: 410, bottom: targetTop, left: 30, width: 380, height: 40, x: 30, y: targetTop - 40, toJSON: () => ({}) }) as DOMRect;

    target.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await tick();
    expect(portal.style.top).toBe("192px");

    targetTop = 56;
    outer.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await tick();

    expect(portal.style.top).toBe("68px");
    expect(Number.parseFloat(portal.style.top)).toBeGreaterThanOrEqual(targetTop);
    expect(Number.parseFloat(portal.style.top) + 40).toBeLessThanOrEqual(targetTop + 240);

    const removeListener = vi.spyOn(outer, "removeEventListener");
    el.remove();
    await tick();
    expect(removeListener).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("clamps stale projected geometry back inside the target container", async () => {
    const target = document.createElement("section");
    target.id = "sticky-clamp-target";
    target.style.overflow = "auto";
    target.getBoundingClientRect = () =>
      ({ top: 100, right: 320, bottom: 300, left: 20, width: 300, height: 200, x: 20, y: 100, toJSON: () => ({}) }) as DOMRect;
    document.body.appendChild(target);

    const el = document.createElement("elf-sticky") as StickyEl;
    el.target = "#sticky-clamp-target";
    el.teleported = true;
    el.innerHTML = "<strong>Toolbar</strong>";
    target.appendChild(el);
    await tick();
    await tick();
    await tick();

    el.getBoundingClientRect = () =>
      ({ top: 330, right: 1480, bottom: 370, left: 600, width: 880, height: 40, x: 600, y: 330, toJSON: () => ({}) }) as DOMRect;
    const portal = document.querySelector<HTMLElement>(".elf-sticky-portal")!;
    portal.getBoundingClientRect = () =>
      ({ top: 330, right: 1480, bottom: 370, left: 600, width: 880, height: 40, x: 600, y: 330, toJSON: () => ({}) }) as DOMRect;

    target.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await tick();

    expect(portal.style.left).toBe("20px");
    expect(portal.style.top).toBe("260px");
    expect(portal.style.width).toBe("300px");
  });
});
