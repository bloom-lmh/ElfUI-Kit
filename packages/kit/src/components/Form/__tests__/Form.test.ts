// elf-form / elf-form-item / elf-input 联动集成测试
//
// 覆盖：
// - form / form-item / input 连接
// - input 失焦触发 blur 校验
// - validate / resetFields / clearValidate
// - 自定义 validator
// - rules 合并（form.rules[prop] + item.rules）

import { useReactive } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

interface FormHost extends HTMLElement {
  validate(): Promise<boolean>;
  resetFields(prop?: string | string[]): void;
  clearValidate(prop?: string | string[]): void;
  validateField(prop: string | string[], trigger?: string): Promise<boolean>;
  scrollToField(prop: string, options?: ScrollIntoViewOptions | boolean): void;
  getField(prop: string): FormItemHost | undefined;
  setInitialValues(values?: Record<string, unknown>): void;
  readonly fields: readonly FormItemHost[];
  model?: unknown;
  rules?: unknown;
}

interface FormItemHost {
  readonly prop: string;
  readonly initialValue: unknown;
  readonly state: "" | "validating" | "success" | "error";
  readonly message: string;
  validate(trigger?: string): Promise<boolean>;
  resetField(): void;
  clearValidate(): void;
  setInitialValue(value?: unknown): void;
}

const buildSimpleForm = async (): Promise<{
  form: FormHost;
  item: HTMLElement;
  input: HTMLElement;
  inputEl: HTMLInputElement;
  data: { name: string };
}> => {
  // 注意：把 useReactive 对象当作 form.model 直接传入。setup 内 props.model
  // 会读到代理本身，输入框写入时通过代理同步。
  const data = useReactive({ name: "" });

  const form = document.createElement("elf-form") as FormHost;
  // 直接传 useReactive 对象（form-item 通过 inject 拿到 form context，再 getPath(form.model, "name")）
  form.model = data;
  form.rules = { name: [{ required: true, message: "必填", trigger: "blur" }] };
  document.body.appendChild(form);

  const item = document.createElement("elf-form-item");
  item.setAttribute("prop", "name");
  item.setAttribute("label", "姓名");
  form.appendChild(item);

  const input = document.createElement("elf-input") as HTMLElement & { modelValue?: unknown };
  // 双向同步：input → data
  input.addEventListener("update:modelValue", (e) => {
    data.name = (e as unknown as CustomEvent).detail;
  });
  item.appendChild(input);

  await tick();
  await tick();
  await tick();

  const inputEl = input.shadowRoot!.querySelector("input") as HTMLInputElement;
  return { form, item, input, inputEl, data };
};

