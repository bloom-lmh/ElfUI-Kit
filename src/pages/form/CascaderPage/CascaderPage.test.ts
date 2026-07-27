import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageCascaderEx8 } = await import("./ex8");
  exampleTag = ensureCustomElement(PageCascaderEx8);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("CascaderPage", () => {
  it("异步案例加载真实子节点并保留完整脚本", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const playground = page.shadowRoot!.querySelector<HTMLElement & { script?: string }>("elf-playground")!;
    expect(playground.script).toContain("lazyLoad");
    const cascader = page.shadowRoot!.querySelector<HTMLElement>("elf-cascader")!;
    cascader.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    await wait();
    cascader.shadowRoot!.querySelector<HTMLButtonElement>(".option")!.click();
    expect(cascader.shadowRoot!.textContent).toContain("…");
    await wait(760);

    expect(cascader.shadowRoot!.textContent).toContain("华东交付组");
    expect(page.shadowRoot!.textContent).toContain("子级已加载，可继续选择");
  });

  it("深层路径案例自动使用带联动复选框的树状面板", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const playgrounds = page.shadowRoot!.querySelectorAll<HTMLElement & { code?: string }>("elf-playground");
    expect(playgrounds[1]!.code).toContain("tree-threshold=\"3\"");
    expect(playgrounds[1]!.code).toContain(":checkable=\"checkable\"");
    const cascaders = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-cascader");
    const cascader = cascaders[1]!;
    cascader.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    await wait();

    expect(cascader.shadowRoot!.querySelector(".tree-panel")).toBeTruthy();
    const root = cascader.shadowRoot!.querySelector<HTMLButtonElement>('.tree-option[aria-level="1"]')!;
    expect(root.querySelector(".option-checkbox")).toBeTruthy();
    root.click();
    await wait();

    expect(root.querySelector(".option-checkbox.is-checked")).toBeTruthy();
    expect(page.shadowRoot!.textContent).toContain("已选择 2 条路径");
  });
});
