// @ts-nocheck -- Legacy custom-element fixture requires runtime-only properties.
// elf-input 单元测试

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));
const flush = (): Promise<void> => tick().then(tick).then(tick);

type InputHost = HTMLElement & {
  modelValue?: string | number;
  modelModifiers?: Record<string, boolean>;
  type?: string;
  size?: string;
  variant?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  showPassword?: boolean;
  maxlength?: number;
  minlength?: number;
  showWordLimit?: boolean;
  wordLimitPosition?: string;
  clearIcon?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  formatter?: (value: string) => string;
  parser?: (value: string) => string;
  autocomplete?: string;
  max?: string | number;
  min?: string | number;
  step?: string | number;
  autofocus?: boolean;
  form?: string;
  ariaLabel?: string;
  tabindex?: number;
  inputmode?: string;
  inputStyle?: string;
  countGraphemes?: (value: string) => number;
  input?: () => HTMLInputElement | null;
  focus?: () => void;
  blur?: () => void;
  select?: () => void;
  clear?: () => void;
};

describe("elf-input", () => {
  const mount = (init?: (el: InputHost) => void): InputHost => {
    const el = document.createElement("elf-input") as InputHost;
    init?.(el);
    document.body.appendChild(el);
    return el;
  };

  it("渲染 input 元素", async () => {
    const el = mount();
    await tick();
    expect(el.shadowRoot!.querySelector("input")).toBeTruthy();
  });

  it("v-model input 事件 emit update:modelValue", async () => {
    const el = mount();
    await flush();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const input = el.shadowRoot!.querySelector("input")!;
    input.value = "hello";
    input.dispatchEvent(new Event("input"));
    await flush();

    expect(onUpdate).toHaveBeenCalled();
    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toBe("hello");
  });

  it("value property 动态绑定", async () => {
    const el = mount((node) => {
      node.modelValue = "init";
    });
    await flush();

    const input = el.shadowRoot!.querySelector("input")!;
    expect((input as HTMLInputElement).value).toBe("init");
  });

  it("placeholder 属性", async () => {
    const el = mount((node) => {
      node.placeholder = "请输入";
    });
    await flush();

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.placeholder).toBe("请输入");
  });

  it("filled 为默认外观并渲染浮动标签状态", async () => {
    const el = mount((node) => {
      node.label = "项目名称";
      node.modelValue = "ElfUI";
    });
    await flush();

    expect(el.getAttribute("variant")).toBe("filled");
    expect(el.hasAttribute("data-has-label")).toBe(true);
    expect(el.hasAttribute("data-dirty")).toBe(true);
    expect(el.shadowRoot!.querySelector(".label")?.textContent).toContain("项目名称");
  });

  it("outlined 外观反射到宿主", async () => {
    const el = mount((node) => {
      node.variant = "outlined";
    });
    await flush();
    expect(el.getAttribute("variant")).toBe("outlined");
  });

  it.each(["default", "outlined", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the %s field variant",
    async (variant) => {
      const el = mount((node) => {
        node.variant = variant;
      });
      await flush();

      expect(el.getAttribute("variant")).toBe(variant);
    },
  );

  it("falls back to the compatible filled surface for an unknown variant", async () => {
    const el = mount((node) => {
      node.variant = "unknown";
    });
    await flush();

    expect(el.getAttribute("variant")).toBe("filled");
  });

  it("disabled host attribute 反射", async () => {
    const el = mount((node) => {
      node.disabled = true;
    });
    await flush();

    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("readonly 属性", async () => {
    const el = mount((node) => {
      node.readonly = true;
    });
    await flush();

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.readOnly).toBe(true);
  });

  it("clearable 清空按钮触发 clear 事件", async () => {
    const el = mount((node) => {
      node.clearable = true;
      node.modelValue = "text";
    });
    await flush();

    const btn = el.shadowRoot!.querySelector(".clear") as HTMLButtonElement | null;
    expect(btn).toBeTruthy();

    const onClear = vi.fn();
    el.addEventListener("clear", onClear as unknown as EventListener);

    btn!.click();
    await flush();

    expect(onClear).toHaveBeenCalled();
  });

  it("type 属性与 show-password 切换", async () => {
    const el = mount((node) => {
      node.type = "password";
      node.showPassword = true;
      node.modelValue = "secret";
    });
    await flush();

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.type).toBe("password");

    const button = el.shadowRoot!.querySelector(".pwd-toggle") as HTMLButtonElement;
    button.click();
    await flush();
    expect(input.type).toBe("text");
  });

  it("size 兼容 small/default/large 并反射到 host", async () => {
    const el = mount((node) => {
      node.size = "large";
    });
    await flush();

    expect(el.getAttribute("size")).toBe("lg");
  });

  it.each([
    ["default", "default"],
    ["comfortable", "comfortable"],
    ["compact", "compact"],
    ["unknown", "default"],
  ])("normalizes density %s to %s", async (density, expected) => {
    const el = mount((node) => {
      node.density = density;
    });
    await flush();

    expect(el.getAttribute("density")).toBe(expected);
  });

  it("maxlength/minlength 与字数统计", async () => {
    const el = mount((node) => {
      node.modelValue = "abc";
      node.maxlength = 10;
      node.minlength = 2;
      node.showWordLimit = true;
    });
    await flush();

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.maxLength).toBe(10);
    expect(input.minLength).toBe(2);
    expect(el.shadowRoot!.querySelector(".count")?.textContent?.trim()).toBe("3 / 10");
  });

  it("prefix/suffix/prepend/append 插槽与 icon 显示", async () => {
    const el = mount((node) => {
      node.prefixIcon = "P";
      node.suffixIcon = "S";
      node.innerHTML = `<span slot="prepend">https://</span><span slot="append">.com</span>`;
    });
    await flush();

    expect(el.shadowRoot!.querySelector(".prefix")?.textContent?.trim()).toBe("P");
    expect(el.shadowRoot!.querySelector(".suffix")?.textContent?.trim()).toBe("S");
    expect(el.shadowRoot!.querySelector(".prepend")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".append")).toBeTruthy();
  });

  it("detects a prefix slot inserted after the input has mounted", async () => {
    const el = mount();
    await flush();
    expect(el.shadowRoot!.querySelector(".prefix")).toBeNull();

    const icon = document.createElement("span");
    icon.slot = "prefix";
    icon.textContent = "search";
    el.appendChild(icon);
    await flush();

    const prefix = el.shadowRoot!.querySelector(".prefix");
    expect(prefix).toBeTruthy();
    expect(prefix?.querySelector("slot")?.assignedElements()).toContain(icon);
  });

  it("formatter/parser 与 model-modifiers.number 生效", async () => {
    const el = mount((node) => {
      node.modelValue = 1200;
      node.formatter = (value) => `$${value}`;
      node.parser = (value) => value.replace(/\D/g, "");
      node.modelModifiers = { number: true };
    });
    await flush();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("$1200");

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    input.value = "$1300";
    input.dispatchEvent(new Event("input"));
    await flush();

    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toBe(1300);
    expect(input.value).toBe("$1300");
  });

  it("原生输入属性透传", async () => {
    const el = mount((node) => {
      node.id = "amount";
      node.name = "amount";
      node.autocomplete = "one-time-code";
      node.min = 1;
      node.max = 9;
      node.step = 2;
      node.form = "order-form";
      node.ariaLabel = "Amount";
      node.tabindex = 3;
      node.inputmode = "numeric";
      node.inputStyle = "text-align:right";
    });
    await flush();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    expect(input.id).toBe("amount");
    expect(input.name).toBe("amount");
    expect(input.autocomplete).toBe("one-time-code");
    expect(input.min).toBe("1");
    expect(input.max).toBe("9");
    expect(input.step).toBe("2");
    expect(input.getAttribute("form")).toBe("order-form");
    expect(input.getAttribute("aria-label")).toBe("Amount");
    expect(input.tabIndex).toBe(3);
    expect(input.inputMode).toBe("numeric");
    expect(input.getAttribute("style")).toContain("text-align");
  });

  it("keydown / mouseenter / mouseleave 事件", async () => {
    const el = mount();
    await flush();

    const onKeydown = vi.fn();
    const onMouseenter = vi.fn();
    const onMouseleave = vi.fn();
    el.addEventListener("keydown", onKeydown as unknown as EventListener);
    el.addEventListener("mouseenter", onMouseenter as unknown as EventListener);
    el.addEventListener("mouseleave", onMouseleave as unknown as EventListener);

    el.shadowRoot!.querySelector("input")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter" }),
    );
    const group = el.shadowRoot!.querySelector(".group")!;
    group.dispatchEvent(new MouseEvent("mouseenter"));
    group.dispatchEvent(new MouseEvent("mouseleave"));

    expect(onKeydown).toHaveBeenCalledTimes(1);
    expect(onMouseenter).toHaveBeenCalledTimes(1);
    expect(onMouseleave).toHaveBeenCalledTimes(1);
  });

  it("composition 期间不触发 input，结束后同步", async () => {
    const el = mount();
    await flush();

    const onInput = vi.fn();
    const onUpdate = vi.fn();
    const onCompositionEnd = vi.fn();
    el.addEventListener("input", onInput as unknown as EventListener);
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("compositionend", onCompositionEnd as unknown as EventListener);

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new Event("compositionstart"));
    input.value = "拼";
    input.dispatchEvent(new Event("input"));
    await flush();
    expect(onInput).not.toHaveBeenCalled();

    input.dispatchEvent(new Event("compositionend"));
    await flush();
    expect(onCompositionEnd).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toBe("拼");
  });

  it("exposes input/focus/blur/select/clear", async () => {
    const el = mount((node) => {
      node.modelValue = "abc";
      node.clearable = true;
    });
    await flush();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    const selectSpy = vi.spyOn(input, "select").mockImplementation(() => undefined);

    expect(el.input?.()).toBe(input);
    el.focus?.();
    expect(el.shadowRoot!.activeElement).toBe(input);
    el.blur?.();
    expect(el.shadowRoot!.activeElement).not.toBe(input);

    el.select?.();
    expect(selectSpy).toHaveBeenCalledTimes(1);

    const onClear = vi.fn();
    el.addEventListener("clear", onClear as unknown as EventListener);
    el.clear?.();
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("focus / blur 事件", async () => {
    const el = mount();
    await flush();

    const onFocus = vi.fn();
    const onBlur = vi.fn();
    el.addEventListener("focus", onFocus as unknown as EventListener);
    el.addEventListener("blur", onBlur as unknown as EventListener);

    const input = el.shadowRoot!.querySelector("input")!;
    input.dispatchEvent(new FocusEvent("focus"));
    input.dispatchEvent(new FocusEvent("blur"));

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("does not repeat an identical label as the native placeholder", async () => {
    const el = mount((node) => {
      node.label = "Label";
      node.placeholder = "Label";
    });
    await flush();

    expect(el.shadowRoot!.querySelector<HTMLInputElement>("input")?.placeholder).toBe("");
  });

  it("marks inner leading content so the resting label can avoid it", async () => {
    const el = mount((node) => {
      node.label = "Search";
      node.prefixIcon = "S";
      node.variant = "outlined";
    });
    await flush();

    expect(el.shadowRoot!.querySelector(".group")?.classList.contains("has-prefix")).toBe(true);
    expect(el.shadowRoot!.querySelector("fieldset legend span")?.textContent).toBe("Search");
  });

  it("projects a custom background color to the shared field surface", async () => {
    const el = mount((node) => {
      node.backgroundColor = "#fff8e1";
    });
    await flush();

    expect(el.style.getPropertyValue("--elf-input-custom-bg")).toBe("#fff8e1");
  });
});
