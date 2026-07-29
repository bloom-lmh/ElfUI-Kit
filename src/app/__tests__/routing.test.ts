// 路由集成回归测试 — 跑通 elf-link 点击 → router-view 切换页面
//
// 这个测试模拟用户报告的"点击导航无响应"问题

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { createRouter as createRouterFactory } from "@elfui/router";
import { TestButton } from "./test-button-fixture";
import { TestHome } from "./test-home-fixture";

let createRouterForTest: typeof createRouterFactory;

beforeAll(async () => {
  await import("../../components");
  const { App } = await import("../AppShell/index");
  const { createRouter } = await import("@elfui/router");
  const { registerComponents } = await import("@elfui/core");
  createRouterForTest = createRouter;
  registerComponents(App, TestHome, TestButton);
}, 30000);

beforeEach(() => {
  createRouterForTest({
    mode: "memory",
    routes: [
      { path: "/", name: "home", component: "elf-test-home" },
      { path: "/button", name: "button", component: "elf-test-button" },
      { path: "/basic/button", component: "elf-test-button" }
    ]
  });
});

afterEach(() => {
  document.body.innerHTML = "";
  window.history.replaceState(null, "", "#/");
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
const enterComponentDocs = async (): Promise<void> => {
  const { getActiveRouter } = await import("@elfui/router");
  window.history.replaceState(null, "", "#/basic/button");
  await getActiveRouter()!.push("/basic/button");
};

describe("路由跳转", () => {
  it("首页使用独立起始页，进入组件路由后才显示文档壳层", async () => {
    const app = document.createElement("elf-app");
    document.body.appendChild(app);
    await tick();
    await tick();
    await wait(20);

    expect(app.shadowRoot?.querySelector(".home-shell")).toBeTruthy();
    expect(app.shadowRoot?.querySelector("elf-header, elf-aside, elf-footer")).toBeNull();

    await enterComponentDocs();
    await tick();
    await tick();
    await wait(20);
    expect(app.shadowRoot?.querySelector(".home-shell")).toBeNull();
    expect(app.shadowRoot?.querySelector("elf-header")).toBeTruthy();
    expect(app.shadowRoot?.querySelector("elf-menu")).toBeTruthy();
    expect(app.shadowRoot?.querySelector("elf-docs-toc")).toBeTruthy();
  });

  it("AppShell 侧边菜单默认展开分组导航", async () => {
    await enterComponentDocs();
    const app = document.createElement("elf-app");
    document.body.appendChild(app);
    await tick();
    await tick();
    await wait(20);

    const menu = app.shadowRoot?.querySelector("elf-menu");
    expect(menu).toBeTruthy();
    const layout = Array.from(
      menu?.shadowRoot?.querySelectorAll<HTMLButtonElement>(".menu-item") ?? []
    ).find((node) => node.textContent?.includes("布局"));
    layout?.click();
    await tick();
    expect(menu?.shadowRoot?.textContent).toContain("栅格");
    expect(menu?.shadowRoot?.textContent).toContain("弹性布局");
    expect(menu?.shadowRoot?.textContent).toContain("应用骨架");
    expect(menu?.shadowRoot?.textContent).not.toContain("容器");
    expect(menu?.shadowRoot?.textContent).not.toContain("间距");
  });

  it("AppShell setup 早于 router 创建时，菜单点击仍能跳转", async () => {
    const { createRouter, setActiveRouter, getActiveRouter } = await import("@elfui/router");
    setActiveRouter(null);
    window.location.hash = "#/basic/button";

    const app = document.createElement("elf-app");
    document.body.appendChild(app);
    await tick();
    await tick();

    const router = createRouter({
      mode: "memory",
      routes: [
        { path: "/", component: "elf-test-home" },
        { path: "/basic/button", component: "elf-test-button" }
      ]
    });

    const menu = app.shadowRoot?.querySelector("elf-menu");
    const basic = Array.from(
      menu?.shadowRoot?.querySelectorAll<HTMLButtonElement>(".menu-item") ?? []
    ).find((node) => node.textContent?.includes("基础"));
    basic?.click();
    await tick();
    const button = Array.from(
      menu?.shadowRoot?.querySelectorAll<HTMLButtonElement>(".menu-item") ?? []
    ).find((node) => node.textContent?.includes("按钮"));
    expect(button).toBeTruthy();
    button!.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, composed: true })
    );
    await tick();
    await tick();
    await wait(20);

    expect(getActiveRouter()).toBe(router);
    expect(router.current.peek().path).toBe("/basic/button");
  });

  it("router-view 渲染当前路由组件", async () => {
    const view = document.createElement("elf-router-view");
    document.body.appendChild(view);
    await tick();
    await tick();
    await wait(20);

    const child = view.querySelector("elf-test-home");
    expect(child).toBeTruthy();
    expect(child!.shadowRoot!.textContent).toContain("HOME");
  });

  it("router.push 后 router-view 更新", async () => {
    const view = document.createElement("elf-router-view");
    document.body.appendChild(view);
    await tick();
    await tick();
    await wait(20);

    // 初始为 HOME（memory 模式默认 "/"）
    expect(view.querySelector("elf-test-home")).toBeTruthy();

    const { getActiveRouter } = await import("@elfui/router");
    await getActiveRouter()!.push("/button");

    await tick();
    await tick();
    await wait(50);

    expect(view.querySelector("elf-test-button")).toBeTruthy();
  });

  it("切换英文后同步更新侧栏菜单项", async () => {
    await enterComponentDocs();
    localStorage.setItem("elfui-ui-locale", "zh-CN");
    const app = document.createElement("elf-app");
    document.body.appendChild(app);
    await tick();
    await tick();
    await wait(20);

    const routerView = app.shadowRoot?.querySelector("elf-router-view");
    const routePageBefore = routerView?.firstElementChild;
    const languageButton = app.shadowRoot?.querySelector<HTMLElement>(".header-action");
    languageButton?.click();
    await tick();
    await tick();
    await wait(20);

    const menu = app.shadowRoot?.querySelector<HTMLElement & { items?: Array<{ label: string }> }>(
      "elf-menu"
    );
    expect(menu?.items?.[0]?.label).toBe("Getting started");
    expect(menu?.shadowRoot?.textContent).not.toContain("Home");
    expect(menu?.shadowRoot?.textContent).not.toContain("Layout 布局");
    const { getActiveRouter } = await import("@elfui/router");
    expect(getActiveRouter()?.current.peek().path).toBe("/basic/button");
    expect(routerView?.firstElementChild).not.toBe(routePageBefore);
    expect(document.documentElement.lang).toBe("en-US");
  });

  it("窄屏文档壳通过 Header 按钮打开抽屉导航", async () => {
    await enterComponentDocs();
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      media: "(max-width: 720px)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }) as unknown as typeof window.matchMedia;

    const app = document.createElement("elf-app");
    document.body.appendChild(app);
    await tick();
    await tick();
    await wait(20);

    const toggle = app.shadowRoot?.querySelector<HTMLElement>(".icon-action");
    toggle?.click();
    await tick();
    expect(app.shadowRoot?.querySelector(".app-aside.mobile-open")).toBeTruthy();
    expect(app.shadowRoot?.querySelector(".nav-scrim")).toBeTruthy();

    window.matchMedia = originalMatchMedia;
  });

  it("工具类归入指南并保持唯一入口", async () => {
    await enterComponentDocs();
    localStorage.setItem("elfui-ui-locale", "zh-CN");
    const app = document.createElement("elf-app");
    document.body.appendChild(app);
    await tick();
    await tick();
    await wait(20);

    const menu = app.shadowRoot?.querySelector<HTMLElement & {
      items?: Array<{ label: string; icon: string; children?: Array<{ index: string; label: string }> }>;
    }>("elf-menu");
    const guide = menu?.items?.find((item) => item.index === "group:Guide 指南");
    expect(guide).toEqual({
      index: "group:Guide 指南",
      label: "指南",
      icon: "G",
      children: expect.arrayContaining([
        expect.objectContaining({ index: "/providers/config", label: "全局配置" }),
        expect.objectContaining({ index: "/utilities", label: "工具类" })
      ])
    });
    const children = menu?.items?.flatMap((item) => item.children || []) || [];
    expect(children).toEqual(expect.arrayContaining([
        expect.objectContaining({ index: "/data/virtual-list", label: "虚拟列表" }),
        expect.objectContaining({ index: "/data/virtual-table", label: "虚拟表格" })
    ]));
    expect(menu?.items?.some((item) => item.index === "group:Utilities 工具类")).toBe(false);
    expect(menu?.items?.find((item) => item.index === "group:Quality 质量")?.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ index: "/quality/accessibility", label: "无障碍" })
      ])
    );
  });

  it("侧栏不显示首页菜单且品牌按钮返回独立首页", async () => {
    await enterComponentDocs();
    const app = document.createElement("elf-app");
    document.body.appendChild(app);
    await tick();
    await tick();
    await wait(20);

    const menu = app.shadowRoot?.querySelector<HTMLElement & { items?: Array<{ index: string }> }>("elf-menu");
    expect(menu?.items?.some((item) => item.index === "/")).toBe(false);

    const brand = app.shadowRoot?.querySelector<HTMLButtonElement>("button.brand");
    expect(brand?.getAttribute("aria-label")).toBeTruthy();
    brand?.click();
    await tick();
    await tick();
    await wait(20);

    const { getActiveRouter } = await import("@elfui/router");
    expect(getActiveRouter()?.current.peek().path).toBe("/");
    expect(app.shadowRoot?.querySelector(".home-shell")).toBeTruthy();
  });
});
