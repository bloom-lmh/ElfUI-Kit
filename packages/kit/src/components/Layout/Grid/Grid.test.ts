// elf-grid + elf-grid-item 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-grid", () => {
  it("columns 反映到 css var", async () => {
    const el = document.createElement("elf-grid");
    el.setAttribute("columns", "8");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_cols")).toBe("8");
  });

  it("columns 默认 12", async () => {
    const el = document.createElement("elf-grid");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_cols")).toBe("12");
  });

  it("gutter alias 支持数值并优先于 gap", async () => {
    const el = document.createElement("elf-grid") as HTMLElement & { gutter: number };
    el.setAttribute("gap", "md");
    document.body.appendChild(el);
    el.gutter = 18;
    await tick();
    expect(el.style.getPropertyValue("--_gap")).toBe("18px");
  });

  it("动态同步 justify、align 与 auto-fit", async () => {
    const el = document.createElement("elf-grid") as HTMLElement & {
      justify: string;
      align: string;
      autoFit: boolean;
      minColumnWidth: string;
    };
    document.body.appendChild(el);
    el.justify = "center";
    el.align = "end";
    el.autoFit = true;
    el.minColumnWidth = "16rem";
    await tick();
    expect(el.getAttribute("justify")).toBe("center");
    expect(el.getAttribute("align")).toBe("end");
    expect(el.hasAttribute("auto-fit")).toBe(true);
    expect(el.style.getPropertyValue("--_min-col")).toBe("16rem");
  });
});
