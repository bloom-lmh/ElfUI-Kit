// @ts-nocheck
// elf-select 单元测试

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

interface SelectEl extends HTMLElement {
  options?: unknown;
  props?: Record<string, string>;
  modelValue?: unknown;
  multiple?: boolean;
  multipleLimit?: number;
  clearable?: boolean;
  filterable?: boolean;
  allowCreate?: boolean;
  defaultFirstOption?: boolean;
  remote?: boolean;
  persistent?: boolean;
  popperClass?: string;
  popperStyle?: Record<string, string>;
  loading?: boolean;
  debounce?: number;
  virtual?: boolean;
  virtualThreshold?: number;
  itemHeight?: number;
  height?: number;
  remoteMethod?: (query: string) => void;
  selectedLabel?: () => string | string[];
  scrollToOption?: (index: number) => void;
  focus?: () => void;
  blur?: () => void;
}

const opts = [
  { value: "vue", label: "Vue 3" },
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "elfui", label: "ElfUI" },
  { value: "lit", label: "Lit" }
];

const opts2 = [
  { value: "a", label: "可选 A" },
  { value: "b", label: "可选 B" },
  { value: "c", label: "禁用 C", disabled: true }
];

describe("elf-select", () => {
  const mount = (): SelectEl => {
    const el = document.createElement("elf-select") as SelectEl;
    document.body.appendChild(el);
    return el;
  };

  it("reflects the shared field surface contract", async () => {
    const el = mount();
    el.setAttribute("variant", "outlined");
    el.setAttribute("label", "Framework");
    await tick();

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.hasAttribute("data-has-label")).toBe(true);
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Framework");
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Framework");
  });

  it.each(["default", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the shared %s field variant",
    async (variant) => {
      const el = mount();
      el.setAttribute("variant", variant);
      await tick();
      expect(el.getAttribute("variant")).toBe(variant);
    }
  );

  it("keeps internal scrolling usable and closes on external page motion", async () => {
    const el = mount();
    el.options = opts;
    await tick();
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    const dropdown = el.shadowRoot!.querySelector(".dropdown") as HTMLElement;

    dropdown.dispatchEvent(new Event("scroll", { bubbles: true, composed: true }));
    await tick();
    expect(el.hasAttribute("data-open")).toBe(true);
    document.body.dispatchEvent(new Event("wheel", { bubbles: true, composed: true }));
    await tick();
    expect(el.hasAttribute("data-open")).toBe(false);
  });

  // ═══ 基础功能 ═══

  it("点击 trigger 展开下拉", async () => {
    const el = mount();
    el.options = opts;
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".dropdown")).toBeNull();
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".dropdown")).toBeTruthy();
    expect(el.shadowRoot!.querySelectorAll(".option").length).toBe(6);
  });

  it("选择项 emit update:modelValue", async () => {
    const el = mount();
    el.options = opts;
    await tick();
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    const items = el.shadowRoot!.querySelectorAll(".option");
    (items[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(onUpdate).toHaveBeenCalled();
    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toBe("react");
  });

  // ═══ v-model 模拟 ═══

  it("v-model 模拟单选", async () => {
    const el = mount();
    el.options = opts;
    // 模拟 v-model: prop + event listener
    el.modelValue = "";
    await tick();
    await tick();

    let emitted: unknown = null;
    el.addEventListener("update:modelValue", (e) => {
      emitted = (e as CustomEvent).detail;
      el.modelValue = emitted;
    });

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();

    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    await tick();

    expect(emitted).toBe("vue");
    expect(el.modelValue).toBe("vue");
  });

  it("v-model 模拟多选", async () => {
    const el = mount();
    el.options = opts;
    el.multiple = true;
    el.modelValue = [];
    await tick();
    await tick();

    let lastValue: unknown = [];
    el.addEventListener("update:modelValue", (e) => {
      lastValue = (e as CustomEvent).detail;
      el.modelValue = lastValue;
    });

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();

    // 多选时下拉不关闭，可以继续选
    const items = el.shadowRoot!.querySelectorAll(".option");
    (items[0] as HTMLElement).click();
    await tick();
    expect(lastValue).toEqual(["vue"]);

    (items[1] as HTMLElement).click();
    await tick();
    expect(lastValue).toEqual(["vue", "react"]);
  });

  it("clearable 清空", async () => {
    const el = mount();
    el.options = opts;
    el.modelValue = "vue";
    el.clearable = true;
    await tick();
    await tick();

    const onClear = vi.fn();
    el.addEventListener("clear", onClear as unknown as EventListener);
    (el.shadowRoot!.querySelector(".clear") as HTMLElement).click();
    await tick();
    expect(onClear).toHaveBeenCalled();
  });

  it("disabled 时无法展开", async () => {
    const el = mount();
    el.options = opts;
    el.setAttribute("disabled", "");
    await tick();
    await tick();
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    expect(el.shadowRoot!.querySelector(".dropdown")).toBeNull();
  });

  it("filterable 模式过滤", async () => {
    const el = mount();
    el.options = opts;
    el.filterable = true;
    await tick();
    await tick();
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    const filterInput = el.shadowRoot!.querySelector(".filter-input") as HTMLInputElement;
    filterInput.value = "Vue";
    filterInput.dispatchEvent(new Event("input"));
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".option").length).toBe(1);
  });

  it("支持 options 的 props 字段映射", async () => {
    const el = mount();
    el.options = [{ id: "cn", name: "中文", locked: false }];
    el.props = { value: "id", label: "name", disabled: "locked" };
    await tick();
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelector(".option") as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toBe("cn");
    expect(el.shadowRoot!.textContent).toContain("中文");
  });

  it("multiple-limit 限制多选数量并 remove-tag 透出被移除值", async () => {
    const el = mount();
    el.options = opts;
    el.multiple = true;
    el.multipleLimit = 1;
    el.modelValue = [];
    await tick();
    await tick();

    const onUpdate = vi.fn();
    const onRemove = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("remove-tag", onRemove as unknown as EventListener);

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    (el.shadowRoot!.querySelectorAll(".option")[1] as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual(["vue"]);

    (el.shadowRoot!.querySelector(".tag-remove") as HTMLElement).click();
    await tick();
    expect((onRemove.mock.calls[0][0] as CustomEvent).detail).toBe("vue");
  });

  it("allow-create + default-first-option 支持回车创建", async () => {
    const el = mount();
    el.options = opts;
    el.filterable = true;
    el.allowCreate = true;
    el.defaultFirstOption = true;
    await tick();
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    const input = el.shadowRoot!.querySelector(".filter-input") as HTMLInputElement;
    input.value = "Qwik";
    input.dispatchEvent(new Event("input"));
    await tick();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();

    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toBe("Qwik");
  });

  it("方向键跳过禁用项并由 Enter 选择当前活动项", async () => {
    const el = mount();
    el.options = opts2;
    await tick();
    await tick();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    const trigger = el.shadowRoot!.querySelector(".trigger") as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();

    expect(el.shadowRoot!.querySelector(".option.active")?.textContent).toContain("可选 A");
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toBe("a");
  });

  it("expose focus / blur 控制组合框焦点并关联 listbox", async () => {
    const el = mount();
    el.options = opts;
    await tick();
    await tick();

    el.focus?.();
    const trigger = el.shadowRoot!.querySelector(".trigger") as HTMLElement;
    expect(el.shadowRoot!.activeElement).toBe(trigger);
    expect(trigger.getAttribute("aria-controls")).toBe(
      el.shadowRoot!.querySelector("[role=listbox]")?.id || `${trigger.id}-listbox`
    );
    el.blur?.();
    expect(el.shadowRoot!.activeElement).not.toBe(trigger);
  });

  it("persistent 保留下拉 DOM，并透传 popper class / style", async () => {
    const el = mount();
    el.options = opts;
    el.persistent = true;
    el.popperClass = "member-menu";
    el.popperStyle = { width: "320px" };
    await tick();
    await tick();

    const trigger = el.shadowRoot!.querySelector(".trigger") as HTMLElement;
    trigger.click();
    await tick();
    trigger.click();
    await tick();

    const dropdown = el.shadowRoot!.querySelector(".dropdown") as HTMLElement;
    expect(dropdown.classList.contains("member-menu")).toBe(true);
    expect(dropdown.style.width).toBe("320px");
    expect(dropdown.classList.contains("closing")).toBe(true);
    expect(dropdown.getAttribute("aria-hidden")).toBe("true");
    expect(dropdown.hasAttribute("inert")).toBe(true);
  });

  it("coordinates Escape and outside click across Select and Cascader overlays", async () => {
    const select = mount();
    select.options = opts;
    const cascader = document.createElement("elf-cascader") as HTMLElement & {
      options?: unknown[];
      teleported?: boolean;
    };
    cascader.options = [{ label: "Region", value: "region" }];
    cascader.teleported = false;
    document.body.appendChild(cascader);
    await tick();
    await tick();

    select.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    cascader.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    await tick();
    expect(select.hasAttribute("data-open")).toBe(true);
    expect(cascader.hasAttribute("data-open")).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(cascader.hasAttribute("data-open")).toBe(false);
    expect(select.hasAttribute("data-open")).toBe(true);

    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await tick();
    expect(select.hasAttribute("data-open")).toBe(false);
  });

  it("remote-method 按 debounce 触发", async () => {
    const el = mount();
    const remoteMethod = vi.fn();
    el.options = opts;
    el.filterable = true;
    el.remote = true;
    el.debounce = 0;
    el.remoteMethod = remoteMethod;
    await tick();
    await tick();

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    const input = el.shadowRoot!.querySelector(".filter-input") as HTMLInputElement;
    input.value = "vue";
    input.dispatchEvent(new Event("input"));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(remoteMethod).toHaveBeenCalledWith("vue");
  });

  it("虚拟化千项数据并保持滚动与键盘活动项可见", async () => {
    const el = mount();
    el.options = Array.from({ length: 1000 }, (_, index) => ({
      value: index,
      label: `Option ${String(index + 1).padStart(4, "0")}`,
    }));
    el.virtual = true;
    el.virtualThreshold = 0;
    el.itemHeight = 40;
    el.height = 200;
    await tick();

    const trigger = el.shadowRoot!.querySelector<HTMLElement>(".trigger")!;
    trigger.click();
    await tick();

    expect(el.hasAttribute("data-virtualized")).toBe(true);
    expect(el.shadowRoot!.querySelectorAll(".option").length).toBeLessThan(20);
    expect(el.shadowRoot!.querySelector<HTMLElement>(".options-track")?.style.height).toBe("40000px");

    const dropdown = el.shadowRoot!.querySelector<HTMLElement>(".dropdown")!;
    dropdown.scrollTop = 20000;
    dropdown.dispatchEvent(new Event("scroll"));
    await tick();

    expect(el.shadowRoot!.querySelector('[data-index="500"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('[data-index="0"]')).toBeNull();

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector('.option.active[data-index="999"]')).toBeTruthy();

    el.scrollToOption?.(250);
    await tick();
    expect(el.shadowRoot!.querySelector('[data-index="250"]')).toBeTruthy();
  });

  it("header/footer 始终投影，loading/empty 根据远程状态切换", async () => {
    const el = mount();
    const header = document.createElement("div");
    const footer = document.createElement("div");
    const loading = document.createElement("div");
    const empty = document.createElement("div");
    header.slot = "header";
    footer.slot = "footer";
    loading.slot = "loading";
    empty.slot = "empty";
    header.textContent = "远程成员";
    footer.textContent = "输入 error 模拟失败";
    loading.textContent = "正在查询";
    empty.textContent = "没有匹配成员";
    el.append(header, footer, loading, empty);
    el.options = [];
    el.loading = true;
    await tick();

    (el.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();

    expect(
      (el.shadowRoot!.querySelector('slot[name="header"]') as HTMLSlotElement).assignedElements()
    ).toEqual([header]);
    expect(
      (el.shadowRoot!.querySelector('slot[name="loading"]') as HTMLSlotElement).assignedElements()
    ).toEqual([loading]);
    expect(
      (el.shadowRoot!.querySelector('slot[name="footer"]') as HTMLSlotElement).assignedElements()
    ).toEqual([footer]);

    el.loading = false;
    await tick();

    expect(
      (el.shadowRoot!.querySelector('slot[name="empty"]') as HTMLSlotElement).assignedElements()
    ).toEqual([empty]);
  });

  it("placeholder 显示", async () => {
    const el = mount();
    el.options = opts;
    el.setAttribute("placeholder", "请选择一项");
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".placeholder")?.textContent).toBe("请选择一项");
  });

  // ═══ 多实例隔离 ═══

  it("两个 Select 实例不互相干扰", async () => {
    const el1 = mount();
    el1.options = opts;
    const el2 = mount();
    el2.options = opts2;
    await tick();
    await tick();

    let v1: unknown = null;
    let v2: unknown = null;
    el1.addEventListener("update:modelValue", (e) => {
      v1 = (e as CustomEvent).detail;
      el1.modelValue = v1;
    });
    el2.addEventListener("update:modelValue", (e) => {
      v2 = (e as CustomEvent).detail;
      el2.modelValue = v2;
    });

    // 操作 el1
    (el1.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    (el1.shadowRoot!.querySelectorAll(".option")[0] as HTMLElement).click();
    await tick();
    await tick();

    expect(v1).toBe("vue");
    expect(v2).toBeNull(); // el2 不受影响

    // 操作 el2
    (el2.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    (el2.shadowRoot!.querySelectorAll(".option")[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(v1).toBe("vue"); // el1 值不变
    expect(v2).toBe("b");
  });

  it("多选模式打开另一个实例时，前一个实例自动收起", async () => {
    const el1 = mount();
    el1.options = opts;
    el1.multiple = true;
    el1.modelValue = [];
    const el2 = mount();
    el2.options = opts2;
    el2.multiple = true;
    el2.modelValue = [];
    await tick();
    await tick();

    (el1.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();
    expect(el1.hasAttribute("data-open")).toBe(true);
    expect(el1.shadowRoot!.querySelector(".dropdown.active")).toBeTruthy();

    (el2.shadowRoot!.querySelector(".trigger") as HTMLElement).click();
    await tick();
    await tick();

    expect(el1.hasAttribute("data-open")).toBe(false);
    expect(el1.shadowRoot!.querySelector(".dropdown.active")).toBeNull();
    expect(el2.hasAttribute("data-open")).toBe(true);
    expect(el2.shadowRoot!.querySelector(".dropdown.active")).toBeTruthy();
  });
});
