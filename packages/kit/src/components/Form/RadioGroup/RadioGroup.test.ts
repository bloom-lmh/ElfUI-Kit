// elf-radio-group 测试

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

type GroupHost = HTMLElement & {
  modelValue?: unknown;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  name?: string;
  variant?: string;
  options?: unknown[];
  props?: Record<string, string>;
};

describe("elf-radio-group", () => {
  const mount = (): GroupHost => {
    const el = document.createElement("elf-radio-group") as GroupHost;
    document.body.appendChild(el);
    return el;
  };

  it("渲染 group 容器", async () => {
    const el = mount();
    await flush();
    expect(el.shadowRoot!.querySelector(".group")).toBeTruthy();
  });

  it("子 radio 点击后 emit update:modelValue", async () => {
    const group = mount();
    group.modelValue = "b";
    await flush();

    const r = document.createElement("elf-radio") as HTMLElement & { value?: unknown };
    r.value = "a";
    group.appendChild(r);
    await flush();

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", (e) => {
      group.modelValue = (e as CustomEvent).detail;
    });
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (r.shadowRoot!.querySelector(".dot") as HTMLElement).click();
    await flush();

    expect(group.modelValue).toBe("a");
    expect(r.hasAttribute("data-checked")).toBe(true);
  });

  it("disabled 属性设置到 props", async () => {
    const el = mount();
    el.disabled = true;
    await flush();
    expect(el.disabled).toBe(true);
  });
  it("exposes radiogroup semantics and changes option with arrow keys", async () => {
    const group = mount();
    group.modelValue = "a";
    group.id = "delivery";
    group.ariaLabel = "Delivery method";
    group.name = "delivery-method";
    const first = document.createElement("elf-radio") as HTMLElement & { value?: unknown };
    const second = document.createElement("elf-radio") as HTMLElement & { value?: unknown };
    first.value = "a";
    second.value = "b";
    group.append(first, second);
    group.addEventListener("update:modelValue", (event) => {
      group.modelValue = (event as CustomEvent).detail;
    });
    await flush();

    const root = group.shadowRoot!.querySelector("[role=radiogroup]")!;
    expect(root.id).toBe("delivery");
    expect(root.getAttribute("aria-label")).toBe("Delivery method");
    const control = first.shadowRoot!.querySelector(".control") as HTMLButtonElement;
    expect(control.getAttribute("name")).toBe("delivery-method");
    control.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, composed: true }),
    );
    await flush();
    expect(group.modelValue).toBe("b");
  });

  it("renders declarative options with custom field mappings", async () => {
    const group = mount();
    group.variant = "button";
    group.options = [
      { text: "Standard", id: "standard" },
      { text: "Express", id: "express", locked: true },
    ];
    group.props = { label: "text", value: "id", disabled: "locked" };
    await flush();

    const radios = group.shadowRoot!.querySelectorAll("elf-radio");
    expect(radios).toHaveLength(2);
    expect(radios[0]!.hasAttribute("data-button")).toBe(true);
    expect(radios[0]!.shadowRoot!.textContent).toContain("Standard");
    expect(radios[1]!.hasAttribute("disabled")).toBe(true);

    const onUpdate = vi.fn();
    group.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    (radios[0]!.shadowRoot!.querySelector(".control") as HTMLButtonElement).click();
    await flush();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("standard");
  });
});
