// elf-flex 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-flex", () => {
  it("默认 shadowRoot 内只有 slot", async () => {
    const el = document.createElement("elf-flex");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });

  it("属性反射到 host", async () => {
    const el = document.createElement("elf-flex");
    el.setAttribute("direction", "column");
    el.setAttribute("gap", "md");
    el.setAttribute("justify", "center");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("direction")).toBe("column");
    expect(el.getAttribute("gap")).toBe("md");
    expect(el.getAttribute("justify")).toBe("center");
  });

  it("样式注入到 shadowRoot", async () => {
    const el = document.createElement("elf-flex");
    document.body.appendChild(el);
    await tick();
    // jsdom 对 adoptedStyleSheets 支持有限；走 <style> fallback
    const sheets = el.shadowRoot!.adoptedStyleSheets;
    const adopted = (sheets && sheets.length) || 0;
    const styleTags = el.shadowRoot!.querySelectorAll("style").length;
    expect(adopted + styleTags).toBeGreaterThan(0);
  });

  it("property 更新会同步方向、对齐和布尔宿主状态", async () => {
    const el = document.createElement("elf-flex") as HTMLElement & {
      direction: string;
      justify: string;
      wrap: boolean | string;
      inline: boolean;
    };
    document.body.appendChild(el);
    el.direction = "column-reverse";
    el.justify = "space-evenly";
    el.wrap = true;
    el.inline = true;
    await tick();

    expect(el.getAttribute("direction")).toBe("column-reverse");
    expect(el.getAttribute("justify")).toBe("space-evenly");
    expect(el.style.getPropertyValue("--_justify")).toBe("space-evenly");
    expect(el.getAttribute("wrap")).toBe("wrap");
    expect(el.hasAttribute("inline")).toBe(true);
  });

  it("将 space-between 与 space-around 直接同步为主轴 CSS 变量", async () => {
    const el = document.createElement("elf-flex") as HTMLElement & { justify: string };
    document.body.appendChild(el);

    el.justify = "space-between";
    await tick();
    expect(el.style.getPropertyValue("--_justify")).toBe("space-between");

    el.justify = "space-around";
    await tick();
    expect(el.style.getPropertyValue("--_justify")).toBe("space-around");
  });

  it("支持 align-content 与完整换行策略", async () => {
    const el = document.createElement("elf-flex") as HTMLElement & {
      alignContent: string;
      wrap: boolean | string;
    };
    document.body.appendChild(el);

    el.alignContent = "space-between";
    el.wrap = "wrap-reverse";
    await tick();
    expect(el.getAttribute("align-content")).toBe("space-between");
    expect(el.getAttribute("wrap")).toBe("wrap-reverse");
    expect(el.style.getPropertyValue("--_align-content")).toBe("space-between");
    expect(el.style.getPropertyValue("--_wrap")).toBe("wrap-reverse");

    el.wrap = false;
    await tick();
    expect(el.getAttribute("wrap")).toBe("nowrap");
    expect(el.style.getPropertyValue("--_wrap")).toBe("nowrap");

    el.alignContent = "space-around";
    await tick();
    expect(el.style.getPropertyValue("--_align-content")).toBe("space-around");

    el.alignContent = "space-evenly";
    await tick();
    expect(el.style.getPropertyValue("--_align-content")).toBe("space-evenly");
  });

  it("将裸 wrap 属性按布尔 true 归一为换行", async () => {
    const el = document.createElement("elf-flex");
    el.setAttribute("wrap", "");
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.getAttribute("wrap")).toBe("wrap");
    expect(el.style.getPropertyValue("--_wrap")).toBe("wrap");
  });

  it("alignment alias 优先于 align", async () => {
    const el = document.createElement("elf-flex") as HTMLElement & { alignment: string };
    el.setAttribute("align", "stretch");
    document.body.appendChild(el);
    el.alignment = "center";
    await tick();
    expect(el.getAttribute("align")).toBe("center");
  });

  it("支持预设、数值和水平/垂直元组间距", async () => {
    const el = document.createElement("elf-flex") as HTMLElement & {
      gap: string | number;
      size: string | number | [number, number];
    };
    document.body.appendChild(el);
    el.gap = "md";
    await tick();
    expect(el.style.getPropertyValue("--_gap")).toBe("var(--elf-space-4)");

    el.size = 12;
    await tick();
    expect(el.style.getPropertyValue("--_gap")).toBe("12px");

    el.setAttribute("size", "18");
    await tick();
    expect(el.style.getPropertyValue("--_gap")).toBe("18px");

    el.size = [16, 8];
    await tick();
    expect(el.style.getPropertyValue("--_gap")).toBe("8px 16px");
  });

  it("fill ratio 反射为安全范围内的 CSS 变量", async () => {
    const el = document.createElement("elf-flex") as HTMLElement & { fill: boolean; fillRatio: number };
    document.body.appendChild(el);
    el.fill = true;
    el.fillRatio = 40;
    await tick();
    expect(el.hasAttribute("fill")).toBe(true);
    expect(el.style.getPropertyValue("--_fill-ratio")).toBe("40%");

    el.fillRatio = 180;
    await tick();
    expect(el.style.getPropertyValue("--_fill-ratio")).toBe("100%");
  });
});
