import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

type ProgressHost = HTMLElement & {
  percentage?: number;
  type?: string;
  value?: number;
  max?: number;
  variant?: string;
  status?: string;
  color?: string;
  height?: string;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  textInside?: boolean;
  label?: string;
  labelPosition?: string;
  hideValue?: boolean;
  reverse?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  transitionDuration?: number;
  format?: (percent: number, value: number) => string;
  valueFormat?: string | ((percent: number, value: number, max: number) => string);
};

const mount = async (patch: Partial<ProgressHost> = {}): Promise<ProgressHost> => {
  const el = document.createElement("elf-progress") as ProgressHost;
  Object.assign(el, patch);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-progress", () => {
  it("渲染条形进度并同步百分比变量", async () => {
    const el = await mount({ value: 30 });

    expect(el.getAttribute("data-type")).toBe("line");
    expect(el.style.getPropertyValue("--_progress-percent")).toBe("30%");
    expect(el.shadowRoot!.querySelector(".line-value")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain("30%");
  });

  it("根据 max 计算百分比并限制到 100%", async () => {
    const el = await mount({ value: 80, max: 40 });

    expect(el.style.getPropertyValue("--_progress-percent")).toBe("100%");
    expect(el.shadowRoot!.querySelector(".progress")?.getAttribute("aria-valuenow")).toBe("40");
  });

  it("支持环形进度", async () => {
    const el = await mount({ variant: "circle", value: 75, size: 120, strokeWidth: 10 });
    const circle = el.shadowRoot!.querySelector(".circle-value") as SVGCircleElement;

    expect(el.getAttribute("data-type")).toBe("circle");
    expect(el.style.getPropertyValue("--_progress-size")).toBe("120px");
    expect(circle.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(circle.getAttribute("stroke-dashoffset")).toBe("25");
  });

  it("支持 status / color / striped / indeterminate", async () => {
    const el = await mount({ status: "warning", striped: true, indeterminate: true });

    expect(el.getAttribute("status")).toBe("warning");
    expect(el.hasAttribute("data-striped")).toBe(true);
    expect(el.hasAttribute("data-indeterminate")).toBe(true);
    expect(el.style.getPropertyValue("--_progress-color")).toBe("var(--elf-warning)");
  });

  it("支持 format 函数与内部文字", async () => {
    const el = await mount({
      value: 5,
      max: 10,
      textInside: true,
      format: (percent, value) => `${value} / ${percent}`
    });

    expect(el.hasAttribute("data-text-inside")).toBe(true);
    expect(el.shadowRoot!.textContent).toContain("5 / 50");
  });

  it("prefers Element Plus percentage and type props", async () => {
    const el = await mount({ percentage: 75, type: "dashboard", value: 5 } as Partial<ProgressHost>);
    const circle = el.shadowRoot!.querySelector(".circle-value") as SVGCircleElement;

    expect(el.getAttribute("data-type")).toBe("dashboard");
    expect(el.style.getPropertyValue("--_progress-percent")).toBe("75%");
    expect(circle.getAttribute("stroke-dasharray")).toBe("75 100");
    expect(circle.getAttribute("stroke-dashoffset")).toBe("18.75");
  });

  it("supports Element Plus duration, width, line cap, and striped flow", async () => {
    const el = await mount({
      type: "circle",
      width: 140,
      duration: 2,
      strokeLinecap: "butt",
      stripedFlow: true
    } as Partial<ProgressHost>);
    const circle = el.shadowRoot!.querySelector(".circle-value") as SVGCircleElement;

    expect(el.style.getPropertyValue("--_progress-size")).toBe("140px");
    expect(el.style.getPropertyValue("--_progress-duration")).toBe("2s");
    expect(el.style.getPropertyValue("--_progress-linecap")).toBe("butt");
    expect(el.hasAttribute("data-striped-flow")).toBe(true);
    expect(circle).toBeTruthy();
  });

  it("updates a circle percentage and exposes the displayed percentage to assistive technology", async () => {
    const el = await mount({ type: "circle", percentage: 32 } as Partial<ProgressHost>);
    const progress = el.shadowRoot!.querySelector(".progress")!;
    expect(progress.getAttribute("aria-valuenow")).toBe("32");
    expect(progress.getAttribute("aria-valuemax")).toBe("100");

    el.percentage = 80;
    await tick();
    expect((el.shadowRoot!.querySelector(".circle-value") as SVGCircleElement).getAttribute("stroke-dashoffset")).toBe("20");
    expect(progress.getAttribute("aria-valuenow")).toBe("80");
  });

  it("支持单独设置数值增长过渡速度", async () => {
    const el = await mount({ transitionDuration: 1.25 });

    expect(el.style.getPropertyValue("--_progress-transition-duration")).toBe("1.25s");
    expect(el.style.getPropertyValue("--_progress-duration")).toBe("3s");
  });

  it("supports labels, positions, hidden values, and template formatting", async () => {
    const el = await mount({
      value: 19,
      max: 80,
      label: "Uploading files",
      labelPosition: "bottom",
      valueFormat: "[value] / [max] ([percent]%)",
      reverse: true
    });
    expect(el.getAttribute("label-position")).toBe("bottom");
    expect(el.hasAttribute("data-reverse")).toBe(true);
    expect(el.shadowRoot!.querySelector(".line-label")?.textContent).toContain("Uploading files");
    expect(el.shadowRoot!.textContent).toContain("19 / 80 (24%)");

    el.hideValue = true;
    await tick();
    expect(el.shadowRoot!.textContent).not.toContain("19 / 80");
  });

  it("maps semantic custom colors through theme variables", async () => {
    const el = await mount({ color: "success" });
    expect(el.style.getPropertyValue("--_progress-color")).toBe("var(--elf-success)");
  });
});
