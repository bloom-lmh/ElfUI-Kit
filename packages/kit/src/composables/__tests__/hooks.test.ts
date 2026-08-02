// useFormControl / useDisabled / useSize 单测

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("useFormControl", () => {
  it("dispatchInput 写入 model + emit + form-item input trigger", async () => {
    const { useReactive } = await import("@elfui/core");
    const { defineComponent } = await import("@elfui/core");
    const { useFormControl } = await import("../form");

    const tag = `elf-test-fc-${Date.now()}`;
    let ctl: ReturnType<typeof useFormControl<string>> | null = null;
    defineComponent({
      name: tag,
      props: { modelValue: { type: String, default: "" } },
      emits: ["update:modelValue", "input", "change", "blur", "focus"],
      setup: (props, ctx) => {
        ctl = useFormControl<string>(props, ctx.emit);
        return {};
      },
      render: () => document.createElement("div"),
    });

    const data = useReactive({ name: "" });

    const form = document.createElement("elf-form") as HTMLElement & { model?: unknown };
    form.model = data;
    document.body.appendChild(form);
    const item = document.createElement("elf-form-item");
    item.setAttribute("prop", "name");
    form.appendChild(item);
    const el = document.createElement(tag);
    el.addEventListener("update:modelValue", (e) => {
      data.name = (e as unknown as CustomEvent).detail;
    });
    item.appendChild(el);
    await tick();
    await tick();
    await tick();

    let inputEmit = "";
    el.addEventListener("input", (e) => {
      inputEmit = (e as unknown as CustomEvent).detail;
    });

    ctl!.dispatchInput("hello");
    await tick();
    expect(inputEmit).toBe("hello");
    expect(ctl!.model.value).toBe("hello");
  });
});

describe("useDisabled", () => {
  it("自身 disabled 或父级 form disabled 自动 true", async () => {
    const { useReactive } = await import("@elfui/core");
    const { defineComponent } = await import("@elfui/core");
    const { useDisabled } = await import("../form");

    const tag = `elf-test-dis-${Date.now()}`;
    let isDisabled: (() => boolean) | null = null;
    defineComponent({
      name: tag,
      props: { disabled: { type: Boolean, default: false } },
      setup: (props) => {
        isDisabled = useDisabled(() => Boolean(props.disabled));
        return {};
      },
      render: () => document.createElement("div"),
    });

    const data = useReactive({});

    // 父 form 全局 disabled = true
    const form = document.createElement("elf-form") as HTMLElement & {
      model?: unknown;
      disabled?: boolean;
    };
    form.model = data;
    form.disabled = true;
    document.body.appendChild(form);
    const el = document.createElement(tag);
    form.appendChild(el);
    await tick();
    await tick();

    expect(isDisabled!()).toBe(true);
  });
});

describe("useSize", () => {
  it("自身 size 优先 + 否则继承 form", async () => {
    const { useReactive } = await import("@elfui/core");
    const { defineComponent } = await import("@elfui/core");
    const { useSize } = await import("../form");

    const tag = `elf-test-sz-${Date.now()}`;
    let sizeOf: (() => string) | null = null;
    defineComponent({
      name: tag,
      props: { size: { type: String, default: "" } },
      setup: (props) => {
        sizeOf = useSize(() => props.size as string);
        return {};
      },
      render: () => document.createElement("div"),
    });

    const data = useReactive({});

    const form = document.createElement("elf-form") as HTMLElement & {
      model?: unknown;
      size?: string;
    };
    form.model = data;
    form.size = "lg";
    document.body.appendChild(form);
    const el = document.createElement(tag) as HTMLElement & { size?: string };
    form.appendChild(el);
    await tick();
    await tick();

    // 子组件无 size，继承父 form
    expect(sizeOf!()).toBe("lg");

    // 子组件设置 size，覆盖
    el.size = "sm";
    await tick();
    expect(sizeOf!()).toBe("sm");
  });
});