describe("Form 联动", () => {
  it("form / form-item / input 渲染并连接", async () => {
    const { form, item, input, inputEl } = await buildSimpleForm();
    expect(form.shadowRoot!.querySelector("form")).toBeTruthy();
    expect(item.shadowRoot!.querySelector("label")?.textContent?.trim()).toBe("姓名");
    expect(input.shadowRoot!.querySelector("input")).toBe(inputEl);
  });

  it("validate() 失败：返回 false 且 form-item state=error", async () => {
    const { form, item } = await buildSimpleForm();

    const ok = await form.validate();
    expect(ok).toBe(false);
    await tick();
    expect(item.shadowRoot!.querySelector(".error")?.textContent).toContain("必填");
  });

  it("validate() 通过：填值后", async () => {
    const { form, data, inputEl } = await buildSimpleForm();

    inputEl.value = "Alice";
    inputEl.dispatchEvent(new Event("input"));
    await tick();
    await tick();
    expect(data.name).toBe("Alice");

    const ok = await form.validate();
    expect(ok).toBe(true);
  });

  it("blur 触发校验 + 显示错误", async () => {
    const { item, inputEl } = await buildSimpleForm();

    inputEl.dispatchEvent(new Event("blur"));
    await tick();
    await tick();
    expect(item.shadowRoot!.querySelector(".error")?.textContent).toContain("必填");
  });

  it("resetFields 清空 + 清错误状态", async () => {
    const { form, data, item, inputEl } = await buildSimpleForm();

    inputEl.value = "Bob";
    inputEl.dispatchEvent(new Event("input"));
    await tick();
    expect(data.name).toBe("Bob");

    await form.validate();
    form.resetFields();
    await tick();
    await tick();
    expect(data.name).toBe("");
    expect(item.shadowRoot!.querySelector(".error")).toBeNull();
  });

  it("clearValidate 清错误不重置值", async () => {
    const { form, data, item } = await buildSimpleForm();

    await form.validate();
    await tick();
    expect(item.shadowRoot!.querySelector(".error")).toBeTruthy();

    form.clearValidate();
    await tick();
    expect(item.shadowRoot!.querySelector(".error")).toBeNull();
    expect(data.name).toBe("");
  });

  it("validateField 只校验指定字段", async () => {
    const { form, item } = await buildSimpleForm();

    const ok = await form.validateField("name");
    await tick();

    expect(ok).toBe(false);
    expect(item.shadowRoot!.querySelector(".error")?.textContent).toContain("必填");
  });

  it("scrollToError 会定位到第一个错误字段", async () => {
    const { form, item } = await buildSimpleForm();
    (form as FormHost & { scrollToError?: boolean }).scrollToError = true;
    const scrollIntoView = vi.fn();
    item.scrollIntoView = scrollIntoView;

    expect(await form.validate()).toBe(false);
    await tick();

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
  });

  it("exposes registered fields and scrolls a requested field with explicit options", async () => {
    const { form, item } = await buildSimpleForm();
    const scrollIntoView = vi.fn();
    item.scrollIntoView = scrollIntoView;

    expect(form.fields).toHaveLength(1);
    expect(form.getField("name")?.prop).toBe("name");
    expect(form.getField("missing")).toBeUndefined();

    form.scrollToField("name", { behavior: "auto", block: "start" });
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
  });

  it("updates reset baselines through setInitialValues", async () => {
    const { form, data } = await buildSimpleForm();
    data.name = "Current";
    form.setInitialValues({ name: "Baseline" });
    data.name = "Changed";

    form.resetFields("name");
    expect(data.name).toBe("Baseline");
  });

  it("accepts undefined as an explicit reset baseline", async () => {
    const { form, data } = await buildSimpleForm();
    data.name = "Current";
    form.setInitialValues({ name: undefined });
    data.name = "Changed";

    form.resetFields("name");
    expect(data.name).toBeUndefined();
  });

  it("emits Element-compatible per-field validation details", async () => {
    const { form } = await buildSimpleForm();
    const validateEvent = vi.fn();
    form.addEventListener("validate", validateEvent);

    expect(await form.validateField("name")).toBe(false);
    const event = validateEvent.mock.calls[0]![0] as CustomEvent;
    expect(event.detail).toEqual(["name", false, "必填"]);
  });

  it("exposes FormItem validation state and command methods", async () => {
    const { form, item } = await buildSimpleForm();
    const exposed = item as HTMLElement & {
      validate(): Promise<boolean>;
      resetField(): void;
      clearValidate(): void;
      setInitialValue(value?: unknown): void;
      readonly validateState: string;
      readonly validateMessage: string;
    };

    expect(await exposed.validate()).toBe(false);
    expect(exposed.validateState).toBe("error");
    expect(exposed.validateMessage).toBe("必填");

    exposed.clearValidate();
    expect(exposed.validateState).toBe("");
    expect(form.fields[0]?.state).toBe("");
  });

  it("reflects asterisk placement, status icons, and accessible feedback", async () => {
    const { form, item } = await buildSimpleForm();
    (
      form as FormHost & { requireAsteriskPosition?: string; statusIcon?: boolean }
    ).requireAsteriskPosition = "right";
    (form as FormHost & { requireAsteriskPosition?: string; statusIcon?: boolean }).statusIcon =
      true;
    item.setAttribute("required", "");
    await tick();

    expect(await form.validate()).toBe(false);
    await tick();

    expect(item.hasAttribute("data-asterisk-right")).toBe(true);
    expect(item.shadowRoot!.querySelector(".status-icon.error")?.textContent).toContain("!");
    expect(item.shadowRoot!.querySelector(".feedback.error")?.getAttribute("role")).toBe("alert");
  });

  it("keeps inline layout on the native form and supports native submit opt-out", async () => {
    const form = document.createElement("elf-form") as FormHost & {
      inline?: boolean;
      preventSubmit?: boolean;
    };
    form.inline = true;
    form.preventSubmit = false;
    document.body.appendChild(form);
    await tick();
    await tick();

    expect(form.hasAttribute("inline")).toBe(true);
    const nativeForm = form.shadowRoot!.querySelector("form")!;
    const submit = new SubmitEvent("submit", { bubbles: true, cancelable: true });
    nativeForm.dispatchEvent(submit);

    expect(submit.defaultPrevented).toBe(false);
  });
});

