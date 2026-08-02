import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-space", () => {
  it("提供 Element Plus 兼容的默认方向、对齐与间距", async () => {
    const el = document.createElement("elf-space");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("direction")).toBe("horizontal");
    expect(el.getAttribute("alignment")).toBe("center");
    expect(el.style.getPropertyValue("--_direction")).toBe("row");
    expect(el.style.getPropertyValue("--_gap")).toBe("8px");
  });

  it("支持垂直方向、预设/数值/元组间距和换行", async () => {
    const el = document.createElement("elf-space") as HTMLElement & {
      direction: string;
      size: string | number | [number, number];
      wrap: boolean;
    };
    document.body.appendChild(el);
    el.direction = "vertical";
    el.size = "large";
    el.wrap = true;
    await tick();

    expect(el.style.getPropertyValue("--_direction")).toBe("column");
    expect(el.style.getPropertyValue("--_gap")).toBe("16px");
    expect(el.hasAttribute("wrap")).toBe(true);

    el.size = 20;
    await tick();
    expect(el.style.getPropertyValue("--_gap")).toBe("20px");

    el.size = [20, 8];
    await tick();
    expect(el.style.getPropertyValue("--_gap")).toBe("8px 20px");
  });

  it("安全限制 fill-ratio 并反射字符分隔符", async () => {
    const el = document.createElement("elf-space") as HTMLElement & {
      fill: boolean;
      fillRatio: number;
      spacer: string;
    };
    document.body.appendChild(el);
    el.fill = true;
    el.fillRatio = 120;
    el.spacer = "|";
    await tick();

    expect(el.hasAttribute("fill")).toBe(true);
    expect(el.style.getPropertyValue("--_fill-ratio")).toBe("100%");
    expect(el.hasAttribute("has-spacer")).toBe(true);
    expect(el.style.getPropertyValue("--_spacer-content")).toBe('"|"');
  });
});
