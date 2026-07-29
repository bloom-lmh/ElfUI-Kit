import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createOverlayInteractionController } from "../../Common/overlay/overlay-interaction-controller";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
  history.replaceState(null, "", "/");
  vi.useRealTimers();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface MenuEl extends HTMLElement {
  items?: unknown[];
  modelValue?: string;
  defaultOpeneds?: string[];
  mode?: string;
  uniqueOpened?: boolean;
  collapse?: boolean;
  showToggle?: boolean;
  theme?: string;
  menuTrigger?: string;
  showTimeout?: number;
  hideTimeout?: number;
  ellipsis?: boolean;
  ellipsisIcon?: string;
  popperClass?: string;
  popperStyle?: Record<string, string>;
  props?: Record<string, string>;
  router?: boolean;
  searchable?: boolean;
  updateActiveIndex?: (index: string) => void;
  handleResize?: () => void;
  open?: (index: string) => void;
  close?: (index: string) => void;
}

interface SubMenuEl extends HTMLElement {
  index?: string;
  title?: string;
  popperOffset?: number;
  popperStyle?: Record<string, string>;
  expandCloseIcon?: string;
  expandOpenIcon?: string;
}

interface MenuItemEl extends HTMLElement {
  index?: string;
  title?: string;
  route?: string | Record<string, unknown>;
  disabled?: boolean;
}

const items = [
  { index: "/dashboard", label: "Dashboard", icon: "D" },
  {
    index: "/workspace",
    label: "Workspace",
    icon: "W",
    children: [
      { index: "/workspace/projects", label: "Projects" },
      { index: "/workspace/tasks", label: "Tasks", disabled: true }
    ]
  },
  {
    index: "/settings",
    label: "Settings",
    icon: "S",
    children: [{ index: "/settings/profile", label: "Profile" }]
  }
];

