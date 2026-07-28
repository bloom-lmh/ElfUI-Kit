import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { computeAnchoredPosition } from "../../Common/anchored-overlay";
import type { CascaderOption } from "./types";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const flushFilter = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await tick();
  await tick();
};

interface CascaderEl extends HTMLElement {
  modelValue?: unknown;
  options?: CascaderOption[];
  clearable?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  checkable?: boolean;
  panelMode?: "auto" | "columns" | "tree";
  treeThreshold?: number;
  filterable?: boolean;
  debounce?: number;
  filterMethod?: (node: { label: string }, keyword: string) => boolean;
  beforeFilter?: (keyword: string) => boolean | Promise<boolean>;
  collapseTags?: boolean;
  collapseTagsTooltip?: boolean;
  maxCollapseTags?: number;
  itemSize?: number;
  height?: number;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  fitInputWidth?: boolean;
  popperOptions?: Record<string, unknown>;
  emptyValues?: unknown[];
  valueOnClear?: unknown | (() => unknown);
  clearIcon?: string;
  props?: Record<string, unknown>;
  clear?: () => void;
}

interface CascaderPanelEl extends HTMLElement {
  modelValue?: unknown[] | unknown[][];
  options?: CascaderOption[];
  multiple?: boolean;
  checkable?: boolean;
  props?: Record<string, unknown>;
  getCheckedNodes?: (leafOnly?: boolean) => unknown[];
  clearCheckedNodes?: () => void;
}

const options: CascaderOption[] = [
  {
    label: "浙江",
    value: "zhejiang",
    children: [
      { label: "杭州", value: "hangzhou" },
      { label: "宁波", value: "ningbo" }
    ]
  },
  {
    label: "江苏",
    value: "jiangsu",
    children: [{ label: "南京", value: "nanjing", disabled: true }]
  }
];

