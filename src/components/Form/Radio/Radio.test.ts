// @ts-nocheck -- Legacy custom-element fixture requires runtime-only properties.
// elf-radio / elf-radio-group 单元测试

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

type RadioHost = HTMLElement & {
  modelValue?: unknown;
  value?: unknown;
  label?: string;
  disabled?: boolean;
  border?: boolean;
  id?: string;
  ariaLabel?: string;
};

type RadioGroupHost = HTMLElement & {
  modelValue?: unknown;
  disabled?: boolean;
  size?: string;
};

describe("elf-radio", () => {
  const mount = (): RadioHost => {
    const el = document.createElement("elf-radio") as RadioHost;
    document.body.appendChild(el);
    return el;
  };

  it("点击触发 update:modelValue 为本项 value", async () => {
    const el = mount();
    el.value = "a";
    await flush();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const dot = el.shadowRoot!.querySelector(".dot") as HTMLElement;
    dot.click();
    await flush();

    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toBe("a");
  });

  it("modelValue === value 时显示 data-checked", async () => {
    const el = mount();
    el.value = "x";
    el.modelValue = "x";
    await flush();
    expect(el.hasAttribute("data-checked")).toBe(true);
  });

  it("已选中时重复点击不触发事件", async () => {
    const el = mount();
    el.value = "a";
    el.modelValue = "a";
    await flush();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const dot = el.shadowRoot!.querySelector(".dot") as HTMLElement;
    dot.click();
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("disabled 不可点击", async () => {
    const el = mount();
    el.value = "a";
    el.disabled = true;
    await flush();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const dot = el.shadowRoot!.querySelector(".dot") as HTMLElement;
    dot.click();
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("border 字符串属性", async () => {
    const el = mount();
    el.setAttribute("border", "");
    await flush();
    expect(el.hasAttribute("border")).toBe(true);
  });
  it("uses radio accessibility attributes", async () => {
    const el = mount();
    el.id = "daily";
    el.ariaLabel = "Daily report";
    el.value = "daily";
    el.modelValue = "daily";
    await flush();
    const control = el.shadowRoot!.querySelector(".control") as HTMLButtonElement;
    expect(control.getAttribute("role")).toBe("radio");
    expect(control.getAttribute("aria-label")).toBe("Daily report");
    expect(control.tabIndex).toBe(0);
  });
});

describe("elf-radio-group", () => {
  const mountGroup = (): RadioGroupHost => {
    const el = document.createElement("elf-radio-group") as RadioGroupHost;
    document.body.appendChild(el);
    return el;
  };

  it("渲染 group 容器", async () => {
    const el = mountGroup();
    await flush();
    expect(el.shadowRoot!.querySelector(".group")).toBeTruthy();
  });

  it("子 radio 点击后 group emit", async () => {
    const group = mountGroup();
    group.modelValue = "b";
    await flush();

    const r = document.createElement("elf-radio") as RadioHost;
    r.value = "a";
    group.appendChild(r);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const dot = r.shadowRoot!.querySelector(".dot") as HTMLElement;
    dot.click();
    await flush();

    expect(onUpdate).toHaveBeenCalled();
    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toBe("a");
  });

  it("切换选项后 new value emit 到 group", async () => {
    const group = mountGroup();
    group.modelValue = "a";
    await flush();

    const r1 = document.createElement("elf-radio") as RadioHost;
    r1.value = "a";
    group.appendChild(r1);

    const r2 = document.createElement("elf-radio") as RadioHost;
    r2.value = "b";
    group.appendChild(r2);

    // 监听 update:modelValue 来更新 group 的 modelValue（模拟 v-model）
    group.addEventListener("update:modelValue", (e) => {
      group.modelValue = (e as CustomEvent).detail;
    });
    await flush();

    expect(r1.hasAttribute("data-checked")).toBe(true);

    const dot2 = r2.shadowRoot!.querySelector(".dot") as HTMLElement;
    dot2.click();
    await flush();

    expect(group.modelValue).toBe("b");
    expect(r2.hasAttribute("data-checked")).toBe(true);
  });
});
