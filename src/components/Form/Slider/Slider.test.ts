import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface SliderEl extends HTMLElement {
  modelValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  disabled?: boolean;
  showStops?: boolean;
  segmented?: boolean;
  marks?: unknown;
  tickLabels?: Array<string | number>;
  showInput?: boolean;
  showInputControls?: boolean;
  inputSize?: string;
  ariaLabel?: string;
  rangeStartLabel?: string;
  rangeEndLabel?: string;
  formatValueText?: (value: number) => string;
  tooltipClass?: string;
  placement?: string;
  label?: string;
}

const mount = async (patch: Partial<SliderEl> = {}): Promise<SliderEl> => {
  const el = document.createElement("elf-slider") as SliderEl;
  Object.assign(el, { modelValue: 20, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const setRangeValue = (input: HTMLInputElement, value: string, type = "input"): void => {
  input.value = value;
  input.dispatchEvent(new Event(type, { bubbles: true }));
};

describe("elf-slider", () => {
  it("单值滑动触发 update:modelValue 和 input", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onInput = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("input", onInput as EventListener);

    setRangeValue(el.shadowRoot!.querySelector(".native-single") as HTMLInputElement, "42");
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(42);
    expect(onInput).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".tooltip")?.textContent).toBe("42");
  });

  it("范围滑块交叉拖动时切换活动 thumb 并保持起止顺序", async () => {
    const el = await mount({ range: true, modelValue: [20, 80] });
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);

    setRangeValue(
      el.shadowRoot!.querySelector(".native-start") as HTMLInputElement,
      "90",
      "change",
    );
    await tick();

    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual([80, 90]);
  });

  it("范围滑块支持拖动起始滑块", async () => {
    const el = await mount({ range: true, modelValue: [20, 80] });
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);
    const main = el.shadowRoot!.querySelector(".slider-main") as HTMLElement;
    vi.spyOn(main, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 100,
      bottom: 32,
      width: 100,
      height: 32,
      toJSON: () => ({}),
    } as DOMRect);

    el.shadowRoot!.querySelector(".thumb-start")!.dispatchEvent(
      new MouseEvent("pointerdown", { bubbles: true, clientX: 40 }),
    );
    document.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: 50 }));
    document.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: 50 }));
    await tick();

    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([50, 80]);
    expect((onChange.mock.calls.at(-1)![0] as CustomEvent).detail).toEqual([50, 80]);
  });

  it("支持 marks 与 stops", async () => {
    const el = await mount({
      min: 0,
      max: 10,
      step: 2,
      showStops: true,
      marks: [
        { value: 0, label: "低" },
        { value: 10, label: "高" },
      ],
    });

    expect(el.shadowRoot!.querySelectorAll(".step-stop")).toHaveLength(4);
    expect(el.shadowRoot!.querySelectorAll(".mark-stop")).toHaveLength(2);
    expect(el.shadowRoot!.textContent).toContain("低");
    expect(el.shadowRoot!.textContent).toContain("高");
  });

  it("places non-uniform mark nodes by their actual value", async () => {
    const el = await mount({
      min: 0,
      max: 100,
      marks: { 0: "0 ℃", 30: "30 ℃", 100: "100 ℃" },
    });
    const nodes = el.shadowRoot!.querySelectorAll<HTMLElement>(".mark-stop");

    expect(Array.from(nodes, (node) => node.style.left)).toEqual(["0%", "30%", "100%"]);
    expect(el.shadowRoot!.textContent).toContain("30 ℃");
  });

  it("支持分段展示", async () => {
    const el = await mount({
      min: 0,
      max: 100,
      step: 25,
      segmented: true,
      modelValue: 50,
    });

    expect(el.shadowRoot!.querySelectorAll(".segment")).toHaveLength(4);
    expect(el.shadowRoot!.querySelectorAll(".segment.is-active")).toHaveLength(2);
  });

  it("segmented 模式输入会吸附到最近分段点", async () => {
    const el = await mount({
      min: 0,
      max: 100,
      step: 1,
      segmented: true,
      modelValue: 45,
      marks: [
        { value: 0, label: "0" },
        { value: 25, label: "25" },
        { value: 50, label: "50" },
        { value: 100, label: "100" },
      ],
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    setRangeValue(el.shadowRoot!.querySelector(".native-single") as HTMLInputElement, "38");
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(50);
    expect(el.shadowRoot!.querySelector(".tooltip")?.textContent).toBe("50");
  });

  it("disabled 时不会提交值", async () => {
    const el = await mount({ disabled: true });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    setRangeValue(el.shadowRoot!.querySelector(".native-single") as HTMLInputElement, "70");
    await tick();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("fills only the portion of the final segmented track", async () => {
    const el = await mount({
      min: 0,
      max: 100,
      segmented: true,
      modelValue: 45,
      marks: [0, 25, 50, 100],
    });
    const segments = el.shadowRoot!.querySelectorAll<HTMLElement>(".segment");

    expect(segments[1]?.style.getPropertyValue("--segment-fill")).toBe("80%");
    expect(segments[2]?.style.getPropertyValue("--segment-fill")).toBe("0%");
  });

  it("uses primitive stable keys for object marks in range and segmented modes", async () => {
    const marks = [
      { value: 0, label: "起点" },
      { value: 50, label: "中点" },
      { value: 100, label: "终点" },
    ];
    const range = await mount({ range: true, modelValue: [20, 80], marks });
    const segmented = await mount({ segmented: true, modelValue: 45, marks });

    expect(
      Array.from(range.shadowRoot!.querySelectorAll(".mark"), (item) => item.textContent?.trim()),
    ).toEqual(["起点", "中点", "终点"]);
    expect(segmented.shadowRoot!.querySelectorAll(".segment")).toHaveLength(2);
  });

  it("exposes accessible labels and formatted value text on native range inputs", async () => {
    const el = await mount({
      range: true,
      modelValue: [20, 80],
      rangeStartLabel: "Minimum price",
      rangeEndLabel: "Maximum price",
      formatValueText: (value) => `$${value}`,
    });

    const start = el.shadowRoot!.querySelector(".native-start") as HTMLInputElement;
    const end = el.shadowRoot!.querySelector(".native-end") as HTMLInputElement;
    expect(start.getAttribute("aria-label")).toBe("Minimum price");
    expect(end.getAttribute("aria-label")).toBe("Maximum price");
    expect(start.getAttribute("aria-valuetext")).toBe("$20");
    expect(end.getAttribute("aria-valuetext")).toBe("$80");
    const startDescription = el.shadowRoot!.getElementById(start.getAttribute("aria-describedby")!);
    const endDescription = el.shadowRoot!.getElementById(end.getAttribute("aria-describedby")!);
    expect(startDescription?.textContent).toContain("Minimum price: $20");
    expect(endDescription?.textContent).toContain("Maximum price: $80");
    expect(startDescription?.getAttribute("aria-live")).toBe("polite");
  });

  it("uses unique description ids for every slider instance", async () => {
    const first = await mount({ ariaLabel: "First" });
    const second = await mount({ ariaLabel: "Second" });
    const firstInput = first.shadowRoot!.querySelector(".native-single") as HTMLInputElement;
    const secondInput = second.shadowRoot!.querySelector(".native-single") as HTMLInputElement;

    expect(firstInput.getAttribute("aria-describedby")).not.toBe(
      secondInput.getAttribute("aria-describedby"),
    );
  });

  it("applies tooltip placement and consumer classes", async () => {
    const el = await mount({ tooltipClass: "price-tooltip", placement: "right" });
    const tooltip = el.shadowRoot!.querySelector(".tooltip") as HTMLElement;

    expect(tooltip.classList.contains("placement-right")).toBe(true);
    expect(tooltip.classList.contains("price-tooltip")).toBe(true);
  });

  it("supports a sized input without native number controls and keeps it synchronized", async () => {
    const el = await mount({
      modelValue: 20,
      showInput: true,
      showInputControls: false,
      inputSize: "large",
      label: "Volume",
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    const input = el.shadowRoot!.querySelector(".number-input") as HTMLInputElement;

    expect(input.classList.contains("without-controls")).toBe(true);
    expect(input.classList.contains("size-lg")).toBe(true);
    expect(input.getAttribute("aria-label")).toBe("Volume");

    setRangeValue(input, "42");
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(42);
  });

  it("distributes tick labels evenly and exposes range thumb-label slots", async () => {
    const el = await mount({
      range: true,
      modelValue: [20, 80],
      tickLabels: ["Winter", "Spring", "Summer", "Fall"],
    });
    const labels = Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>(".mark"));

    expect(labels.map((item) => item.textContent?.trim())).toEqual([
      "Winter",
      "Spring",
      "Summer",
      "Fall",
    ]);
    expect(labels.map((item) => Number.parseFloat(item.style.left))).toEqual([
      0,
      expect.closeTo(33.333, 2),
      expect.closeTo(66.667, 2),
      100,
    ]);
    expect(el.shadowRoot!.querySelector('slot[name="thumb-label-start"]')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('slot[name="thumb-label-end"]')).toBeTruthy();
  });
});
