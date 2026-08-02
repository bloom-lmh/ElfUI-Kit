// elf-container 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-container", () => {
  it("使用稳定的默认限宽和内边距", async () => {
    const el = document.createElement("elf-container");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("max-width")).toBe("lg");
    expect(el.getAttribute("padding")).toBe("md");
    expect(el.hasAttribute("fluid")).toBe(false);
  });

  it("渲染 slot 内容", async () => {
    const el = document.createElement("elf-container");
    el.innerHTML = "<p>子内容</p>";
    document.body.appendChild(el);
    await tick();
    expect(el.querySelector("p")?.textContent).toBe("子内容");
  });

  it("max-width 属性反射", async () => {
    const el = document.createElement("elf-container");
    el.setAttribute("max-width", "md");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("max-width")).toBe("md");
  });

  it("padding 属性反射", async () => {
    const el = document.createElement("elf-container");
    el.setAttribute("padding", "lg");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("padding")).toBe("lg");
  });

  it("支持 xl、full 与 fluid 宽度模式的动态同步", async () => {
    const el = document.createElement("elf-container") as HTMLElement & {
      maxWidth: string;
      fluid: boolean;
    };
    document.body.appendChild(el);
    el.maxWidth = "xl";
    el.fluid = true;
    await tick();
    expect(el.getAttribute("max-width")).toBe("xl");
    expect(el.hasAttribute("fluid")).toBe(true);

    el.maxWidth = "full";
    el.fluid = false;
    await tick();
    expect(el.getAttribute("max-width")).toBe("full");
    expect(el.hasAttribute("fluid")).toBe(false);
  });
});
