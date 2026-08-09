import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageCascaderEx8 } = await import("./ex8");
  const { PageCascader } = await import("./index");
  exampleTag = ensureCustomElement(PageCascaderEx8);
  pageTag = ensureCustomElement(PageCascader);
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

const collectText = (root: Node): string => {
  let output = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) output += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return output.replace(/\s+/g, " ").trim();
};

describe("CascaderPage", () => {
  it("异步案例加载真实子节点并保留完整脚本", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const playground = page.shadowRoot!.querySelector<HTMLElement & { script?: string }>(
      "elf-playground",
    )!;
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

    const playgrounds = page.shadowRoot!.querySelectorAll<HTMLElement & { code?: string }>(
      "elf-playground",
    );
    expect(playgrounds[1]!.code).toContain('tree-threshold="3"');
    expect(playgrounds[1]!.code).toContain(':checkable="checkable"');
    const cascaders = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-cascader");
    const cascader = cascaders[1]!;
    cascader.shadowRoot!.querySelector<HTMLElement>(".trigger")!.click();
    await wait();

    expect(cascader.shadowRoot!.querySelector(".tree-panel")).toBeTruthy();
    const root = cascader.shadowRoot!.querySelector<HTMLButtonElement>(
      '.tree-option[aria-level="1"]',
    )!;
    expect(root.querySelector(".option-checkbox")).toBeTruthy();
    root.querySelector<HTMLElement>(".option-checkbox")!.click();
    await wait();

    expect(
      cascader.shadowRoot!.querySelector(
        '.tree-option[aria-level="1"] .option-checkbox.is-checked',
      ),
    ).toBeTruthy();
    expect(page.shadowRoot!.textContent).toContain("已选择 2 条路径");
  });

  it("英文模式覆盖页面、九个案例、运行数据和 API", async () => {
    const provider = document.createElement("elf-locale-provider") as HTMLElement & {
      name?: string;
    };
    provider.name = "en-US";
    provider.innerHTML = `<${pageTag}></${pageTag}>`;
    document.body.appendChild(provider);
    await wait(60);

    const page = provider.querySelector<HTMLElement>(pageTag)!;
    expect(collectText(page)).toContain("compact deep-path trees");
    const components = Array.from(page.shadowRoot?.querySelectorAll<HTMLElement>("*") ?? []).filter(
      (element) => element.shadowRoot,
    );
    const playgrounds = components.flatMap((component) =>
      Array.from(component.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground") ?? []),
    );
    expect(playgrounds.map((playground) => playground.getAttribute("title"))).toEqual([
      "Cascader basic selection",
      "Cascader clearable and disabled",
      "Cascader multiple selection",
      "Linked checkboxes",
      "Standalone panel",
      "Path search",
      "Tags and viewport overlay",
      "Lazy loading",
      "Automatic deep-path tree",
    ]);

    const deepExample = components.find((component) =>
      component.shadowRoot?.querySelector('elf-playground[title="Automatic deep-path tree"]'),
    )!;
    expect(deepExample.shadowRoot?.textContent).toContain("Tree checkboxes are on");
    const formItem = deepQuery<HTMLElement & { label?: string }>(
      deepExample.shadowRoot!,
      "elf-form-item",
    );
    expect(formItem?.label).toBe("Release catalog");

    const api = components.find((component) =>
      component.shadowRoot?.querySelector("elf-props-table"),
    )!;
    const propsTable = api.shadowRoot?.querySelector<
      HTMLElement & { rows?: Array<{ desc?: string }> }
    >("elf-props-table");
    expect(
      propsTable?.rows?.some(
        (row) => row.desc === "Automatically use a compact tree for deep paths",
      ),
    ).toBe(true);
  });
});
