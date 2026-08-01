import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { PropsTable } from "./index";

beforeAll(() => {
  registerComponents(PropsTable);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface PropsTableElement extends HTMLElement {
  rows?: unknown[];
  emptyText?: string;
}

const mount = async (setup?: (element: PropsTableElement) => void): Promise<PropsTableElement> => {
  const element = document.createElement("elf-props-table") as PropsTableElement;
  setup?.(element);
  document.body.appendChild(element);
  await tick();
  await tick();
  await tick();
  return element;
};

const dataTable = (element: PropsTableElement): HTMLElement => {
  const table = Array.from(element.shadowRoot?.children ?? []).find(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && Boolean(child.shadowRoot?.querySelector(".table-root")),
  );
  if (!table?.shadowRoot) throw new Error("PropsTable data table was not rendered");
  return table;
};

describe("elf-props-table", () => {
  it("promotes an adjacent API heading into the aligned table column", async () => {
    const heading = document.createElement("h2");
    heading.textContent = "API";
    document.body.appendChild(heading);
    const element = await mount();

    expect(heading.hidden).toBe(true);
    expect(heading.hasAttribute("data-promoted-to-props-table")).toBe(true);
    expect(element.shadowRoot!.querySelector(".section-title")?.textContent).toBe("API");

    element.remove();
    await tick();
    expect(heading.hidden).toBe(false);
  });

  it("uses the ElfUI Table title surface", async () => {
    const element = await mount();
    const table = dataTable(element);

    expect(table.shadowRoot!.querySelector(".table-title")?.textContent).toBe("Props");
    expect(table.shadowRoot!.querySelector(".table-root")?.classList.contains("title-muted")).toBe(
      true,
    );
    expect(table.shadowRoot!.querySelector(".table-root")?.classList.contains("is-small")).toBe(
      false,
    );
  });

  it("renders API rows through ElfUI Table", async () => {
    const element = await mount((target) => {
      target.rows = [{ name: "size", type: "string", default: "md", desc: "尺寸" }];
    });

    const cells = Array.from(
      dataTable(element).shadowRoot!.querySelectorAll("tbody tr:not(.empty-row) td"),
      (cell) => cell.textContent?.trim(),
    );
    expect(cells).toEqual(["size", "string", "md", "尺寸"]);
  });

  it("preserves zero and false defaults", async () => {
    const element = await mount((target) => {
      target.rows = [
        { name: "count", type: "number", default: 0 },
        { name: "disabled", type: "boolean", default: false },
      ];
    });

    const defaults = Array.from(
      dataTable(element).shadowRoot!.querySelectorAll("tbody tr:not(.empty-row) td:nth-child(3)"),
      (cell) => cell.textContent?.trim(),
    );
    expect(defaults).toEqual(["0", "false"]);
  });

  it("renders default and custom empty text", async () => {
    const element = await mount();
    const table = dataTable(element);
    expect(table.shadowRoot!.querySelector(".empty")?.textContent).toContain("暂无数据");

    element.emptyText = "尚未定义";
    await tick();
    await tick();
    expect(table.shadowRoot!.querySelector(".empty")?.textContent).toContain("尚未定义");
  });

  it("forwards the empty slot", async () => {
    const element = document.createElement("elf-props-table") as PropsTableElement;
    const empty = document.createElement("span");
    empty.slot = "empty";
    empty.textContent = "自定义空状态";
    element.appendChild(empty);
    document.body.appendChild(element);
    await tick();
    await tick();

    const slot = element.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="empty"]');
    expect(slot?.assignedElements()).toEqual([empty]);
  });

  it("keeps the table name and stable parts", async () => {
    const element = await mount((target) => target.setAttribute("title", "Events"));
    const shadow = dataTable(element).shadowRoot!;

    expect(shadow.querySelector("table")?.getAttribute("aria-label")).toBe("Events");
    expect(shadow.querySelector('[part="table"]')).toBeTruthy();
    expect(shadow.querySelector('[part="header"]')).toBeTruthy();
    expect(shadow.querySelector('[part="title"]')?.textContent).toBe("Events");
  });
});