const mount = async (): Promise<MenuEl> => {
  const el = document.createElement("elf-menu") as MenuEl;
  el.items = items;
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const labels = (el: MenuEl): string[] =>
  Array.from(el.shadowRoot!.querySelectorAll(".menu-label")).map(
    (node) => node.textContent?.trim() || ""
  );

describe("elf-menu", () => {
  it("渲染顶层菜单", async () => {
    const el = await mount();
    expect(labels(el)).toEqual(["Dashboard", "Workspace", "Settings"]);
  });

  it("点击父级展开子菜单并触发 open", async () => {
    const el = await mount();
    const onOpen = vi.fn();
    el.addEventListener("open", onOpen as unknown as EventListener);

    (el.shadowRoot!.querySelectorAll(".menu-item")[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(labels(el)).toContain("Projects");
    expect(onOpen).toHaveBeenCalled();
    expect((onOpen.mock.calls[0]![0] as CustomEvent).detail[0]).toBe("/workspace");
  });

  it("选择叶子菜单时更新 modelValue 并触发 select", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onSelect = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("select", onSelect as unknown as EventListener);

    (el.shadowRoot!.querySelectorAll(".menu-item")[1] as HTMLElement).click();
    await tick();
    await tick();
    (el.shadowRoot!.querySelectorAll(".menu-item")[2] as HTMLElement).click();
    await tick();
    await tick();

    expect(onUpdate).toHaveBeenCalled();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("/workspace/projects");
    expect(onSelect).toHaveBeenCalled();
    const activeItems = el.shadowRoot!.querySelectorAll(".menu-item.is-active");
    const activeTexts = Array.from(activeItems).map((e) => e.textContent);
    expect(activeTexts.some((t) => t?.includes("Projects"))).toBe(true);
  });

  it("禁用菜单项不可选择", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (el.shadowRoot!.querySelectorAll(".menu-item")[1] as HTMLElement).click();
    await tick();
    await tick();
    (el.shadowRoot!.querySelectorAll(".menu-item")[3] as HTMLElement).click();
    await tick();
    await tick();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("uniqueOpened 只保留一个展开分支", async () => {
    const el = await mount();
    el.uniqueOpened = true;
    await tick();
    await tick();

    (el.shadowRoot!.querySelectorAll(".menu-item")[1] as HTMLElement).click();
    await tick();
    await tick();
    expect(labels(el)).toContain("Projects");

    const settingsButton = Array.from(el.shadowRoot!.querySelectorAll(".menu-item")).find((node) =>
      node.textContent?.includes("Settings")
    ) as HTMLElement;
    settingsButton.click();
    await tick();
    await tick();

    expect(labels(el)).not.toContain("Projects");
    expect(labels(el)).toContain("Profile");
  });

  it("defaultOpeneds 不阻止后续交互展开其他分支", async () => {
    const el = document.createElement("elf-menu") as MenuEl;
    el.items = items;
    el.defaultOpeneds = ["/workspace"];
    el.uniqueOpened = true;
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(labels(el)).toContain("Projects");

    const settingsButton = Array.from(el.shadowRoot!.querySelectorAll(".menu-item")).find((node) =>
      node.textContent?.includes("Settings")
    ) as HTMLElement;
    settingsButton.click();
    await tick();
    await tick();

    expect(labels(el)).not.toContain("Projects");
    expect(labels(el)).toContain("Profile");
  });

  it("group 菜单支持显式 index 作为默认展开 key", async () => {
    const el = document.createElement("elf-menu") as MenuEl;
    el.items = [
      {
        index: "group:docs",
        group: "Docs",
        children: [{ index: "/docs/start", label: "Start" }]
      }
    ];
    el.defaultOpeneds = ["group:docs"];
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(labels(el)).toContain("Start");
  });

  it("水平模式不会重复声明 header slot", async () => {
    const el = await mount();
    el.mode = "horizontal";
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelectorAll('slot[name="header"]').length).toBe(1);
  });

  it("horizontal 模式显示顶部栏和子菜单面板", async () => {
    const el = await mount();
    el.mode = "horizontal";
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".horizontal-bar")).toBeTruthy();
    (el.shadowRoot!.querySelectorAll(".menu-item")[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".horizontal-panel")).toBeTruthy();
    expect(labels(el)).toContain("Projects");
  });

  it("horizontal 模式不会根据 defaultOpeneds 初始展开面板", async () => {
    const el = document.createElement("elf-menu") as MenuEl;
    el.items = items;
    el.mode = "horizontal";
    el.defaultOpeneds = ["/workspace"];
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".horizontal-panel")).toBeNull();

    (el.shadowRoot!.querySelectorAll(".menu-item")[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".horizontal-panel")).toBeTruthy();
  });

  it("折叠 hover 浮层跟随当前菜单项", async () => {
    const el = await mount();
    el.collapse = true;
    await tick();
    await tick();

    const menu = el.shadowRoot!.querySelector(".menu") as HTMLElement;
    const workspaceButton = Array.from(el.shadowRoot!.querySelectorAll(".menu-item")).find((node) =>
      node.textContent?.includes("Workspace")
    ) as HTMLElement;
    menu.getBoundingClientRect = () =>
      ({
        top: 10,
        left: 0,
        right: 64,
        bottom: 300,
        width: 64,
        height: 290,
        x: 0,
        y: 10,
        toJSON: () => ({})
      }) as DOMRect;
    workspaceButton.getBoundingClientRect = () =>
      ({
        top: 98,
        left: 0,
        right: 64,
        bottom: 142,
        width: 64,
        height: 44,
        x: 0,
        y: 98,
        toJSON: () => ({})
      }) as DOMRect;

    workspaceButton.dispatchEvent(new MouseEvent("mouseenter"));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await tick();

    const popup = el.shadowRoot!.querySelector(".collapse-popup") as HTMLElement;
    expect(popup.style.top).toBe("88px");
  });

  it("折叠切换按钮默认放在 header 区域", async () => {
    const el = await mount();
    el.showToggle = true;
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".menu-header")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".menu-header-content slot[name='header']")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".menu-toggle-slot--header .collapse-toggle")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".menu-footer .collapse-toggle")).toBeFalsy();
  });

  it("keeps the header toggle inside the dark theme surface", async () => {
    const el = await mount();
    el.theme = "dark";
    el.showToggle = true;
    await tick();
    await tick();

    expect(el.getAttribute("theme")).toBe("dark");
    expect(el.shadowRoot!.querySelector(".menu-toggle-slot--header .collapse-toggle")).toBeTruthy();
  });

  it("supports a custom toggle in the header slot", async () => {
    const el = await mount();
    el.showToggle = true;
    (el as unknown as { togglePlacement: string }).togglePlacement = "header";
    const customToggle = document.createElement("button");
    customToggle.slot = "toggle";
    customToggle.textContent = "Toggle navigation";
    el.appendChild(customToggle);
    await tick();
    await tick();

    customToggle.click();
    await tick();

    expect(el.shadowRoot!.querySelector(".menu")?.classList.contains("is-collapsed")).toBe(true);
  });

  it("自定义搜索插槽仍可驱动菜单过滤", async () => {
    const el = await mount();
    el.searchable = true;
    const customSearch = document.createElement("input");
    customSearch.slot = "search";
    customSearch.setAttribute("aria-label", "自定义菜单搜索");
    el.appendChild(customSearch);
    await tick();
    await tick();

    customSearch.value = "Settings";
    customSearch.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
    await tick();

    const labels = Array.from(el.shadowRoot!.querySelectorAll(".menu-label"), (node) => node.textContent?.trim());
    expect(labels).toContain("Settings");
    expect(labels).not.toContain("Dashboard");
  });

  it("搜索后选择菜单项会清空搜索并恢复完整菜单", async () => {
    const el = document.createElement("elf-menu") as MenuEl;
    el.items = [
      { index: "/dashboard", label: "Dashboard" },
      { index: "/projects", label: "Projects" },
      { index: "/settings", label: "Settings" }
    ];
    el.searchable = true;
    document.body.appendChild(el);
    await tick();
    await tick();

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".search-input")!;
    input.value = "Dashboard";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await tick();
    expect(labels(el)).toEqual(["Dashboard"]);

    el.shadowRoot!.querySelector<HTMLButtonElement>(".menu-item")!.click();
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector<HTMLInputElement>(".search-input")?.value).toBe("");
    expect(labels(el)).toEqual(["Dashboard", "Projects", "Settings"]);
  });

  it("supports menuTrigger hover timeout and closeOnClickOutside=false", async () => {
    vi.useFakeTimers();
    const el = await mount();
    el.mode = "horizontal";
    el.menuTrigger = "hover";
    el.showTimeout = 80;
    el.hideTimeout = 120;
    (el as unknown as { closeOnClickOutside: boolean }).closeOnClickOutside = false;
    await tick();
    await tick();

    const workspace = el.shadowRoot!.querySelectorAll(".menu-item")[1] as HTMLElement;
    workspace.dispatchEvent(new MouseEvent("mouseenter"));
    await tick();
    expect(el.shadowRoot!.querySelector(".horizontal-panel")).toBeNull();

    await vi.advanceTimersByTimeAsync(90);
    await tick();
    expect(el.shadowRoot!.querySelector(".horizontal-panel")).toBeTruthy();

    document.body.click();
    await tick();
    expect(el.shadowRoot!.querySelector(".horizontal-panel")).toBeTruthy();
    vi.useRealTimers();
  });

  it("closes horizontal panels only when the menu owns the outside interaction", async () => {
    const el = await mount();
    el.mode = "horizontal";
    await tick();
    await tick();

    const workspace = el.shadowRoot!.querySelector('[data-index="/workspace"]') as HTMLElement;
    workspace.click();
    await tick();
    expect(workspace.getAttribute("aria-expanded")).toBe("true");

    const childOverlay = createOverlayInteractionController({ kind: "menu-test-child" });
    childOverlay.activate();
    document.body.click();
    await tick();
    expect(workspace.getAttribute("aria-expanded")).toBe("true");

    childOverlay.dispose();
    document.body.click();
    await tick();
    expect(workspace.getAttribute("aria-expanded")).toBe("false");
  });

  it("supports title alias, route navigation, ellipsis and expose helpers", async () => {
    const el = document.createElement("elf-menu") as MenuEl;
    el.props = { label: "title", route: "to" };
    el.items = [
      { index: "home", title: "Home", to: "/home" },
      { index: "docs", title: "Docs", children: [{ index: "guide", title: "Guide", to: "/guide" }] }
    ];
    el.mode = "horizontal";
    el.router = true;
    el.ellipsis = true;
    el.ellipsisIcon = "more";
    el.popperClass = "menu-popper";
    el.popperStyle = { width: "260px" };
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(labels(el)).toContain("Home");
    expect(el.shadowRoot!.querySelector(".menu-ellipsis")?.textContent).toContain("more");

    (el.shadowRoot!.querySelectorAll(".menu-item")[1] as HTMLElement).click();
    await tick();
    expect(el.shadowRoot!.querySelector(".horizontal-panel")?.className).toContain("menu-popper");
    expect((el.shadowRoot!.querySelector(".horizontal-panel") as HTMLElement).style.width).toBe("260px");

    el.updateActiveIndex!("home");
    await tick();
    expect(el.shadowRoot!.querySelector(".menu-item.is-active")?.textContent).toContain("Home");

    (el.shadowRoot!.querySelectorAll(".menu-item")[0] as HTMLElement).click();
    await tick();
    expect(window.location.hash).toBe("#/home");

    el.handleResize!();
  });

  it("supports elf-sub-menu, elf-menu-item-group and elf-menu-item composition", async () => {
    const el = document.createElement("elf-menu") as MenuEl;
    const subMenu = document.createElement("elf-sub-menu") as SubMenuEl;
    subMenu.index = "workspace";
    const subMenuTitle = document.createElement("span");
    subMenuTitle.slot = "title";
    subMenuTitle.textContent = "Workspace";

    const group = document.createElement("elf-menu-item-group");
    (group as unknown as { title: string }).title = "Delivery";
    const project = document.createElement("elf-menu-item") as MenuItemEl;
    project.index = "workspace/projects";
    project.title = "Projects";
    project.route = { path: "/projects" };
    const disabled = document.createElement("elf-menu-item") as MenuItemEl;
    disabled.index = "workspace/archive";
    disabled.title = "Archive";
    disabled.disabled = true;

    group.append(project, disabled);
    subMenu.append(subMenuTitle, group);
    el.append(subMenu);
    el.defaultOpeneds = ["workspace"];
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(labels(el)).toEqual(["Workspace", "Projects", "Archive"]);
    expect(el.shadowRoot!.querySelector(".menu-group-title")?.textContent).toContain("Delivery");
    expect(el.shadowRoot!.querySelector('[data-index="workspace"]')?.getAttribute("aria-expanded")).toBe("true");

    const onItemClick = vi.fn();
    project.addEventListener("click", onItemClick);
    (el.shadowRoot!.querySelector('[data-index="workspace/projects"]') as HTMLElement).click();
    await tick();

    const detail = (onItemClick.mock.calls[0]![0] as CustomEvent).detail;
    expect(detail).toEqual({
      index: "workspace/projects",
      indexPath: ["workspace", "workspace/projects"],
      route: { path: "/projects" }
    });
  });

  it("honors submenu popper overrides and custom expand icons", async () => {
    const el = document.createElement("elf-menu") as MenuEl;
    el.mode = "horizontal";
    const subMenu = document.createElement("elf-sub-menu") as SubMenuEl;
    subMenu.index = "products";
    subMenu.title = "Products";
    subMenu.popperOffset = 18;
    subMenu.popperStyle = { width: "280px" };
    subMenu.expandCloseIcon = "+";
    subMenu.expandOpenIcon = "−";
    const item = document.createElement("elf-menu-item") as MenuItemEl;
    item.index = "products/cloud";
    item.title = "Cloud";
    subMenu.append(item);
    el.append(subMenu);
    document.body.appendChild(el);
    await tick();
    await tick();

    const trigger = el.shadowRoot!.querySelector('[data-index="products"]') as HTMLElement;
    expect(trigger.textContent).toContain("+");
    trigger.click();
    await tick();

    const panel = el.shadowRoot!.querySelector(".horizontal-panel") as HTMLElement;
    expect(trigger.textContent).toContain("−");
    expect(panel.style.width).toBe("280px");
    expect(panel.style.marginTop).toBe("18px");
  });

  it("supports roving focus, ArrowRight open, ArrowLeft close and Escape", async () => {
    const el = await mount();
    const workspace = el.shadowRoot!.querySelector('[data-index="/workspace"]') as HTMLElement;
    workspace.focus();
    workspace.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const project = el.shadowRoot!.querySelector('[data-index="/workspace/projects"]') as HTMLElement;
    expect(workspace.getAttribute("aria-expanded")).toBe("true");
    expect(el.shadowRoot!.activeElement).toBe(project);

    project.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await tick();
    expect(workspace.getAttribute("aria-expanded")).toBe("false");

    workspace.click();
    await tick();
    workspace.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(workspace.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps inactive poppers only when persistent is enabled", async () => {
    const persistentMenu = await mount();
    persistentMenu.mode = "horizontal";
    await tick();
    await tick();
    (persistentMenu.shadowRoot!.querySelector('[data-index="/workspace"]') as HTMLElement).click();
    await tick();
    (persistentMenu.shadowRoot!.querySelector('.horizontal-panel [data-index="/workspace/projects"]') as HTMLElement).click();
    await tick();

    const hiddenPanel = persistentMenu.shadowRoot!.querySelector(".horizontal-panel");
    expect(hiddenPanel?.classList.contains("is-hidden")).toBe(true);
    expect(hiddenPanel?.getAttribute("aria-hidden")).toBe("true");
    expect(hiddenPanel?.hasAttribute("inert")).toBe(true);

    const disposableMenu = await mount();
    disposableMenu.mode = "horizontal";
    (disposableMenu as unknown as { persistent: boolean }).persistent = false;
    await tick();
    await tick();
    (disposableMenu.shadowRoot!.querySelector('[data-index="/workspace"]') as HTMLElement).click();
    await tick();
    (disposableMenu.shadowRoot!.querySelector('.horizontal-panel [data-index="/workspace/projects"]') as HTMLElement).click();
    await tick();

    expect(disposableMenu.shadowRoot!.querySelector(".horizontal-panel")).toBeNull();
  });
});
