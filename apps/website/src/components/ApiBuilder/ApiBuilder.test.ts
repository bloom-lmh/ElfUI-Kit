import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { PropsTable } from "../PropsTable";
import { ApiBuilder } from "./index";

beforeAll(() => {
  registerComponents(ApiBuilder, PropsTable);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  for (let i = 0; i < 5; i += 1) await new Promise<void>((resolve) => queueMicrotask(resolve));
};

const cardRows = () => ({
  props: [
    {
      name: "variant",
      type: "elevated | outlined | filled | tonal | flat",
      default: "elevated",
      desc: "视觉层级",
    },
    { name: "title", type: "string", default: "''", desc: "标题" },
    { name: "disabled", type: "boolean", default: "false", desc: "禁用" },
  ],
  events: [{ name: "click", desc: "点击" }],
  slots: [
    { name: "default", desc: "内容" },
    { name: "footer", desc: "底部" },
  ],
});

const mountBuilder = async (): Promise<HTMLElement> => {
  const builder = document.createElement("elf-api-builder");
  builder.setAttribute("component", "elf-card");
  const rows = cardRows();
  for (const role of ["props", "events", "slots"] as const) {
    const table = document.createElement("elf-props-table");
    table.setAttribute("role", role);
    (table as unknown as { rows: unknown[] }).rows = rows[role];
    builder.appendChild(table);
  }
  document.body.appendChild(builder);
  await tick();
  await tick();
  return builder;
};

/** 从 document 递归穿透所有 shadow，收集 Table 内置 selection 按钮（.table-checkbox）。 */
const selectionCheckboxes = (): HTMLButtonElement[] => {
  const out: HTMLButtonElement[] = [];
  const walk = (root: ParentNode): void => {
    for (const el of Array.from(root.querySelectorAll("tbody .table-checkbox"))) {
      out.push(el as HTMLButtonElement);
    }
    for (const el of Array.from(root.querySelectorAll("*"))) {
      if (el.shadowRoot) walk(el.shadowRoot);
    }
  };
  walk(document);
  return out;
};

/** 点击指定 row 所在行的 selection 按钮（row 是 API 行名，如 variant）。 */
const selectRow = async (name: string): Promise<void> => {
  // 找到包含该行名的表格行，取行内 selection 按钮
  const walk = (root: ParentNode): HTMLButtonElement | null => {
    for (const tr of Array.from(root.querySelectorAll("tbody tr"))) {
      if (tr.textContent?.includes(name)) {
        const btn = tr.querySelector<HTMLButtonElement>(".table-checkbox");
        if (btn) return btn;
      }
    }
    for (const el of Array.from(root.querySelectorAll("*"))) {
      if (el.shadowRoot) {
        const r = walk(el.shadowRoot);
        if (r) return r;
      }
    }
    return null;
  };
  const btn = walk(document);
  if (!btn) throw new Error(`selection button for ${name} not found`);
  btn.click();
  await tick();
  await tick();
};

interface ApiBuilderElement extends HTMLElement {
  code(): string;
}

const codeText = (builder: HTMLElement): string => (builder as ApiBuilderElement).code?.() ?? "";

describe("elf-api-builder", () => {
  it("renders Table selection checkboxes for role tables", async () => {
    const builder = await mountBuilder();
    // 3 props + 1 event + 2 slots = 6 行，各有 selection checkbox
    expect(selectionCheckboxes().length).toBe(6);
    expect(codeText(builder)).toBe("");
  });

  it("selecting an attr emits its default value", async () => {
    const builder = await mountBuilder();
    await selectRow("variant");
    expect(codeText(builder)).toContain('<elf-card\nvariant="elevated"');
    expect(builder.shadowRoot!.querySelector(".api-builder-count")?.textContent).toContain("1");
  });

  it("boolean attrs emit as bare attributes", async () => {
    const builder = await mountBuilder();
    await selectRow("disabled");
    expect(codeText(builder)).toContain("<elf-card\ndisabled");
  });

  it("includes selected events and slots", async () => {
    const builder = await mountBuilder();
    await selectRow("click");
    await selectRow("footer");
    expect(codeText(builder)).toContain('@click="handleClick"\n>');
    expect(codeText(builder)).toContain('<span slot="footer">Footer</span>');
  });

  it("clears selections and empties the code", async () => {
    const builder = await mountBuilder();
    await selectRow("variant");
    expect(codeText(builder)).toContain("elf-card");

    builder.shadowRoot!.querySelector<HTMLButtonElement>(".api-builder-clear-btn")!.click();
    await tick();
    await tick();

    expect(codeText(builder)).toBe("");
    expect(builder.shadowRoot!.querySelector(".api-builder-count")?.textContent).toContain("0");
  });

  it("keeps plain tables unchanged outside the builder", async () => {
    const table = document.createElement("elf-props-table");
    (table as unknown as { rows: unknown[] }).rows = [
      { name: "size", type: "string", default: "md", desc: "尺寸" },
    ];
    document.body.appendChild(table);
    await tick();
    await tick();

    const dataTable = Array.from(table.shadowRoot?.children ?? []).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && Boolean(child.shadowRoot?.querySelector(".table-root")),
    )!;
    expect(dataTable.shadowRoot!.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
  });
});
