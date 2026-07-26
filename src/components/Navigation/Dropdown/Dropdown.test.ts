import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { computeAnchoredPosition } from "../../Common/anchored-overlay";
import type { DropdownElement, DropdownItem } from "./types";

beforeAll(async () => {
  await import("../../index");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const flush = async (times = 2): Promise<void> => {
  for (let i = 0; i < times; i += 1) await tick();
};

const defaultItems: DropdownItem[] = [
  { label: "编辑", command: "edit", icon: "E" },
  { label: "归档", command: "archive", disabled: true },
  {
    label: "更多",
    command: "more",
    children: [{ label: "复制", command: "copy" }]
  },
  { label: "删除", command: "delete", divided: true }
];

const mount = async (patch: Partial<DropdownElement> = {}): Promise<DropdownElement> => {
  const el = document.createElement("elf-dropdown") as DropdownElement;
  Object.assign(el, { items: defaultItems, label: "操作", ...patch });
  document.body.appendChild(el);
  await flush();
  return el;
};

const trigger = (el: DropdownElement): HTMLElement =>
  el.shadowRoot!.querySelector(".trigger, .split-toggle") as HTMLElement;

const menu = (el: DropdownElement): HTMLElement | null =>
  el.shadowRoot!.querySelector(".menu");

const openByClick = async (el: DropdownElement): Promise<void> => {
  trigger(el).click();
  await flush();
};

const dispatchKey = (target: EventTarget, key: string): void => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
};

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

describe("elf-dropdown", () => {
  // ─── 基础交互 ─────────────────────────────────────────────

  it("click trigger 打开菜单并触发 visible-change", async () => {
    const el = await mount();
    const onVisible = vi.fn();
    el.addEventListener("visible-change", onVisible as EventListener);

    await openByClick(el);

    expect(el.hasAttribute("data-open")).toBe(true);
    expect(menu(el)?.classList.contains("is-open")).toBe(true);
    expect((onVisible.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
  });

  it("再次点击 trigger 关闭菜单", async () => {
    const el = await mount();
    const onVisible = vi.fn();
    el.addEventListener("visible-change", onVisible as EventListener);

    await openByClick(el);
    await openByClick(el);

    expect(el.hasAttribute("data-open")).toBe(false);
    expect(onVisible).toHaveBeenCalledTimes(2);
    expect((onVisible.mock.calls[1]![0] as CustomEvent).detail).toBe(false);
  });

  it("点击菜单项触发 command 并关闭", async () => {
    const el = await mount();
    const onCommand = vi.fn();
    el.addEventListener("command", onCommand as EventListener);

    await openByClick(el);
    (el.shadowRoot!.querySelector(".item") as HTMLElement).click();
    await flush();

    expect((onCommand.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      command: "edit",
      item: expect.objectContaining({ label: "编辑", command: "edit" })
    });
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("选择后触发器显示当前选中项", async () => {
    const el = await mount();

    await openByClick(el);
    (el.shadowRoot!.querySelector(".item") as HTMLElement).click();
    await flush();

    expect(trigger(el).textContent).toContain("编辑");
    expect(el.shadowRoot!.querySelector(".item.is-selected")?.textContent).toContain("编辑");
  });

  it("hideOnClick=false 时选择后保持展开", async () => {
    const el = await mount({ hideOnClick: false });

    await openByClick(el);
    (el.shadowRoot!.querySelector(".item") as HTMLElement).click();
    await flush();

    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("禁用项不触发 command", async () => {
    const el = await mount();
    const onCommand = vi.fn();
    el.addEventListener("command", onCommand as EventListener);

    await openByClick(el);
    const disabled = el.shadowRoot!.querySelector(".item.is-disabled") as HTMLButtonElement;
    expect(disabled).toBeTruthy();
    expect(disabled.disabled).toBe(true);
    disabled.click();
    await flush();

    expect(onCommand).not.toHaveBeenCalled();
    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("嵌套子菜单项可以触发 command", async () => {
    const el = await mount();
    const onCommand = vi.fn();
    el.addEventListener("command", onCommand as EventListener);

    await openByClick(el);
    (el.shadowRoot!.querySelector(".sub-menu .item") as HTMLElement).click();
    await flush();

    expect((onCommand.mock.calls[0]![0] as CustomEvent).detail.command).toBe("copy");
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("divided 项带有 is-divided 类", async () => {
    const el = await mount();
    await openByClick(el);

    const divided = el.shadowRoot!.querySelector(".item.is-divided");
    expect(divided?.textContent).toContain("删除");
  });

  // ─── 触发方式 ─────────────────────────────────────────────

  it("hover trigger 可以打开", async () => {
    const el = await mount({ trigger: "hover", showTimeout: 0 });

    el.shadowRoot!.querySelector(".dropdown")!.dispatchEvent(new MouseEvent("mouseenter"));
    await flush();

    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("hover 离开时延迟关闭，允许鼠标移入菜单", async () => {
    vi.useFakeTimers();
    const el = await mount({ trigger: "hover", showTimeout: 0, hideTimeout: 180 });
    const root = el.shadowRoot!.querySelector(".dropdown")!;

    root.dispatchEvent(new MouseEvent("mouseenter"));
    await flush();
    expect(el.hasAttribute("data-open")).toBe(true);

    root.dispatchEvent(new MouseEvent("mouseleave"));
    await vi.advanceTimersByTimeAsync(120);
    await flush();
    expect(el.hasAttribute("data-open")).toBe(true);

    root.dispatchEvent(new MouseEvent("mouseenter"));
    await vi.advanceTimersByTimeAsync(220);
    await flush();
    expect(el.hasAttribute("data-open")).toBe(true);

    root.dispatchEvent(new MouseEvent("mouseleave"));
    await vi.advanceTimersByTimeAsync(220);
    await flush();
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("contextmenu trigger 打开菜单", async () => {
    const el = await mount({ trigger: "contextmenu" });
    const root = el.shadowRoot!.querySelector(".dropdown")!;

    root.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    await flush();

    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("click 模式下 contextmenu 不打开", async () => {
    const el = await mount({ trigger: "click" });
    const root = el.shadowRoot!.querySelector(".dropdown")!;

    root.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    await flush();

    expect(el.hasAttribute("data-open")).toBe(false);
  });

  // ─── 禁用态 ───────────────────────────────────────────────

  it("disabled 时点击不打开", async () => {
    const el = await mount({ disabled: true });
    expect(el.hasAttribute("disabled")).toBe(true);

    await openByClick(el);
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("disabled 时 openMenu 无效", async () => {
    const el = await mount({ disabled: true });
    el.openMenu?.();
    await flush();
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("disabled 时 hover 不打开", async () => {
    const el = await mount({ disabled: true, trigger: "hover", showTimeout: 0 });
    el.shadowRoot!.querySelector(".dropdown")!.dispatchEvent(new MouseEvent("mouseenter"));
    await flush();
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  // ─── 暴露方法与键盘 ───────────────────────────────────────

  it("supports collision-safe menu methods", async () => {
    const el = await mount();

    el.openMenu?.();
    await flush();
    expect(el.hasAttribute("data-open")).toBe(true);

    el.closeMenu?.();
    await flush();
    expect(el.hasAttribute("data-open")).toBe(false);

    el.toggleMenu?.();
    await flush();
    expect(el.hasAttribute("data-open")).toBe(true);

    el.toggleMenu?.();
    await flush();
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("triggerKeys 可自定义键盘触发", async () => {
    const el = await mount({ triggerKeys: ["ArrowDown"] });

    dispatchKey(trigger(el), "Enter");
    await flush();
    expect(el.hasAttribute("data-open")).toBe(false);

    dispatchKey(trigger(el), "ArrowDown");
    await flush();
    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("Escape 关闭已打开菜单", async () => {
    const el = await mount();
    await openByClick(el);
    expect(el.hasAttribute("data-open")).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await flush();

    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("moves focus out of the menu before hiding a persistent popover", async () => {
    const el = await mount({ persistent: true, teleported: true });
    await openByClick(el);

    const item = el.shadowRoot!.querySelector<HTMLButtonElement>(".item")!;
    item.focus();
    expect(el.shadowRoot!.activeElement).toBe(item);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await flush();

    expect(el.shadowRoot!.activeElement).toBe(trigger(el));
    expect(menu(el)?.getAttribute("aria-hidden")).toBe("true");
    expect(menu(el)?.hasAttribute("inert")).toBe(true);
  });

  it("菜单内 ArrowDown / ArrowUp / Home / End 移动焦点", async () => {
    const el = await mount({
      items: [
        { label: "A", command: "a" },
        { label: "B", command: "b" },
        { label: "C", command: "c" }
      ]
    });

    await openByClick(el);
    await flush();

    const items = Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>(".item"));
    expect(items.length).toBe(3);

    // 打开后聚焦第一项（兼容 shadowRoot.activeElement 与 document.activeElement）
    items[0]!.focus();
    const focused = (): Element | null =>
      el.shadowRoot!.activeElement || document.activeElement;

    const menuEl = menu(el)!;
    dispatchKey(menuEl, "ArrowDown");
    await flush();
    expect(focused()).toBe(items[1]);

    dispatchKey(menuEl, "ArrowUp");
    await flush();
    expect(focused()).toBe(items[0]);

    dispatchKey(menuEl, "End");
    await flush();
    expect(focused()).toBe(items[2]);

    dispatchKey(menuEl, "Home");
    await flush();
    expect(focused()).toBe(items[0]);
  });

  // ─── 分裂按钮 ─────────────────────────────────────────────

  it("splitButton 主按钮触发 click，侧按钮打开菜单", async () => {
    const el = await mount({ splitButton: true, label: "主操作" });
    const onClick = vi.fn();
    el.addEventListener("click", onClick as EventListener);

    const main = el.shadowRoot!.querySelector(".split-main") as HTMLElement;
    const toggleBtn = el.shadowRoot!.querySelector(".split-toggle") as HTMLElement;
    expect(main).toBeTruthy();
    expect(toggleBtn).toBeTruthy();
    expect(main.textContent).toContain("主操作");

    main.click();
    await flush();
    // emit("click") 会派发 CustomEvent；部分环境还会冒泡原生 click
    expect(onClick).toHaveBeenCalled();
    expect(el.hasAttribute("data-open")).toBe(false);

    toggleBtn.click();
    await flush();
    expect(el.hasAttribute("data-open")).toBe(true);
  });

  // ─── 样式 / 兼容配置 ─────────────────────────────────────

  it("supports type, popper class/style, button props and non-persistent panel", async () => {
    const el = await mount({
      type: "primary",
      buttonProps: { class: "extra-trigger", style: { width: "120px" } },
      popperClass: "extra-menu",
      popperStyle: { width: "220px" },
      persistent: false
    });

    expect(menu(el)).toBeNull();
    await openByClick(el);

    const triggerEl = trigger(el);
    const menuEl = menu(el)!;
    expect(triggerEl.className).toContain("is-primary");
    expect(triggerEl.className).toContain("extra-trigger");
    expect(triggerEl.getAttribute("style")).toContain("width: 120px");
    expect(menuEl.className).toContain("extra-menu");
    expect(menuEl.getAttribute("style")).toContain("width: 220px");
    expect(el.getAttribute("type")).toBe("primary");
  });

  it("size / placement / effect 同步到 host attribute", async () => {
    const el = await mount({ size: "lg", placement: "top-end", effect: "dark" });
    expect(el.getAttribute("size")).toBe("lg");
    expect(el.getAttribute("placement")).toBe("top-end");
    expect(el.getAttribute("effect")).toBe("dark");

    await openByClick(el);
    expect(menu(el)?.classList.contains("is-top-end")).toBe(true);
    expect(menu(el)?.classList.contains("is-dark")).toBe(true);
  });

  it("close-on-click-outside=false 保持展开", async () => {
    const el = await mount({ closeOnClickOutside: false });

    await openByClick(el);
    document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    await flush();

    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("打开另一个 Dropdown 时会收起前一个实例", async () => {
    const first = await mount({ label: "第一个" });
    const second = await mount({ label: "第二个" });

    await openByClick(first);
    expect(first.hasAttribute("data-open")).toBe(true);

    await openByClick(second);

    expect(first.hasAttribute("data-open")).toBe(false);
    expect(menu(first)?.classList.contains("is-open")).toBeFalsy();
    expect(second.hasAttribute("data-open")).toBe(true);
    expect(menu(second)?.classList.contains("is-open")).toBe(true);
  });

  // ─── 字段映射 ─────────────────────────────────────────────

  it("支持自定义 field names", async () => {
    const el = await mount({
      items: [
        { title: "保存", action: "save", locked: false },
        { title: "丢弃", action: "discard", locked: true }
      ] as unknown as DropdownItem[],
      props: {
        label: "title",
        command: "action",
        disabled: "locked"
      }
    });
    const onCommand = vi.fn();
    el.addEventListener("command", onCommand as EventListener);

    await openByClick(el);
    const labels = Array.from(el.shadowRoot!.querySelectorAll(".item-label")).map((n) =>
      n.textContent?.trim()
    );
    expect(labels).toContain("保存");
    expect(labels).toContain("丢弃");

    const disabled = el.shadowRoot!.querySelector(".item.is-disabled") as HTMLButtonElement;
    expect(disabled?.textContent).toContain("丢弃");
    expect(disabled.disabled).toBe(true);

    (el.shadowRoot!.querySelector(".item:not(:disabled)") as HTMLElement).click();
    await flush();
    expect((onCommand.mock.calls[0]![0] as CustomEvent).detail.command).toBe("save");
  });

  it("菜单项带有 menuitem role", async () => {
    const el = await mount();
    await openByClick(el);
    const menuitems = el.shadowRoot!.querySelectorAll('[role="menuitem"]');
    expect(menuitems.length).toBeGreaterThan(0);
  });

  it("supports the default trigger slot and compositional menu items", async () => {
    const el = document.createElement("elf-dropdown") as DropdownElement;
    el.trigger = "click";
    el.innerHTML = `
      <span class="custom-trigger">Account actions</span>
      <elf-dropdown-menu slot="dropdown">
        <elf-dropdown-item command="profile" icon="fallback"><span slot="icon">P</span>Profile</elf-dropdown-item>
        <elf-dropdown-item command="locked" disabled>Locked</elf-dropdown-item>
        <elf-dropdown-item command="logout" divided>Logout</elf-dropdown-item>
      </elf-dropdown-menu>
    `;
    const onCommand = vi.fn();
    el.addEventListener("command", onCommand as EventListener);
    document.body.appendChild(el);
    await flush();

    const triggerSlot = el.shadowRoot!.querySelector(".trigger slot:not([name])") as HTMLSlotElement;
    expect(triggerSlot.assignedElements()[0]?.textContent).toContain("Account actions");

    await openByClick(el);
    const items = Array.from(el.querySelectorAll("elf-dropdown-item"));
    expect(menu(el)?.getAttribute("role")).toBe("presentation");
    expect(items[1]!.hasAttribute("disabled")).toBe(true);
    const iconSlot = items[0]!.shadowRoot!.querySelector('slot[name="icon"]') as HTMLSlotElement;
    expect(iconSlot.assignedElements()[0]?.textContent).toBe("P");
    expect(items[0]!.shadowRoot!.querySelector(".dropdown-item")?.getAttribute("aria-label")).toBe("Profile");

    (items[0]!.shadowRoot!.querySelector(".dropdown-item") as HTMLElement).click();
    await flush();

    expect((onCommand.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      command: "profile",
      item: expect.objectContaining({ label: "Profile", command: "profile" })
    });
    expect(items[0]!.hasAttribute("data-selected")).toBe(true);
    expect(items[0]!.shadowRoot!.querySelector(".dropdown-item")?.getAttribute("aria-current")).toBe("true");
    expect(items[2]!.hasAttribute("data-selected")).toBe(false);
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  it("keeps compositional selection after reopening and skips disabled items with the keyboard", async () => {
    const el = document.createElement("elf-dropdown") as DropdownElement;
    el.trigger = "click";
    el.innerHTML = `
      <span>Account actions</span>
      <elf-dropdown-menu slot="dropdown">
        <elf-dropdown-item command="profile">Profile</elf-dropdown-item>
        <elf-dropdown-item command="locked" disabled>Locked</elf-dropdown-item>
        <elf-dropdown-item command="logout">Logout</elf-dropdown-item>
      </elf-dropdown-menu>
    `;
    document.body.appendChild(el);
    await flush();
    await openByClick(el);

    const composedItems = Array.from(el.querySelectorAll("elf-dropdown-item"));
    const profileButton = composedItems[0]!.shadowRoot!.querySelector<HTMLButtonElement>(".dropdown-item")!;
    const logoutButton = composedItems[2]!.shadowRoot!.querySelector<HTMLButtonElement>(".dropdown-item")!;
    const focusLogout = vi.spyOn(logoutButton, "focus");
    profileButton.focus();
    profileButton.dispatchEvent(new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      composed: true,
      cancelable: true
    }));
    expect(focusLogout).toHaveBeenCalled();
    logoutButton.click();
    await flush();

    await openByClick(el);
    expect(composedItems[2]!.hasAttribute("data-selected")).toBe(true);
    expect(logoutButton.getAttribute("aria-current")).toBe("true");
    expect(composedItems[1]!.hasAttribute("disabled")).toBe(true);
  });

  it("preserves non-string commands from compositional items", async () => {
    const el = document.createElement("elf-dropdown") as DropdownElement;
    el.trigger = "click";
    el.innerHTML = `<elf-dropdown-item slot="dropdown">Open record</elf-dropdown-item>`;
    const item = el.querySelector("elf-dropdown-item") as HTMLElement & { command?: unknown };
    const command = { id: 42 };
    item.command = command;
    const onCommand = vi.fn();
    el.addEventListener("command", onCommand as EventListener);
    document.body.appendChild(el);
    await flush();

    await openByClick(el);
    (item.shadowRoot!.querySelector(".dropdown-item") as HTMLElement).click();
    await flush();

    expect((onCommand.mock.calls[0]![0] as CustomEvent).detail.command).toEqual(command);
  });

  it("supports multiple trigger modes", async () => {
    const el = await mount({ trigger: ["click", "contextmenu"] });
    const root = el.shadowRoot!.querySelector(".dropdown")!;

    root.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
    await flush();
    expect(el.hasAttribute("data-open")).toBe(true);

    el.closeMenu();
    await flush();
    trigger(el).click();
    await flush();
    expect(el.hasAttribute("data-open")).toBe(true);
  });

  it("supports an HTMLElement virtual trigger and fixed positioning", async () => {
    const reference = document.createElement("button");
    const addListener = vi.spyOn(reference, "addEventListener");
    reference.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 20,
      right: 160,
      bottom: 80,
      width: 60,
      height: 60,
      x: 100,
      y: 20,
      toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    document.body.appendChild(reference);

    const el = await mount({
      virtualTriggering: true,
      virtualRef: reference,
      trigger: "click",
      maxHeight: 240
    });
    expect(el.shadowRoot!.querySelector(".trigger, .split-toggle")).toBeNull();
    expect(addListener).toHaveBeenCalledWith("click", expect.any(Function));

    reference.click();
    await flush(3);

    const menuEl = menu(el)!;
    expect(el.hasAttribute("data-virtual-triggering")).toBe(true);
    expect(el.hasAttribute("data-open")).toBe(true);
    expect(menuEl.style.position).toBe("fixed");
    expect(menuEl.style.left).toBe("100px");
    expect(menuEl.style.top).toBe("86px");
    expect(menuEl.style.getPropertyValue("--dropdown-max-height")).toBe("240px");
  });

  it("computes viewport flip and collision shifting", () => {
    const result = computeAnchoredPosition(
      { left: 260, top: 180, right: 320, bottom: 220, width: 60, height: 40 },
      { width: 180, height: 120 },
      { width: 320, height: 240 },
      { placement: "bottom-end", offset: [0, 8], padding: 8, flip: true }
    );

    expect(result).toEqual({ left: 132, top: 52, placement: "top-end" });
  });

  it("closes top-layer popovers on external scroll", async () => {
    const el = await mount({
      teleported: true,
      appendTo: "#overlay-root",
      popperOptions: {
        modifiers: [
          { name: "offset", options: { offset: [12, 18] } },
          { name: "preventOverflow", options: { padding: 10 } }
        ]
      }
    });
    let anchorLeft = 100;
    trigger(el).getBoundingClientRect = vi.fn(() => ({
      left: anchorLeft,
      top: 100,
      right: anchorLeft + 60,
      bottom: 140,
      width: 60,
      height: 40,
      x: anchorLeft,
      y: 100,
      toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    const menuEl = menu(el)! as HTMLElement & { showPopover: () => void; hidePopover: () => void };
    menuEl.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 200,
      bottom: 120,
      width: 200,
      height: 120,
      x: 0,
      y: 0,
      toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    menuEl.showPopover = vi.fn();
    menuEl.hidePopover = vi.fn();

    await openByClick(el);
    await frame();

    expect(menuEl.showPopover).toHaveBeenCalled();
    expect(menuEl.getAttribute("popover")).toBe("manual");
    expect(menuEl.dataset.appendTo).toBe("#overlay-root");
    expect(menuEl.style.position).toBe("fixed");
    expect(menuEl.style.left).toBe("112px");
    expect(menuEl.style.top).toBe("158px");

    menuEl.dispatchEvent(new Event("scroll", { bubbles: true, composed: true }));
    await frame();
    expect(trigger(el).getAttribute("aria-expanded")).toBe("true");

    window.dispatchEvent(new Event("scroll"));
    await frame();
    expect(trigger(el).getAttribute("aria-expanded")).toBe("false");

    await openByClick(el);
    expect(menuEl.hidePopover).toHaveBeenCalled();
  });
});
