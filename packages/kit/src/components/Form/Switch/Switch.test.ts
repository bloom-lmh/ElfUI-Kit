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

type SwitchHost = HTMLElement & {
  modelValue?: string | number | boolean;
  disabled?: boolean;
  loading?: boolean;
  inset?: boolean;
  flat?: boolean;
  variant?: string;
  color?: string;
  activeColor?: string;
  inactiveColor?: string;
  label?: string;
  labelPosition?: string;
  activeText?: string;
  inactiveText?: string;
  beforeChange?: (v: boolean) => boolean;
  width?: string | number;
  id?: string;
  ariaLabel?: string;
  activeValue?: string | number | boolean;
  inactiveValue?: string | number | boolean;
  inlinePrompt?: boolean;
  activeActionIcon?: string;
  inactiveActionIcon?: string;
  focus?: () => void;
};

const mount = async (patch: Partial<SwitchHost> = {}): Promise<SwitchHost> => {
  const el = document.createElement("elf-switch") as SwitchHost;
  Object.assign(el, patch);
  document.body.appendChild(el);
  await flush();
  return el;
};

describe("elf-switch", () => {
  it("渲染 track", async () => {
    const el = await mount();
    expect(el.shadowRoot!.querySelector(".track")).toBeTruthy();
  });

  it("点击切换并 emit update:modelValue=true", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (el.shadowRoot!.querySelector(".track") as HTMLElement).click();
    await flush();

    expect(onUpdate).toHaveBeenCalled();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
    expect(el.hasAttribute("data-checked")).toBe(true);
  });

  it("disabled 时点击无效", async () => {
    const el = await mount({ disabled: true });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (el.shadowRoot!.querySelector(".track") as HTMLElement).click();
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("activeText / inactiveText 展示状态文字", async () => {
    const el = await mount({ activeText: "开", inactiveText: "关" });

    const labels = el.shadowRoot!.querySelectorAll(".state-label");
    expect(labels.length).toBe(2);
    expect(labels[0]?.textContent).toContain("关");
    expect(labels[1]?.textContent).toContain("开");
  });

  it("beforeChange 返回 false 时阻止切换", async () => {
    const el = await mount({ beforeChange: () => false });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    (el.shadowRoot!.querySelector(".track") as HTMLElement).click();
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("Space 键切换", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);

    el.shadowRoot!.querySelector(".track")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: " " }),
    );
    await flush();

    expect(onUpdate).toHaveBeenCalled();
  });

  it("loading 状态下禁用并显示 spinner", async () => {
    const el = await mount({ loading: true });

    expect(el.hasAttribute("data-loading")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.shadowRoot!.querySelector(".spinner")).toBeTruthy();
  });

  it("支持 inset / flat / color 外观属性", async () => {
    const el = await mount({ inset: true, flat: true, color: "success" });

    expect(el.hasAttribute("data-inset")).toBe(true);
    expect(el.hasAttribute("data-flat")).toBe(true);
    expect(el.style.getPropertyValue("--_switch-active")).toBe("var(--elf-success)");
  });

  it("支持 label 属性和默认 slot", async () => {
    const withLabel = await mount({ label: "接收通知", labelPosition: "start" });
    expect(withLabel.getAttribute("data-label-position")).toBe("start");
    expect(withLabel.shadowRoot!.querySelector(".main-label")?.textContent).toContain("接收通知");

    const withSlot = await mount();
    withSlot.textContent = "允许提醒";
    await flush();
    const slot = withSlot.shadowRoot!.querySelector("slot") as HTMLSlotElement;
    expect(
      slot
        .assignedNodes()
        .map((node) => node.textContent)
        .join(""),
    ).toContain("允许提醒");
  });
  it("supports custom active and inactive values with form-compatible change events", async () => {
    const el = await mount({ modelValue: "off", activeValue: "on", inactiveValue: "off" });
    const onChange = vi.fn();
    el.addEventListener("change", onChange as unknown as EventListener);
    (el.shadowRoot!.querySelector(".track") as HTMLElement).click();
    await flush();
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toBe("on");
    expect(el.hasAttribute("data-checked")).toBe(true);
  });

  it("applies width, aria metadata, inline prompt, and keyboard focus", async () => {
    const el = await mount({
      width: 64,
      id: "notifications",
      ariaLabel: "Notifications",
      inlinePrompt: true,
      activeText: "ON",
      inactiveText: "OFF",
    });
    const track = el.shadowRoot!.querySelector(".track") as HTMLElement;
    expect(track.id).toBe("notifications");
    expect(track.getAttribute("aria-label")).toBe("Notifications");
    expect(el.style.getPropertyValue("--_switch-width-custom")).toBe("64px");
    expect(el.shadowRoot!.querySelector(".inline-content")?.textContent).toContain("OFF");
    track.focus();
    expect(el.shadowRoot!.activeElement).toBe(track);
  });

  it("accepts a numeric width attribute without collapsing the track", async () => {
    const el = await mount({ width: "64", inlinePrompt: true, inactiveText: "关" });

    expect(el.style.getPropertyValue("--_switch-width-custom")).toBe("64px");
    expect(el.shadowRoot!.querySelector(".inline-content")?.textContent).toContain("关");
  });

  it("renders action icons and exposes focus", async () => {
    const el = await mount({
      inactiveActionIcon: "○",
      activeActionIcon: "✓",
    });
    const track = el.shadowRoot!.querySelector(".track") as HTMLElement;

    expect(el.shadowRoot!.querySelector(".action-icon")?.textContent).toContain("○");
    expect(
      el.shadowRoot!.querySelector(".action-icon")?.parentElement?.classList.contains("thumb"),
    ).toBe(true);
    el.focus?.();
    expect(el.shadowRoot!.activeElement).toBe(track);

    track.click();
    await flush();
    expect(el.shadowRoot!.querySelector(".action-icon")?.textContent).toContain("✓");
  });

  it.each(["default", "inset", "material", "square"])(
    "reflects the %s visual variant",
    async (variant) => {
      const el = await mount({ variant });
      expect(el.getAttribute("data-variant")).toBe(variant);
    },
  );

  it("keeps inset prop as a backwards-compatible variant alias", async () => {
    const el = await mount({ variant: "square", inset: true });
    expect(el.getAttribute("data-variant")).toBe("inset");
  });
});
