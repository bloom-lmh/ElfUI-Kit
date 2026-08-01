// @ts-nocheck -- Legacy custom-element fixture requires runtime-only properties.
// elf-checkbox / elf-checkbox-group 单元测试

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const flush = (): Promise<void> =>
  Promise.resolve()
    .then(() => Promise.resolve())
    .then(() => Promise.resolve());

type CheckboxHost = HTMLElement & {
  modelValue?: boolean | unknown[];
  value?: unknown;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
};

type CheckboxGroupHost = HTMLElement & {
  modelValue?: unknown[];
  disabled?: boolean;
  min?: number;
  max?: number;
};

describe("elf-checkbox", () => {
  const mount = (): CheckboxHost => {
    const el = document.createElement("elf-checkbox") as CheckboxHost;
    document.body.appendChild(el);
    return el;
  };

  it("boolean 模式点击切换", async () => {
    const el = mount();
    await flush();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const box = el.shadowRoot!.querySelector(".box") as HTMLElement;
    box.click();
    await flush();

    expect(onUpdate).toHaveBeenCalled();
    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toBe(true);

    el.modelValue = detail;
    await flush();

    expect(el.hasAttribute("data-checked")).toBe(true);
  });

  it("indeterminate 反射到 host", async () => {
    const el = mount();
    el.indeterminate = true;
    await flush();
    expect(el.hasAttribute("data-indeterminate")).toBe(true);
  });

  it("数组模式：勾选追加", async () => {
    const el = mount();
    el.value = "apple";
    el.modelValue = [];
    await flush();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const box = el.shadowRoot!.querySelector(".box") as HTMLElement;
    box.click();
    await flush();

    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toEqual(["apple"]);
  });

  it("disabled 不可点击", async () => {
    const el = mount();
    el.disabled = true;
    await flush();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const box = el.shadowRoot!.querySelector(".box") as HTMLElement;
    box.click();
    await flush();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("label 属性", async () => {
    const el = mount();
    el.label = "同意条款";
    await flush();
    expect(el.shadowRoot!.querySelector(".label")?.textContent).toContain("同意条款");
  });
});

describe("elf-checkbox-group", () => {
  const mountGroup = (): CheckboxGroupHost => {
    const el = document.createElement("elf-checkbox-group") as CheckboxGroupHost;
    document.body.appendChild(el);
    return el;
  };

  it("渲染 group 容器", async () => {
    const el = mountGroup();
    await flush();
    expect(el.shadowRoot!.querySelector(".group")).toBeTruthy();
  });

  it("子 checkbox 点击后 group emit", async () => {
    const group = mountGroup();
    group.modelValue = ["b"];
    await flush();

    const cb = document.createElement("elf-checkbox") as CheckboxHost;
    cb.value = "a";
    group.appendChild(cb);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const box = cb.shadowRoot!.querySelector(".box") as HTMLElement;
    box.click();
    await flush();

    expect(onUpdate).toHaveBeenCalled();
    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toEqual(["b", "a"]);
  });

  it("内部点击只切换一次，避免多选项闪选后消失", async () => {
    const group = mountGroup();
    group.modelValue = [];
    await flush();

    const cb = document.createElement("elf-checkbox") as CheckboxHost;
    cb.value = "a";
    group.appendChild(cb);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const box = cb.shadowRoot!.querySelector(".box") as HTMLElement;
    box.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, cancelable: true }));
    await flush();

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toEqual(["a"]);
    expect(cb.hasAttribute("data-checked")).toBe(true);
  });

  it("min 限制取消最后一个", async () => {
    const group = mountGroup();
    group.modelValue = ["a"];
    group.min = 1;
    await flush();

    const cb = document.createElement("elf-checkbox") as CheckboxHost;
    cb.value = "a";
    group.appendChild(cb);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const box = cb.shadowRoot!.querySelector(".box") as HTMLElement;
    box.click();
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("max 限制超过", async () => {
    const group = mountGroup();
    group.modelValue = ["a", "b"];
    group.max = 2;
    await flush();

    const cb = document.createElement("elf-checkbox") as CheckboxHost;
    cb.value = "c";
    group.appendChild(cb);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const box = cb.shadowRoot!.querySelector(".box") as HTMLElement;
    box.click();
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
  });
});