const mount = async (patch: Partial<CascaderEl> = {}): Promise<CascaderEl> => {
  const el = document.createElement("elf-cascader") as CascaderEl;
  Object.assign(el, { options, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const mountPanel = async (patch: Partial<CascaderPanelEl> = {}): Promise<CascaderPanelEl> => {
  const el = document.createElement("elf-cascader-panel") as CascaderPanelEl;
  Object.assign(el, { options, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-cascader", () => {
  it("keeps complete parent and child labels in multiple tags", async () => {
    const el = await mount({
      multiple: true,
      collapseTags: true,
      modelValue: [["zhejiang", "hangzhou"], ["zhejiang", "ningbo"]]
    });

    expect(el.shadowRoot!.querySelector(".tag-label")?.textContent?.trim()).toBe("浙江 / 杭州");
    expect(el.shadowRoot!.querySelector(".collapsed-tag")?.textContent?.trim()).toBe("+1");
  });

  it("点击 trigger 展开根级选项", async () => {
    const el = await mount();

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();

    expect(el.hasAttribute("data-open")).toBe(true);
    expect(el.shadowRoot!.querySelectorAll(".column")).toHaveLength(1);
    expect(el.shadowRoot!.textContent).toContain("浙江");
  });

  it("automatically switches paths deeper than the threshold to a compact tree", async () => {
    const deepOptions: CascaderOption[] = [
      {
        label: "产品",
        value: "product",
        children: [
          {
            label: "平台",
            value: "platform",
            children: [
              {
                label: "组件库",
                value: "components",
                children: [{ label: "稳定版", value: "stable" }]
              }
            ]
          }
        ]
      }
    ];
    const el = await mount({ options: deepOptions, teleported: false });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    el.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    await tick();
    expect(el.shadowRoot!.querySelector(".tree-panel")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".columns")).toBeNull();

    for (let level = 0; level < 4; level += 1) {
      const entries = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tree-option");
      entries[entries.length - 1]!.click();
      await tick();
    }

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      "product",
      "platform",
      "components",
      "stable"
    ]);
  });

  it("supports explicitly forcing the columns or tree panel", async () => {
    const deepOptions: CascaderOption[] = [{
      label: "A",
      value: "a",
      children: [{ label: "B", value: "b", children: [{ label: "C", value: "c", children: [{ label: "D", value: "d" }] }] }]
    }];
    const columns = await mount({ options: deepOptions, panelMode: "columns", teleported: false });
    columns.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    await tick();
    expect(columns.shadowRoot!.querySelector(".columns")).toBeTruthy();

    columns.remove();
    const tree = await mount({ panelMode: "tree", teleported: false });
    tree.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    await tick();
    expect(tree.shadowRoot!.querySelector(".tree-panel")).toBeTruthy();
  });

  it("supports hierarchical keyboard navigation in tree mode", async () => {
    const el = await mount({ panelMode: "tree", teleported: false });
    const trigger = el.shadowRoot!.querySelector<HTMLElement>(".trigger")!;

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();
    await tick();
    let root = el.shadowRoot!.querySelector<HTMLButtonElement>('.tree-option[aria-level="1"]')!;
    expect(el.shadowRoot!.activeElement).toBe(root);

    root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector('.tree-option[aria-level="2"]')).toBeTruthy();

    root = el.shadowRoot!.querySelector<HTMLButtonElement>('.tree-option[aria-level="1"]')!;
    root.focus();
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    const child = el.shadowRoot!.querySelector<HTMLButtonElement>('.tree-option[aria-level="2"]')!;
    expect(el.shadowRoot!.activeElement).toBe(child);

    child.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.activeElement).toBe(root);
  });

  it("supports optional linked checkboxes and indeterminate state in tree mode", async () => {
    const deepOptions: CascaderOption[] = [{
      label: "产品",
      value: "product",
      children: [{
        label: "平台",
        value: "platform",
        children: [{
          label: "组件库",
          value: "components",
          children: [
            { label: "稳定版", value: "stable" },
            { label: "预览版", value: "preview" }
          ]
        }]
      }]
    }];
    const el = await mount({ options: deepOptions, panelMode: "tree", checkable: true, teleported: false });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    el.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    await tick();
    el.shadowRoot!.querySelector<HTMLElement>('.tree-option[aria-level="1"] .option-checkbox')!.click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      ["product", "platform", "components", "stable"],
      ["product", "platform", "components", "preview"]
    ]);
    expect(el.shadowRoot!.querySelector('.tree-option[aria-level="1"] .option-checkbox.is-checked')).toBeTruthy();

    el.shadowRoot!.querySelector<HTMLElement>('.tree-option[aria-level="2"] .option-checkbox')!.click();
    await tick();
    el.shadowRoot!.querySelector<HTMLElement>('.tree-option[aria-level="3"] .option-checkbox')!.click();
    await tick();
    el.shadowRoot!.querySelector<HTMLElement>('.tree-option[aria-level="4"] .option-checkbox')!.click();
    await tick();

    expect(el.shadowRoot!.querySelector('.tree-option[aria-level="1"] .option-checkbox.is-indeterminate')).toBeTruthy();
    el.shadowRoot!.querySelector<HTMLButtonElement>('.tree-option[aria-level="1"]')!.click();
    await tick();
    expect(el.shadowRoot!.querySelector('.tree-option[aria-level="4"]')).toBeTruthy();
  });

  it("lets a checkable tree parent row select all descendant leaves", async () => {
    const deepOptions: CascaderOption[] = [{
      label: "产品",
      value: "product",
      children: [{
        label: "平台",
        value: "platform",
        children: [
          { label: "稳定版", value: "stable" },
          { label: "预览版", value: "preview" }
        ]
      }]
    }];
    const el = await mount({ options: deepOptions, panelMode: "tree", checkable: true, teleported: false });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    el.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    await tick();
    el.shadowRoot!.querySelector<HTMLButtonElement>('.tree-option[aria-level="1"]')!.click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      ["product", "platform", "stable"],
      ["product", "platform", "preview"]
    ]);
    expect(el.shadowRoot!.querySelector('.tree-option[aria-level="1"] .option-checkbox.is-checked')).toBeTruthy();
  });

  it("maps item size and panel height to the public CSS variables", async () => {
    const el = await mount({ itemSize: 38, height: 152 });

    expect(el.style.getPropertyValue("--_cascader-item-size")).toBe("38px");
    expect(el.style.getPropertyValue("--_cascader-height")).toBe("152px");
  });

  it("keeps an active indeterminate parent label in the rendered option row", async () => {
    const el = await mount({
      multiple: true,
      modelValue: [["zhejiang", "hangzhou"]],
      teleported: false
    });

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();

    const firstOption = el.shadowRoot!.querySelector<HTMLElement>(".option")!;
    const label = firstOption.querySelector<HTMLElement>(".option-label")!;
    expect(firstOption.classList.contains("is-indeterminate")).toBe(true);
    expect(label.textContent?.trim()).toBe("浙江");
  });

  it("supports trigger and menu keyboard navigation", async () => {
    const el = await mount({ teleported: false });
    const trigger = el.shadowRoot!.querySelector<HTMLElement>(".trigger")!;

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();
    await tick();
    const items = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".option");
    expect(el.hasAttribute("data-open")).toBe(true);
    expect(el.shadowRoot!.activeElement).toBe(items[0]);

    items[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(el.shadowRoot!.activeElement).toBe(items[1]);
    items[1].dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(el.hasAttribute("data-open")).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(trigger);
    const closedDropdown = el.shadowRoot!.querySelector<HTMLElement>(".dropdown")!;
    expect(closedDropdown.getAttribute("aria-hidden")).toBe("true");
    expect(closedDropdown.hasAttribute("inert")).toBe(true);
  });

  it("keeps vertical focus in one column and supports horizontal keyboard navigation", async () => {
    const el = await mount({
      multiple: true,
      modelValue: [["zhejiang", "hangzhou"]],
      teleported: false
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    const trigger = el.shadowRoot!.querySelector<HTMLElement>(".trigger")!;

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();
    await tick();

    const rootOption = el.shadowRoot!.querySelector<HTMLButtonElement>(".column .option")!;
    rootOption.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    await tick();

    const columns = el.shadowRoot!.querySelectorAll<HTMLElement>(".column");
    const childOptions = columns[1]!.querySelectorAll<HTMLButtonElement>(".option");
    expect(columns).toHaveLength(2);
    expect(el.shadowRoot!.activeElement).toBe(childOptions[0]);

    childOptions[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(el.shadowRoot!.activeElement).toBe(childOptions[1]);
    expect(childOptions[0].classList.contains("is-selected")).toBe(true);
    expect(childOptions[1].classList.contains("is-selected")).toBe(false);

    childOptions[1].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      ["zhejiang", "hangzhou"],
      ["zhejiang", "ningbo"]
    ]);

    childOptions[1].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.activeElement).toBe(rootOption);
  });

  it("选择叶子节点触发 update:modelValue 和 change", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".column")).toHaveLength(2);

    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["zhejiang", "hangzhou"]);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail.path).toEqual(["浙江", "杭州"]);
    expect(el.hasAttribute("data-open")).toBe(false);
    expect(el.shadowRoot!.querySelector(".value")?.textContent).toContain("浙江 / 杭州");
  });

  it("传入 modelValue 时回显完整路径", async () => {
    const el = await mount({ modelValue: ["zhejiang", "ningbo"] });

    expect(el.shadowRoot!.querySelector(".value")?.textContent).toContain("浙江 / 宁波");
  });

  it("禁用选项不可选择", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[1] as HTMLElement).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect(onUpdate).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".option.is-disabled")).toBeTruthy();
  });

  it("clearable 可以清空值", async () => {
    const el = await mount({ modelValue: ["zhejiang", "hangzhou"], clearable: true });
    const onClear = vi.fn();
    const onUpdate = vi.fn();
    el.addEventListener("clear", onClear);
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".clear") as HTMLElement).click();
    await tick();

    expect(onClear).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual([]);
    expect(el.shadowRoot!.querySelector(".placeholder")).toBeTruthy();
  });

  it("supports custom empty values, clear value, and clear icon", async () => {
    const empty = await mount({ modelValue: 0, emptyValues: [0], clearable: true });
    expect(empty.shadowRoot!.querySelector(".placeholder")).toBeTruthy();

    const el = await mount({
      modelValue: ["zhejiang", "hangzhou"],
      clearable: true,
      clearIcon: "clear",
      valueOnClear: () => 0
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    const clear = el.shadowRoot!.querySelector<HTMLButtonElement>(".clear")!;
    expect(clear.textContent).toBe("clear");
    clear.click();
    await tick();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(0);
  });

  it("multiple 多选叶子节点时输出二维路径数组", async () => {
    const el = await mount({ multiple: true });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[1] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      ["zhejiang", "hangzhou"],
      ["zhejiang", "ningbo"]
    ]);
    expect(el.hasAttribute("data-open")).toBe(true);
    expect(el.shadowRoot!.querySelector(".value")?.textContent).toContain("浙江 / 杭州");
    expect(el.shadowRoot!.querySelector(".value")?.textContent).toContain("浙江 / 宁波");
  });

  it("支持 Element Plus props.multiple 写法并默认展示复选框", async () => {
    const el = await mount({ props: { multiple: true } });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect(el.shadowRoot!.querySelector(".option-checkbox")).toBeTruthy();
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      ["zhejiang", "hangzhou"]
    ]);
  });

  it("props.emitPath=false 时对外输出末级值", async () => {
    const el = await mount({ props: { emitPath: false } });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[1] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("ningbo");
  });

  it("checkable 点击父项会勾选子叶子并支持半选态", async () => {
    const el = await mount({ checkable: true });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual([
      ["zhejiang", "hangzhou"],
      ["zhejiang", "ningbo"]
    ]);
    expect(el.shadowRoot!.querySelector(".option-checkbox.is-checked")).toBeTruthy();

    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([
      ["zhejiang", "ningbo"]
    ]);
    expect(el.shadowRoot!.querySelector(".option-checkbox.is-indeterminate")).toBeTruthy();
  });

  it("cascader-panel 独立面板支持选择和暴露已选节点", async () => {
    const el = await mountPanel();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".column")).toHaveLength(2);

    (
      el.shadowRoot!.querySelectorAll(".column")[1]!.querySelectorAll(".option")[0] as HTMLElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["zhejiang", "hangzhou"]);
    expect(el.getCheckedNodes?.()[0]).toMatchObject({
      label: "杭州",
      pathLabels: ["浙江", "杭州"]
    });
  });

  it("cascader-panel 多选面板支持清空已选节点", async () => {
    const el = await mountPanel({ multiple: true, modelValue: [["zhejiang", "hangzhou"]] });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    expect(el.shadowRoot!.querySelector(".option-checkbox.is-checked")).toBeTruthy();
    el.clearCheckedNodes?.();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual([]);
    expect(el.getCheckedNodes?.()).toEqual([]);
  });

  it("cascader-panel 切换父项时保留新的活动面板", async () => {
    const el = await mountPanel({
      checkable: true,
      modelValue: [["zhejiang", "ningbo"]]
    });
    const rootOptions = el.shadowRoot!.querySelectorAll(".column:first-child .option");

    (rootOptions[1] as HTMLButtonElement).click();
    await tick();

    expect(rootOptions[1]?.classList.contains("is-active")).toBe(true);
    const columns = el.shadowRoot!.querySelectorAll(".column");
    expect(columns).toHaveLength(2);
    expect(columns[1]?.textContent).toContain("南京");
    expect(columns[1]?.textContent).not.toContain("杭州");
  });

  it("filters selectable paths and selects the matching result", async () => {
    const el = await mount({ filterable: true, debounce: 0 });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".filter-input")!;
    input.value = "杭州";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await flushFilter();

    const results = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".filter-option");
    expect(results).toHaveLength(1);
    expect(results[0].textContent).toContain("杭州");
    results[0].focus();
    results[0].click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["zhejiang", "hangzhou"]);
    expect(el.hasAttribute("data-open")).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelector(".trigger"));
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>(".dropdown")!;
    expect(dropdown.getAttribute("aria-hidden")).toBe("true");
    expect(dropdown.hasAttribute("inert")).toBe(true);
  });

  it("honors custom and asynchronous pre-filter hooks", async () => {
    const beforeFilter = vi.fn(async (keyword: string) => keyword !== "blocked");
    const filterMethod = vi.fn((node: { label: string }, keyword: string) => node.label === "宁波" && keyword === "city");
    const el = await mount({ filterable: true, debounce: 0, beforeFilter, filterMethod });
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".filter-input")!;

    input.value = "blocked";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await flushFilter();
    expect(beforeFilter).toHaveBeenCalledWith("blocked");
    expect(el.shadowRoot!.querySelectorAll(".filter-option")).toHaveLength(0);

    input.value = "city";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await flushFilter();
    expect(filterMethod).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelectorAll(".filter-option")).toHaveLength(1);
    expect(el.shadowRoot!.querySelector(".filter-option")?.textContent).toContain("宁波");
  });

  it("loads lazy children and recovers after a rejected request", async () => {
    const resolveLoader = vi.fn((_node: unknown, resolve: (children: CascaderOption[]) => void) => {
      resolve([{ label: "动态子项", value: "child", leaf: true }]);
    });
    const el = await mount({
      options: [{ label: "动态节点", value: "dynamic" }],
      props: { lazy: true, lazyLoad: resolveLoader }
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelector(".option") as HTMLButtonElement).click();
    await tick();

    expect(resolveLoader).toHaveBeenCalledTimes(1);
    expect(el.shadowRoot!.querySelectorAll(".column")).toHaveLength(2);
    expect(el.shadowRoot!.textContent).toContain("动态子项");
    (el.shadowRoot!.querySelectorAll(".column")[1]!.querySelector(".option") as HTMLButtonElement).click();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["dynamic", "child"]);

    const rejectLoader = vi.fn((_node: unknown, _resolve: unknown, reject: () => void) => reject());
    const rejected = await mount({
      options: [{ label: "失败节点", value: "failed" }],
      props: { lazy: true, lazyLoad: rejectLoader }
    });
    (rejected.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    const option = rejected.shadowRoot!.querySelector(".option") as HTMLButtonElement;
    option.click();
    option.click();
    expect(rejectLoader).toHaveBeenCalledTimes(2);
  });

  it("renders removable multiple tags and emits the removed model item", async () => {
    const el = await mount({
      multiple: true,
      clearable: true,
      modelValue: [["zhejiang", "hangzhou"], ["zhejiang", "ningbo"]]
    });
    const onRemove = vi.fn();
    const onUpdate = vi.fn();
    el.addEventListener("remove-tag", onRemove as EventListener);
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const removeButtons = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tag-remove");
    expect(removeButtons).toHaveLength(2);
    removeButtons[0].click();
    await tick();

    expect((onRemove.mock.calls[0]![0] as CustomEvent).detail).toEqual(["zhejiang", "hangzhou"]);
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual([["zhejiang", "ningbo"]]);
    expect(el.shadowRoot!.textContent).not.toContain("浙江 / 杭州");
  });

  it("exposes collapsed tag labels as an opt-in tooltip", async () => {
    const el = await mount({
      multiple: true,
      collapseTags: true,
      collapseTagsTooltip: true,
      maxCollapseTags: 1,
      modelValue: [["zhejiang", "hangzhou"], ["zhejiang", "ningbo"]]
    });

    const collapsed = el.shadowRoot!.querySelector<HTMLElement>(".collapsed-tag")!;
    expect(collapsed.textContent).toContain("+1");
    expect(collapsed.title).toContain("浙江 / 宁波");
  });

  it("closes a top-layer panel on external scroll", async () => {
    const el = await mount({
      appendTo: "#overlay-root",
      fitInputWidth: true,
      popperOptions: {
        modifiers: [
          { name: "offset", options: { offset: [10, 14] } },
          { name: "preventOverflow", options: { padding: 8 } }
        ]
      }
    });
    const trigger = el.shadowRoot!.querySelector<HTMLElement>(".trigger")!;
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>(".dropdown")! as HTMLElement & {
      showPopover: () => void;
      hidePopover: () => void;
    };
    let anchorLeft = 80;
    trigger.getBoundingClientRect = vi.fn(() => ({
      left: anchorLeft,
      top: 60,
      right: anchorLeft + 260,
      bottom: 96,
      width: 260,
      height: 36,
      x: anchorLeft,
      y: 60,
      toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    dropdown.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 368,
      bottom: 212,
      width: 368,
      height: 212,
      x: 0,
      y: 0,
      toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    dropdown.showPopover = vi.fn();
    dropdown.hidePopover = vi.fn();

    trigger.click();
    await tick();
    await frame();
    await tick();

    expect(dropdown.showPopover).toHaveBeenCalled();
    expect(dropdown.getAttribute("popover")).toBe("manual");
    expect(dropdown.dataset.appendTo).toBe("#overlay-root");
    expect(dropdown.style.position).toBe("fixed");
    expect(dropdown.style.left).toBe("90px");
    expect(dropdown.style.top).toBe("110px");
    expect(dropdown.style.width).toBe("260px");

    dropdown.dispatchEvent(new Event("scroll", { bubbles: true, composed: true }));
    await tick();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");

    window.dispatchEvent(new Event("scroll"));
    await frame();
    await tick();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(dropdown.hidePopover).toHaveBeenCalled();
  });

  it("keeps a non-fitted overlay at its intrinsic menu width", async () => {
    const el = await mount({ fitInputWidth: false });
    const trigger = el.shadowRoot!.querySelector<HTMLElement>(".trigger")!;
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>(".dropdown")! as HTMLElement & {
      showPopover: () => void;
      hidePopover: () => void;
    };

    trigger.getBoundingClientRect = vi.fn(() => ({
      left: 80,
      top: 60,
      right: 340,
      bottom: 96,
      width: 260,
      height: 36,
      x: 80,
      y: 60,
      toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    dropdown.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 142,
      bottom: 212,
      width: 142,
      height: 212,
      x: 0,
      y: 0,
      toJSON: () => ({})
    })) as unknown as Element["getBoundingClientRect"];
    dropdown.showPopover = vi.fn();
    dropdown.hidePopover = vi.fn();

    trigger.click();
    await tick();
    await frame();
    await tick();

    expect(dropdown.showPopover).toHaveBeenCalled();
    expect(dropdown.style.width).toBe("auto");
    expect(dropdown.style.minWidth).toBe("0px");
  });

  it("reflects the shared field surface contract", async () => {
    const el = await mount({});
    el.setAttribute("variant", "outlined");
    el.setAttribute("label", "Region");
    await tick();

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.hasAttribute("data-has-label")).toBe(true);
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Region");
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Region");
  });

  it.each(["default", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the shared %s field variant",
    async (variant) => {
      const el = await mount({});
      el.setAttribute("variant", variant);
      await tick();
      expect(el.getAttribute("variant")).toBe(variant);
    }
  );

  it("chooses the best configured fallback placement", () => {
    const result = computeAnchoredPosition(
      { left: 260, top: 180, right: 320, bottom: 220, width: 60, height: 40 },
      { width: 180, height: 120 },
      { width: 320, height: 240 },
      {
        placement: "bottom-start",
        fallbackPlacements: ["top-end"],
        padding: 8,
        flip: true
      }
    );

    expect(result.placement).toBe("top-end");
    expect(result.left).toBe(132);
  });
});
