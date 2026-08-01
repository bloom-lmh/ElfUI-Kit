import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { registerComponents } from "@elfui/core";

import { Alert } from "./index";
import type { AlertDensity, AlertType, AlertVariant } from "./types";

beforeAll(() => {
  registerComponents(Alert);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

interface AlertElement extends HTMLElement {
  type?: AlertType;
  variant?: AlertVariant;
  title?: string;
  description?: string;
  closable?: boolean;
  closeText?: string;
  showIcon?: boolean;
  center?: boolean;
  density?: AlertDensity;
  prominent?: boolean;
}

const mount = async (
  patch: Partial<AlertElement> = {},
  children: Node[] = [],
): Promise<AlertElement> => {
  const element = document.createElement("elf-alert") as AlertElement;
  Object.assign(element, { title: "提示", ...patch });
  element.append(...children);
  document.body.appendChild(element);
  await tick();
  return element;
};

const alertBody = (element: AlertElement): HTMLElement =>
  element.shadowRoot!.querySelector<HTMLElement>(".alert")!;

describe("elf-alert", () => {
  it("renders title and description with alert semantics", async () => {
    const element = await mount({ type: "success", title: "操作成功", description: "数据已保存" });

    expect(alertBody(element).getAttribute("role")).toBe("alert");
    expect(alertBody(element).textContent).toContain("操作成功");
    expect(alertBody(element).textContent).toContain("数据已保存");
  });

  it("reflects the tip semantic type and renders its icon", async () => {
    const element = await mount({ type: "tip" });

    expect(element.getAttribute("type")).toBe("tip");
    expect(element.shadowRoot!.querySelector(".icon path")).toBeTruthy();
  });

  it.each(["tonal", "soft", "elevated", "outlined", "plain", "filled"] as const)(
    "renders and reflects the %s variant",
    async (variant) => {
      const element = await mount({ variant });

      expect(element.getAttribute("variant")).toBe(variant);
      expect(alertBody(element)).toBeTruthy();
    },
  );

  it("emits close and removes its content after the closing transition", async () => {
    const element = await mount({ closable: true });
    const onClose = vi.fn();
    element.addEventListener("close", onClose);

    element.shadowRoot!.querySelector<HTMLButtonElement>(".close")!.click();
    await wait(220);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(element.hasAttribute("data-closed")).toBe(true);
    expect(element.shadowRoot!.querySelector(".alert")).toBeNull();
  });

  it("deduplicates close while the transition is running", async () => {
    const element = await mount({ closable: true });
    const onClose = vi.fn();
    element.addEventListener("close", onClose);
    const button = element.shadowRoot!.querySelector<HTMLButtonElement>(".close")!;

    button.click();
    button.click();
    await tick();

    expect(button.disabled).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("uses closeText for visible and accessible close labels", async () => {
    const element = await mount({ closable: true, closeText: "知道了" });
    const button = element.shadowRoot!.querySelector<HTMLButtonElement>(".close")!;

    expect(button.textContent).toContain("知道了");
    expect(button.getAttribute("aria-label")).toBe("知道了");
  });

  it("hides the icon when showIcon is false", async () => {
    const element = await mount({ showIcon: false });
    expect(element.shadowRoot!.querySelector(".icon")).toBeNull();
  });

  it("reflects center, density and prominent visual states", async () => {
    const element = await mount({ center: true, density: "compact", prominent: true });

    expect(element.hasAttribute("center")).toBe(true);
    expect(element.getAttribute("density")).toBe("compact");
    expect(element.hasAttribute("prominent")).toBe(true);
  });

  it("projects custom icon and title slots", async () => {
    const icon = document.createElement("span");
    icon.slot = "icon";
    icon.textContent = "★";
    const title = document.createElement("strong");
    title.slot = "title";
    title.textContent = "自定义标题";
    const element = await mount({}, [icon, title]);

    const iconSlot = element.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="icon"]')!;
    const titleSlot = element.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="title"]')!;
    expect(iconSlot.assignedElements()).toEqual([icon]);
    expect(titleSlot.assignedElements()).toEqual([title]);
  });
});
