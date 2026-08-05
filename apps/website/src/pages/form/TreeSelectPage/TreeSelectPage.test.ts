import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
let virtualExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTreeSelect } = await import("./index");
  const { PageTreeSelectEx4 } = await import("./ex4");
  pageTag = ensureCustomElement(PageTreeSelect);
  virtualExampleTag = ensureCustomElement(PageTreeSelectEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 30): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const deepQuery = <T extends Element>(root: ParentNode, selector: string): T | null => {
  const direct = root.querySelector<T>(selector);
  if (direct) return direct;
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (!element.shadowRoot) continue;
    const nested = deepQuery<T>(element.shadowRoot, selector);
    if (nested) return nested;
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

describe("TreeSelectPage", () => {
  it("provides complete Template and Script sections for every capability", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await wait(50);

    const playgrounds = Array.from(page.shadowRoot!.querySelectorAll<HTMLElement>("*"))
      .filter((element) => element.shadowRoot)
      .flatMap((element) =>
        Array.from(
          element.shadowRoot!.querySelectorAll<HTMLElement & { code?: string; script?: string }>(
            "elf-playground",
          ),
        ),
      );
    expect(playgrounds).toHaveLength(5);
    expect(
      playgrounds.every((playground) => Boolean(playground.code?.includes("elf-tree-select"))),
    ).toBe(true);
    expect(playgrounds.every((playground) => Boolean(playground.script?.trim()))).toBe(true);
    expect(playgrounds[3]?.script).toContain("10_000");
    expect(playgrounds[4]?.script).toContain("fieldNames");
  });

  it("renders only a virtual Tree window for the 10,000-node example", async () => {
    const example = document.createElement(virtualExampleTag);
    document.body.appendChild(example);
    await wait(40);
    const selects = Array.from(
      example.shadowRoot!.querySelectorAll<HTMLElement>("elf-tree-select"),
    );
    const virtualSelect = selects[1]! as HTMLElement & { open(): void };
    virtualSelect.open();
    await wait(40);
    const tree = virtualSelect.shadowRoot!.querySelector<HTMLElement>("elf-tree")!;

    expect(tree.shadowRoot!.querySelectorAll(".tree-node").length).toBeLessThan(30);
    expect(
      (tree.shadowRoot!.querySelector(".tree-window") as HTMLElement).style.paddingBottom,
    ).not.toBe("0px");
  });

  it("keeps page copy, playground titles, runtime labels, and API descriptions bilingual", async () => {
    const provider = document.createElement("elf-locale-provider") as HTMLElement & {
      name?: string;
    };
    provider.name = "en-US";
    provider.innerHTML = `<${pageTag}></${pageTag}>`;
    document.body.appendChild(provider);
    await wait(60);

    const page = provider.querySelector<HTMLElement>(pageTag)!;
    expect(collectText(page)).toContain("large-data virtualization");
    const components = Array.from(page.shadowRoot?.querySelectorAll<HTMLElement>("*") ?? []).filter(
      (element) => element.shadowRoot,
    );
    const playgrounds = components.flatMap((component) =>
      Array.from(component.shadowRoot!.querySelectorAll<HTMLElement>("elf-playground")),
    );
    expect(playgrounds.map((playground) => playground.getAttribute("title"))).toEqual([
      "TreeSelect basic selection",
      "Multiple selection and check strategies",
      "Search and custom matching",
      "Lazy loading and virtual tree",
      "Form and field mapping",
    ]);
    expect(deepQuery(page.shadowRoot!, "elf-tree-select")?.textContent).not.toContain("选择团队");
    const api = components.find((component) =>
      component.shadowRoot?.querySelector("elf-props-table"),
    )!;
    const table = api.shadowRoot?.querySelector<HTMLElement & { rows?: Array<{ desc?: string }> }>(
      "elf-props-table",
    );
    expect(
      table?.rows?.some((row) => row.desc === "Reuse Tree's virtual window for large data."),
    ).toBe(true);
  });
});
