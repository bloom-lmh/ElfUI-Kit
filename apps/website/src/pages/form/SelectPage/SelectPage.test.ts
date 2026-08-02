import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let virtualExampleTag = "";
let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSelectEx5 } = await import("./ex5");
  const { PageSelectEx6 } = await import("./ex6");
  const { PageSelect } = await import("./index");
  exampleTag = ensureCustomElement(PageSelectEx5);
  virtualExampleTag = ensureCustomElement(PageSelectEx6);
  pageTag = ensureCustomElement(PageSelect);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const deepQuery = <T extends Element>(root: ParentNode, selector: string): T | null => {
  const direct = root.querySelector<T>(selector);
  if (direct) return direct;
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (element.shadowRoot) {
      const nested = deepQuery<T>(element.shadowRoot, selector);
      if (nested) return nested;
    }
  }
  return null;
};

describe("SelectPage", () => {
  it("远程案例提供完整脚本，并真实呈现加载失败状态", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const playground = deepQuery<HTMLElement & { script?: string }>(
      page.shadowRoot!,
      "elf-playground",
    );
    const select = deepQuery<HTMLElement>(page.shadowRoot!, "elf-select");
    expect(playground?.script).toContain("requestVersion");
    expect(playground?.script).toContain("remoteLoading");
    expect(select?.textContent).toContain("输入 error 模拟失败");

    (select?.shadowRoot?.querySelector(".trigger") as HTMLElement).click();
    await wait();
    const input = select?.shadowRoot?.querySelector<HTMLInputElement>(".filter-input");
    expect(input).toBeTruthy();

    input!.value = "error";
    input!.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await wait(800);

    expect(select?.textContent).toContain("服务暂时不可用");
    expect(select?.shadowRoot?.querySelector('slot[name="empty"]')).toBeTruthy();
  });

  it("大数据案例只渲染虚拟窗口", async () => {
    const page = document.createElement(virtualExampleTag);
    document.body.appendChild(page);
    await wait();

    const select = deepQuery<HTMLElement>(page.shadowRoot!, "elf-select")!;
    (select.shadowRoot?.querySelector(".trigger") as HTMLElement).click();
    await wait();

    expect(select.hasAttribute("data-virtualized")).toBe(true);
    expect(select.shadowRoot?.querySelectorAll(".option").length).toBeLessThan(20);
    expect(select.shadowRoot?.querySelector<HTMLElement>(".options-track")?.style.height).toBe(
      "400000px",
    );
  });

  it("英文模式覆盖页面、案例目录、运行数据和 API", async () => {
    const provider = document.createElement("elf-locale-provider") as HTMLElement & {
      name?: string;
    };
    provider.name = "en-US";
    provider.innerHTML = `<${pageTag}></${pageTag}>`;
    document.body.appendChild(provider);
    await wait(40);

    const page = provider.querySelector<HTMLElement>(pageTag)!;
    expect(page.shadowRoot?.textContent).toContain("large-data virtualization");

    const components = Array.from(page.shadowRoot?.querySelectorAll<HTMLElement>("*") ?? []).filter(
      (element) => element.shadowRoot,
    );
    const playgrounds = components.flatMap((component) =>
      Array.from(component.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground") ?? []),
    );
    expect(playgrounds.map((playground) => playground.getAttribute("title"))).toEqual([
      "Basic selection",
      "Clear and disabled",
      "Multiple and collapsed tags",
      "Search and field mapping",
      "Remote states",
      "Virtualized options",
    ]);

    const virtualExample = components.find((component) =>
      component.shadowRoot?.querySelector('elf-playground[title="Virtualized options"]'),
    )!;
    expect(virtualExample.shadowRoot?.textContent).toContain("10,000 items");
    expect(virtualExample.shadowRoot?.textContent).toContain("Selected ID 2048");

    const props = components.find((component) =>
      component.shadowRoot?.querySelector("elf-props-table"),
    )!;
    const propsTable = props.shadowRoot?.querySelector<
      HTMLElement & { rows?: Array<{ desc?: string }> }
    >("elf-props-table");
    expect(
      propsTable?.rows?.some(
        (row) => row.desc === "Enable virtualization and its minimum item count.",
      ),
    ).toBe(true);
  });
});
