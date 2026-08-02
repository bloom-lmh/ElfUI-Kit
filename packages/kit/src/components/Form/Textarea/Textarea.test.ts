// @ts-nocheck -- Legacy custom-element fixture requires runtime-only properties.
// elf-textarea 单元测试

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

type TextareaHost = HTMLElement & {
  modelValue?: string;
  modelModifiers?: { trim?: boolean; lazy?: boolean };
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  rows?: number;
  showCount?: boolean;
  maxlength?: number;
  minlength?: number;
  autosize?: boolean | { minRows?: number; maxRows?: number };
  clearable?: boolean;
  showWordLimit?: boolean;
  wordLimitPosition?: string;
  formatter?: (value: string) => string;
  parser?: (value: string) => string;
  autocomplete?: string;
  autofocus?: boolean;
  form?: string;
  ariaLabel?: string;
  tabindex?: number;
  inputmode?: string;
  id?: string;
  name?: string;
  focus?: () => void;
  blur?: () => void;
  clear?: () => void;
  select?: () => void;
  textarea?: () => HTMLTextAreaElement | null;
};

describe("elf-textarea", () => {
  it("reflects the shared field surface contract", async () => {
    const el = document.createElement("elf-textarea") as TextareaHost;
    el.setAttribute("variant", "outlined");
    el.setAttribute("label", "Description");
    document.body.appendChild(el);
    await flush();

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.hasAttribute("data-has-label")).toBe(true);
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Description");
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Description");
  });

  it("renders an outlined border even without a label", async () => {
    const el = document.createElement("elf-textarea") as TextareaHost;
    el.setAttribute("variant", "outlined");
    document.body.appendChild(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".field-outline")).toBeTruthy();
  });

  it.each(["default", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the shared %s field variant",
    async (variant) => {
      const el = document.createElement("elf-textarea") as TextareaHost;
      el.setAttribute("variant", variant);
      document.body.appendChild(el);
      await flush();
      expect(el.getAttribute("variant")).toBe(variant);
    },
  );

  const mount = (): TextareaHost => {
    const el = document.createElement("elf-textarea") as TextareaHost;
    document.body.appendChild(el);
    return el;
  };

  it("渲染 textarea 元素", async () => {
    const el = mount();
    await flush();
    expect(el.shadowRoot!.querySelector("textarea")).toBeTruthy();
  });

  it("v-model — input 事件 emit update:modelValue", async () => {
    const el = mount();
    await flush();

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    const ta = el.shadowRoot!.querySelector("textarea")!;
    ta.value = "hello world";
    ta.dispatchEvent(new Event("input"));
    await flush();

    expect(onUpdate).toHaveBeenCalled();
    const detail = (onUpdate.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toBe("hello world");
  });

  it("rows 属性", async () => {
    const el = mount();
    el.rows = 5;
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea")!;
    expect(Number(ta.rows)).toBe(5);
  });

  it("autosize 会根据输入内容调整高度", async () => {
    const el = mount();
    el.autosize = { minRows: 2, maxRows: 6 };
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    Object.defineProperty(ta, "scrollHeight", { configurable: true, value: 96 });
    ta.value = "第一行\n第二行\n第三行\n第四行";
    ta.dispatchEvent(new Event("input"));
    await flush();

    expect(ta.style.height).toBe("96px");
    expect(el.hasAttribute("autosize")).toBe(true);
  });

  it("placeholder", async () => {
    const el = mount();
    el.placeholder = "请输入内容";
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea")!;
    expect(ta.placeholder).toBe("请输入内容");
  });

  it("disabled prop 设置后 textarea disabled", async () => {
    const el = mount();
    await flush();
    el.disabled = true;
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea")!;
    // disabled attribute 存在即禁用
    expect(ta.hasAttribute("disabled") || ta.disabled).toBe(true);
  });

  it("readonly", async () => {
    const el = mount();
    await flush();
    el.readonly = true;
    await flush();
    const ta = el.shadowRoot!.querySelector("textarea")!;
    expect(ta.readOnly).toBe(true);
  });

  it("showCount 显示字符数", async () => {
    const el = mount();
    el.showCount = true;
    el.modelValue = "abc";
    await flush();
    const count = el.shadowRoot!.querySelector(".count");
    expect(count?.textContent).toContain("3");
  });

  it("showCount + maxlength 同时显示", async () => {
    const el = mount();
    el.showCount = true;
    el.maxlength = 10;
    el.modelValue = "hi";
    await flush();
    const count = el.shadowRoot!.querySelector(".count");
    expect(count?.textContent).toContain("2/10");
  });

  it("supports formatter, parser, trim and outside word limit", async () => {
    const el = mount();
    el.modelValue = "1200";
    el.formatter = (value) => `$${value}`;
    el.parser = (value) => value.replace(/[^\d]/g, "");
    el.modelModifiers = { trim: true };
    el.showWordLimit = true;
    el.wordLimitPosition = "outside";
    el.maxlength = 10;
    await flush();

    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.value).toBe("$1200");
    expect(el.shadowRoot!.querySelector(".count.outside")?.textContent?.trim()).toBe("4/10");

    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    textarea.value = "$ 1300 ";
    textarea.dispatchEvent(new Event("input"));
    await flush();
    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toBe("1300");
    expect(textarea.value).toBe("$1300");
  });

  it("supports clearable and imperative textarea actions", async () => {
    const el = mount();
    el.modelValue = "content";
    el.clearable = true;
    await flush();

    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    const selectSpy = vi.spyOn(textarea, "select").mockImplementation(() => undefined);
    expect(el.textarea?.()).toBe(textarea);

    el.focus?.();
    expect(el.shadowRoot!.activeElement).toBe(textarea);
    el.blur?.();
    expect(el.shadowRoot!.activeElement).not.toBe(textarea);
    el.select?.();
    expect(selectSpy).toHaveBeenCalledTimes(1);

    const onClear = vi.fn();
    el.addEventListener("clear", onClear as unknown as EventListener);
    (el.shadowRoot!.querySelector(".clear") as HTMLButtonElement).click();
    await flush();
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(textarea.value).toBe("");
  });

  it("forwards native textarea attributes and accessible name", async () => {
    const el = mount();
    el.id = "bio";
    el.name = "bio";
    el.minlength = 4;
    el.autocomplete = "off";
    el.form = "profile";
    el.ariaLabel = "Biography";
    el.tabindex = 2;
    el.inputmode = "text";
    await flush();

    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.id).toBe("bio");
    expect(textarea.name).toBe("bio");
    expect(textarea.minLength).toBe(4);
    expect(textarea.getAttribute("form")).toBe("profile");
    expect(textarea.getAttribute("aria-label")).toBe("Biography");
    expect(textarea.tabIndex).toBe(2);
    expect(textarea.inputMode).toBe("text");
  });

  it("defers model updates while composing", async () => {
    const el = mount();
    await flush();

    const onUpdate = vi.fn();
    const onCompositionEnd = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("compositionend", onCompositionEnd as unknown as EventListener);
    const textarea = el.shadowRoot!.querySelector("textarea") as HTMLTextAreaElement;

    textarea.dispatchEvent(new Event("compositionstart"));
    textarea.value = "拼音";
    textarea.dispatchEvent(new Event("input"));
    expect(onUpdate).not.toHaveBeenCalled();

    textarea.dispatchEvent(new Event("compositionend"));
    await flush();
    expect(onCompositionEnd).toHaveBeenCalledTimes(1);
    expect((onUpdate.mock.calls[0][0] as CustomEvent).detail).toBe("拼音");
  });

  it("focus / blur 事件", async () => {
    const el = mount();
    await flush();

    const onFocus = vi.fn();
    const onBlur = vi.fn();
    el.addEventListener("focus", onFocus as unknown as EventListener);
    el.addEventListener("blur", onBlur as unknown as EventListener);

    const ta = el.shadowRoot!.querySelector("textarea")!;
    ta.dispatchEvent(new FocusEvent("focus"));
    ta.dispatchEvent(new FocusEvent("blur"));

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("size 反射到 host", async () => {
    const el = mount();
    el.setAttribute("size", "lg");
    await flush();
    expect(el.getAttribute("size")).toBe("lg");
  });
});
