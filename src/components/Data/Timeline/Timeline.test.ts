import { ensureCustomElement } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Timeline } from "./index";

beforeAll(() => {
  ensureCustomElement(Timeline);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const items = [
  { timestamp: "2024-01-01", title: "需求分析", content: "确认范围" },
  { timestamp: "2024-02-01", title: "界面设计", content: "完成设计稿" },
  { timestamp: "2024-03-01", title: "发布上线", content: "完成交付" },
];

describe("elf-timeline", () => {
  it("renders every item with its timestamp and title", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = items;
    document.body.appendChild(el);
    await tick();

    const rendered = el.shadowRoot!.querySelectorAll(".item");
    expect(rendered).toHaveLength(3);
    expect(rendered[0].textContent).toContain("2024-01-01");
    expect(rendered[0].textContent).toContain("需求分析");
  });

  it("reverses item order", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = items;
    el.setAttribute("reverse", "");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".item:first-child")?.textContent).toContain("2024-03-01");
  });

  it("maps semantic and custom node colors", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = [
      { title: "Ready", color: "success" },
      { title: "Custom", color: "#7c3aed" },
    ];
    document.body.appendChild(el);
    await tick();

    const nodes = el.shadowRoot!.querySelectorAll<HTMLElement>(".node");
    expect(nodes[0].classList.contains("is-success")).toBe(true);
    expect(nodes[1].style.getPropertyValue("--_node-bg")).toBe("#7c3aed");
  });

  it("supports placement, size, hollow nodes, and hidden timestamps", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = [
      { timestamp: "2026-07-13", title: "Top", placement: "top", type: "success", size: "large" },
      { timestamp: "2026-07-14", title: "Hidden", hideTimestamp: true, hollow: true },
    ];
    document.body.appendChild(el);
    await tick();

    const nodes = el.shadowRoot!.querySelectorAll(".node");
    expect(nodes[0].classList.contains("is-success")).toBe(true);
    expect(nodes[0].classList.contains("is-large")).toBe(true);
    expect(nodes[1].classList.contains("is-hollow")).toBe(true);
    expect(el.shadowRoot!.textContent).not.toContain("2026-07-14");
  });

  it("reflects alternate layout modes and preserves the legacy dot slot", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = items;
    el.setAttribute("mode", "alternate-reverse");
    el.innerHTML = '<span slot="dot">●</span>';
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("data-mode")).toBe("alternate-reverse");
    const dot = el.shadowRoot!.querySelector('slot[name="dot"]') as HTMLSlotElement;
    expect(dot.assignedNodes()[0]?.textContent).toBe("●");
  });

  it("provides item-specific content and dot slots with body style hooks", async () => {
    const el = document.createElement("elf-timeline");
    (el as any).items = [
      {
        timestamp: "2026-07-21",
        title: "Fallback title",
        cardClass: "release-card",
        cardStyle: { "--release-accent": "#2563eb" },
      },
    ];
    el.innerHTML = `
      <article slot="item-0">Custom release card</article>
      <svg slot="dot-0" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10" /></svg>
    `;
    document.body.appendChild(el);
    await tick();

    const body = el.shadowRoot!.querySelector<HTMLElement>(".body-right")!;
    const itemSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="item-0"]')!;
    const dotSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="dot-0"]')!;
    expect(body.classList.contains("release-card")).toBe(true);
    expect(body.style.getPropertyValue("--release-accent")).toBe("#2563eb");
    expect(itemSlot.assignedElements()[0]?.textContent).toContain("Custom release card");
    expect(dotSlot.assignedElements()[0]?.tagName).toBe("svg");
  });
});
