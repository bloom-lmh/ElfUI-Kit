import { afterEach, beforeAll, describe, expect, it } from "vitest";

let nestedTag = "";
let columnsTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageLayoutShellEx3 } = await import("./ex3");
  const { PageLayoutShellEx4 } = await import("./ex4");
  nestedTag = ensureCustomElement(PageLayoutShellEx3);
  columnsTag = ensureCustomElement(PageLayoutShellEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("LayoutShellPage examples", () => {
  it("渲染嵌套双导航和右侧详情栏", async () => {
    const page = document.createElement(nestedTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot!.querySelectorAll("elf-playground")).toHaveLength(2);
    expect(page.shadowRoot!.querySelectorAll(".layout-shell")).toHaveLength(2);
    const titles = Array.from(page.shadowRoot!.querySelectorAll("elf-playground"), (item) => item.getAttribute("title"));
    expect(titles).toEqual(["嵌套双导航", "右侧详情栏"]);
  });

  it("将三栏和多栏结构保留为两个不重复案例", async () => {
    const page = document.createElement(columnsTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot!.querySelectorAll("elf-playground")).toHaveLength(2);
    expect(page.shadowRoot!.querySelectorAll(".layout-shell")).toHaveLength(2);
    const titles = Array.from(page.shadowRoot!.querySelectorAll("elf-playground"), (item) => item.getAttribute("title"));
    expect(titles).toEqual(["三栏工作台", "多栏协作区"]);
  });
});
