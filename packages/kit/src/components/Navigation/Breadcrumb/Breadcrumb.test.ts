import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
  history.replaceState(null, "", "/");
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface BreadcrumbEl extends HTMLElement {
  items?: unknown[];
  separator?: string;
  separatorIcon?: string;
  router?: boolean;
  currentPath?: string;
  maxItems?: number;
  props?: Record<string, string>;
}

const mount = async (patch: Partial<BreadcrumbEl> = {}): Promise<BreadcrumbEl> => {
  const el = document.createElement("elf-breadcrumb") as BreadcrumbEl;
  Object.assign(el, {
    items: [
      { label: "首页", to: "/" },
      { label: "数据展示", to: "/data" },
      { label: "表格", to: "/data/table" },
    ],
    ...patch,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const text = (el: BreadcrumbEl): string =>
  Array.from(el.shadowRoot!.querySelectorAll(".breadcrumb-item"))
    .map((node) => node.textContent?.replace(/\s+/g, " ").trim())
    .join(" ");

describe("elf-breadcrumb", () => {
  it("渲染面包屑导航和分隔符", async () => {
    const el = await mount();

    expect(text(el)).toContain("首页 /");
    expect(text(el)).toContain("数据展示 /");
    expect(text(el)).toContain("表格");
    expect(el.shadowRoot!.querySelector(".is-current")?.textContent).toContain("表格");
  });

  it("点击非当前项触发 click 并支持 router hash", async () => {
    const el = await mount({ router: true });
    const onClick = vi.fn();
    el.addEventListener("click", onClick as unknown as EventListener);

    (el.shadowRoot!.querySelector(".breadcrumb-link") as HTMLElement).click();
    await tick();
    await tick();

    expect(onClick).toHaveBeenCalled();
    expect((onClick.mock.calls[0]![0] as CustomEvent).detail[1]).toBe("/");
    expect(window.location.hash).toBe("#/");
    expect(el.shadowRoot!.querySelector(".is-current")?.textContent).toContain("首页");
  });

  it("currentPath 可控制当前激活项", async () => {
    const el = await mount({ currentPath: "/data" });

    expect(el.shadowRoot!.querySelector(".is-current")?.textContent).toContain("数据展示");
    expect(text(el)).toContain("数据展示 /");
  });

  it("非受控模式点击后也会更新当前激活项", async () => {
    const el = await mount();

    (el.shadowRoot!.querySelector(".breadcrumb-link") as HTMLElement).click();
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".is-current")?.textContent).toContain("首页");
  });

  it("支持字段别名", async () => {
    const el = await mount({
      props: { label: "name", to: "path", disabled: "locked" },
      items: [
        { name: "控制台", path: "/dashboard" },
        { name: "分析", path: "/dashboard/analytics" },
      ],
    });

    expect(text(el)).toContain("控制台");
    expect(text(el)).toContain("分析");
  });

  it("maxItems 过长折叠为省略项", async () => {
    const el = await mount({
      maxItems: 3,
      items: [
        { label: "A", to: "/a" },
        { label: "B", to: "/b" },
        { label: "C", to: "/c" },
        { label: "D", to: "/d" },
      ],
    });

    expect(text(el)).toContain("A / ... / D");
    expect(el.shadowRoot!.querySelector(".is-ellipsis")).toBeTruthy();
  });

  it("supports separatorIcon", async () => {
    const el = await mount({ separatorIcon: ">" });
    const icon = el.shadowRoot!.querySelector(".breadcrumb-separator-icon") as HTMLElement & {
      name?: string;
    };

    expect(icon.name || icon.getAttribute("name")).toBe(">");
  });

  it("normalizes common named separator icons to compact glyphs", async () => {
    const el = await mount({ separatorIcon: "chevron_right" });
    const icon = el.shadowRoot!.querySelector(".breadcrumb-separator-icon") as HTMLElement & {
      name?: string;
    };

    expect(icon.name || icon.getAttribute("name")).toBe("›");
  });

  it("supports route object and replace navigation", async () => {
    const replaceState = vi.spyOn(window.history, "replaceState");
    const el = await mount({
      router: true,
      items: [
        { label: "Docs", to: { path: "/docs" }, replace: true },
        { label: "API", to: "/docs/api" },
      ],
    });

    (el.shadowRoot!.querySelector(".breadcrumb-link") as HTMLElement).click();
    await tick();
    await tick();

    expect(replaceState).toHaveBeenCalledWith(null, "", "#/docs");
    expect(window.location.hash).toBe("#/docs");
    expect(el.shadowRoot!.querySelector(".is-current")?.textContent).toContain("Docs");
  });

  it("prevents disabled router links from navigating", async () => {
    const el = await mount({
      router: true,
      items: [
        { label: "Home", to: "/", disabled: true },
        { label: "Current", to: "/current" },
      ],
    });
    const onClick = vi.fn();
    el.addEventListener("click", onClick as unknown as EventListener);
    const link = el.shadowRoot!.querySelector<HTMLAnchorElement>(".breadcrumb-link")!;
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });

    link.dispatchEvent(event);
    await tick();

    expect(event.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports compositional breadcrumb items and parent-managed separators", async () => {
    const el = document.createElement("elf-breadcrumb") as BreadcrumbEl;
    el.router = true;
    el.separatorIcon = ">";
    el.innerHTML = `
      <elf-breadcrumb-item to="/">首页</elf-breadcrumb-item>
      <elf-breadcrumb-item to="/docs">文档</elf-breadcrumb-item>
      <elf-breadcrumb-item>API</elf-breadcrumb-item>
    `;
    document.body.appendChild(el);
    await tick();
    await tick();

    const children = Array.from(el.querySelectorAll("elf-breadcrumb-item")) as Array<
      HTMLElement & {
        current?: boolean;
        last?: boolean;
        separatorIcon?: string;
      }
    >;
    expect(children[2]!.current).toBe(true);
    expect(children[2]!.last).toBe(true);
    expect(children[0]!.separatorIcon).toBe(">");

    const onClick = vi.fn();
    el.addEventListener("click", onClick as EventListener);
    (children[0]!.shadowRoot!.querySelector("button") as HTMLButtonElement).click();
    await tick();
    await tick();
    expect((onClick.mock.calls[0]![0] as CustomEvent).detail[1]).toBe("/");
    expect(children[0]!.current).toBe(true);
    expect(window.location.hash).toBe("#/");
  });
});
