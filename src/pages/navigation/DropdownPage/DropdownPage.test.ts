import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageDropdown } = await import("./index");
  pageTag = ensureCustomElement(PageDropdown);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 40): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const shadowChildren = (root: ParentNode): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>("*")).filter(
    (element) => element.shadowRoot,
  );

describe("DropdownPage", () => {
  it("renders complete English examples, runtime data, source, and API copy", async () => {
    const provider = document.createElement("elf-locale-provider") as HTMLElement & {
      name?: string;
    };
    provider.name = "en-US";
    provider.innerHTML = `<${pageTag}></${pageTag}>`;
    document.body.appendChild(provider);
    await wait();

    const page = provider.querySelector<HTMLElement>(pageTag)!;
    const pageText = page.shadowRoot?.textContent ?? "";
    expect(pageText).toContain("lightweight commands");

    const examples = shadowChildren(page.shadowRoot!).filter((component) =>
      component.shadowRoot?.querySelector("elf-playground"),
    );
    const playgrounds = examples.flatMap((component) =>
      Array.from(
        component.shadowRoot?.querySelectorAll<
          HTMLElement & { code?: string; script?: string }
        >("elf-playground") ?? [],
      ),
    );

    expect(playgrounds.map((playground) => playground.getAttribute("title"))).toEqual([
      "Basic command menu",
      "Nested menu, disabled item, and persistent state",
      "Trigger modes and placement",
      "Compatibility options",
      "Compositional menu and selected state",
      "Virtual trigger",
      "Top layer / offset / flip / preventOverflow",
    ]);

    for (const playground of playgrounds) {
      expect(playground.code ?? "").not.toMatch(/\p{Script=Han}/u);
      expect(playground.script ?? "").not.toMatch(/\p{Script=Han}/u);
    }

    const basicExample = examples.find((component) =>
      component.shadowRoot?.querySelector(
        'elf-playground[title="Basic command menu"]',
      ),
    )!;
    const dropdown = basicExample.shadowRoot?.querySelector<HTMLElement>("elf-dropdown");
    expect(dropdown?.getAttribute("label")).toBe("More actions");
    expect(dropdown?.shadowRoot?.textContent).toContain("Edit profile");

    const propsTable = Array.from(
      page.shadowRoot?.querySelectorAll<HTMLElement & {
        rows?: Array<{ desc?: string }>;
      }>("elf-props-table") ?? [],
    ).find((table) => table.getAttribute("title") === "Dropdown Props");
    expect(
      propsTable?.rows?.some(
        (row) => row.desc === "One or more trigger modes.",
      ),
    ).toBe(true);

    const nestedText = examples
      .map((component) => component.shadowRoot?.textContent ?? "")
      .join(" ");
    expect(`${pageText} ${nestedText}`).not.toMatch(/\p{Script=Han}/u);
  });
});
