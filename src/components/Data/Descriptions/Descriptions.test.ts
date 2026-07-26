import { readFileSync } from "node:fs";

import { registerComponents } from "@elfui/core";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { DescriptionsItem } from "../DescriptionsItem";
import { Descriptions } from "./index";

interface DescriptionsElement extends HTMLElement {
  border?: boolean;
  column?: number;
  direction?: string;
  emptyText?: string;
  items?: unknown[];
  props?: Record<string, string>;
  responsive?: boolean;
  size?: string;
  title?: string;
}

type ResizeCallback = ConstructorParameters<typeof ResizeObserver>[0];

const originalResizeObserver = globalThis.ResizeObserver;
let resizeCallback: ResizeCallback | undefined;
let observedTarget: Element | undefined;

class ResizeObserverMock implements ResizeObserver {
  constructor(callback: ResizeCallback) {
    resizeCallback = callback;
  }

  disconnect(): void {}

  observe(target: Element): void {
    observedTarget = target;
  }

  unobserve(): void {}
}

beforeAll(() => {
  globalThis.ResizeObserver = ResizeObserverMock;
  registerComponents(Descriptions, DescriptionsItem);
});

afterEach(() => {
  document.body.innerHTML = "";
  resizeCallback = undefined;
  observedTarget = undefined;
});

afterAll(() => {
  globalThis.ResizeObserver = originalResizeObserver;
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

const resize = async (width: number): Promise<void> => {
  if (!resizeCallback || !observedTarget) throw new Error("ResizeObserver was not connected");
  resizeCallback(
    [
      {
        target: observedTarget,
        contentRect: {
          width,
          height: 320,
          x: 0,
          y: 0,
          top: 0,
          right: width,
          bottom: 320,
          left: 0,
          toJSON: () => ({})
        }
      } as ResizeObserverEntry
    ],
    {} as ResizeObserver
  );
  await tick();
};

describe("elf-descriptions", () => {
  it("normalizes field mapping, responsive spans, and empty values", async () => {
    const element = document.createElement("elf-descriptions") as DescriptionsElement;
    element.title = "Release";
    element.column = 4;
    element.emptyText = "Not provided";
    element.props = {
      key: "id",
      label: "term",
      value: "content",
      span: "columns"
    };
    element.items = [
      { id: "name", term: "Name", content: "ElfUI" },
      { id: "note", term: "Note", content: null, columns: 3 },
      { id: "count", term: "Count", content: 0 },
      { id: "enabled", term: "Enabled", content: false }
    ];
    document.body.appendChild(element);
    await tick();

    const root = element.shadowRoot!;
    expect(root.textContent).toContain("Not provided");
    expect(root.textContent).toContain("0");
    expect(root.textContent).toContain("false");
    expect(element.getAttribute("data-columns")).toBe("4");

    await resize(520);
    expect(element.getAttribute("data-columns")).toBe("1");
    expect(root.querySelector<HTMLElement>(".item")!.style.gridColumn).toBe("span 1");
  });

  it("shows named header slots without shortcut props and supports an empty slot", async () => {
    const element = document.createElement("elf-descriptions") as DescriptionsElement;
    element.innerHTML = `
      <strong slot="title">Runtime profile</strong>
      <button slot="extra" type="button">Edit</button>
      <span slot="empty">Choose an environment</span>
    `;
    document.body.appendChild(element);
    await tick();

    const root = element.shadowRoot!;
    expect(root.querySelector<HTMLElement>(".header")!.style.display).not.toBe("none");
    expect(root.querySelector<HTMLSlotElement>('slot[name="title"]')!.assignedElements()).toHaveLength(1);
    expect(root.querySelector<HTMLSlotElement>('slot[name="extra"]')!.assignedElements()).toHaveLength(1);
    expect(root.querySelector<HTMLSlotElement>('slot[name="empty"]')!.assignedElements()).toHaveLength(1);
  });

  it("coordinates declarative items and restores parent-managed state after removal", async () => {
    const element = document.createElement("elf-descriptions") as DescriptionsElement;
    element.border = true;
    element.column = 3;
    element.direction = "vertical";
    element.size = "lg";
    element.innerHTML = `
      <elf-descriptions-item
        label="Name"
        span="3"
        rowspan="2"
        label-width="100"
        label-class-name="accent-label"
      >
        <strong>ElfUI</strong>
      </elf-descriptions-item>
      <elf-descriptions-item label="Owner"></elf-descriptions-item>
    `;
    document.body.appendChild(element);
    await tick();

    const child = element.querySelector<HTMLElement>("elf-descriptions-item")!;
    expect(child.getAttribute("data-border")).toBe("");
    expect(child.getAttribute("data-direction")).toBe("vertical");
    expect(child.getAttribute("data-size")).toBe("lg");
    expect(child.style.gridColumn).toBe("span 3");
    expect(child.style.getPropertyValue("--_descriptions-item-rowspan")).toBe("2");
    expect(child.style.getPropertyValue("--_descriptions-item-label-width")).toBe("100px");
    expect(child.shadowRoot!.querySelector(".label")?.classList).toContain("accent-label");
    expect(child.textContent).toContain("ElfUI");

    await resize(480);
    expect(child.style.gridColumn).toBe("span 1");

    child.remove();
    await tick();
    expect(child.hasAttribute("data-border")).toBe(false);
    expect(child.hasAttribute("data-direction")).toBe(false);
    expect(child.hasAttribute("data-size")).toBe(false);
    expect(child.style.gridColumn).toBe("");
  });

  it("keeps data and declarative horizontal label tracks aligned", () => {
    const parentCss = readFileSync("src/components/Data/Descriptions/style.scss", "utf8");
    const itemCss = readFileSync("src/components/Data/DescriptionsItem/style.scss", "utf8");
    expect(parentCss).toContain("grid-template-columns: 88px minmax(0, 1fr)");
    expect(itemCss).toContain(
      "grid-template-columns: var(--_descriptions-item-label-width, 88px) minmax(0, 1fr)"
    );
    expect(parentCss).toContain("overflow-wrap: anywhere");
  });
});