describe("CheckboxGroup 联动", () => {
  it("checkbox-group min/max 限制", async () => {
    const group = document.createElement("elf-checkbox-group") as HTMLElement & {
      modelValue?: unknown[];
      min?: number;
      max?: number;
    };
    document.body.appendChild(group);
    group.min = 1;
    group.modelValue = ["a"];
    await tick();
    await tick();

    const cb = document.createElement("elf-checkbox") as HTMLElement & { value?: unknown };
    cb.value = "a";
    group.appendChild(cb);
    await tick();
    await tick();

    let called = false;
    group.addEventListener("update:modelValue", () => {
      called = true;
    });

    const box = cb.shadowRoot!.querySelector(".box") as HTMLElement;
    box.click();
    await tick();

    // min=1，不能取消最后一个
    expect(called).toBe(false);
  });
});

describe("RadioGroup 联动", () => {
  it("radio-group 切换选项", async () => {
    const group = document.createElement("elf-radio-group") as HTMLElement & {
      modelValue?: unknown;
    };
    group.modelValue = "a";
    document.body.appendChild(group);

    const r1 = document.createElement("elf-radio") as HTMLElement & { value?: unknown };
    r1.value = "a";
    group.appendChild(r1);

    const r2 = document.createElement("elf-radio") as HTMLElement & { value?: unknown };
    r2.value = "b";
    group.appendChild(r2);
    await tick();
    await tick();

    let emitted: unknown = null;
    group.addEventListener("update:modelValue", (e) => {
      emitted = (e as CustomEvent).detail;
      group.modelValue = emitted;
    });

    const dot2 = r2.shadowRoot!.querySelector(".dot") as HTMLElement;
    dot2.click();
    await tick();

    expect(emitted).toBe("b");
    expect(r2.hasAttribute("data-checked")).toBe(true);
  });
});

describe("异步校验", () => {
  it("异步 validator 校验", async () => {
    const data = useReactive({ name: "" });

    const form = document.createElement("elf-form") as FormHost;
    form.model = data;
    form.rules = {
      name: [
        {
          validator: async () => {
            await new Promise((r) => setTimeout(r, 10));
            return "异步校验失败";
          },
        },
      ],
    };
    document.body.appendChild(form);

    const item = document.createElement("elf-form-item");
    item.setAttribute("prop", "name");
    form.appendChild(item);
    await tick();
    await tick();

    const ok = await form.validate();
    expect(ok).toBe(false);
    expect(item.shadowRoot!.querySelector(".error")?.textContent).toContain("异步校验失败");
  });

  it("ignores a stale asynchronous result after a newer validation completes", async () => {
    const data = useReactive({ name: "old" });
    const form = document.createElement("elf-form") as FormHost;
    form.model = data;
    form.rules = {
      name: [
        {
          validator: async (value) => {
            await new Promise((resolve) => setTimeout(resolve, value === "old" ? 30 : 1));
            return value === "old" ? "stale error" : true;
          },
        },
      ],
    };
    document.body.appendChild(form);

    const item = document.createElement("elf-form-item");
    item.setAttribute("prop", "name");
    form.appendChild(item);
    await tick();
    await tick();

    const field = form.getField("name")!;
    const stale = field.validate();
    data.name = "new";
    const current = field.validate();
    await Promise.all([stale, current]);

    expect(field.state).toBe("success");
    expect(field.message).toBe("");
    expect(item.shadowRoot!.querySelector(".error")).toBeNull();
  });
});
