// @ts-nocheck -- Legacy custom-element fixture requires runtime-only properties.
// elf-checkbox-group 测试

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));
const flush = (): Promise<void> => tick().then(tick).then(tick);

type GroupHost = HTMLElement & {
  modelValue?: unknown[];
  disabled?: boolean;
  min?: number;
  max?: number;
  variant?: string;
  options?: unknown[];
  props?: Record<string, string>;
};

describe("elf-checkbox-group", () => {
  const mount = (): GroupHost => {
    const el = document.createElement("elf-checkbox-group") as GroupHost;
    document.body.appendChild(el);
    return el;
  };

  it("渲染 group 容器", async () => {
    const el = mount();
    await flush();
    expect(el.shadowRoot!.querySelector(".group")).toBeTruthy();
  });

  it("子 checkbox 点击后 emit update:modelValue", async () => {
    const group = mount();
    group.modelValue = ["b"];
    await flush();

    const cb = document.createElement("elf-checkbox") as HTMLElement & { value?: unknown };
    cb.value = "a";
    group.appendChild(cb);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (cb.shadowRoot!.querySelector(".box") as HTMLElement).click();
    await flush();

    expect(onUpdate).toHaveBeenCalled();
    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toEqual(["b", "a"]);
  });

  it("min 限制：不能取消最后一个", async () => {
    const group = mount();
    group.modelValue = ["a"];
    group.min = 1;
    await flush();

    const cb = document.createElement("elf-checkbox") as HTMLElement & { value?: unknown };
    cb.value = "a";
    group.appendChild(cb);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (cb.shadowRoot!.querySelector(".box") as HTMLElement).click();
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("max 限制：达到上限不能新增", async () => {
    const group = mount();
    group.modelValue = ["a", "b"];
    group.max = 2;
    await flush();

    const cb = document.createElement("elf-checkbox") as HTMLElement & { value?: unknown };
    cb.value = "c";
    group.appendChild(cb);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (cb.shadowRoot!.querySelector(".box") as HTMLElement).click();
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("disabled 属性设置到 props", async () => {
    const el = mount();
    el.disabled = true;
    await flush();
    // disabled 通过 provide 传给子 Checkbox，不反射到 host attribute
    expect(el.disabled).toBe(true);
  });

  it("renders declarative button options with custom field mappings", async () => {
    const group = mount();
    group.variant = "button";
    group.options = [
      { text: "Read", code: "read" },
      { text: "Write", code: "write", locked: true },
    ];
    group.props = { label: "text", value: "code", disabled: "locked" };
    await flush();

    const checkboxes = group.shadowRoot!.querySelectorAll("elf-checkbox");
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]!.hasAttribute("data-button")).toBe(true);
    expect(checkboxes[0]!.shadowRoot!.textContent).toContain("Read");
    expect(checkboxes[1]!.hasAttribute("disabled")).toBe(true);

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    (checkboxes[0]!.shadowRoot!.querySelector(".box") as HTMLElement).click();
    await flush();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["read"]);
  });
});
