import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

interface PlaygroundElement extends HTMLElement {
  code?: string;
  script?: string;
  title?: string;
}

interface PropsTableElement extends HTMLElement {
  rows?: Array<{ name: string; desc?: string }>;
}

let pageTag = "";
const exampleTags: string[] = [];

beforeAll(async () => {
  document.documentElement.lang = "en-US";
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [pageModule, ...exampleModules] = await Promise.all([
    import("./index"),
    import("./ex1"),
    import("./ex2"),
    import("./ex3"),
    import("./ex4"),
    import("./ex5"),
    import("./ex6"),
    import("./ex7"),
    import("./ex8"),
    import("./ex9"),
  ]);

  pageTag = ensureCustomElement(pageModule.PageUpload);
  for (const [index, module] of exampleModules.entries()) {
    const component = module[`PageUploadEx${index + 1}` as keyof typeof module];
    exampleTags.push(ensureCustomElement(component));
  }
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
});

afterAll(() => {
  document.documentElement.lang = "zh-CN";
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

const mount = async (tag: string): Promise<HTMLElement> => {
  const element = document.createElement(tag);
  document.body.appendChild(element);
  await wait();
  await wait();
  return element;
};

describe("Upload documentation", () => {
  it("renders nine examples and localized public API tables", async () => {
    const page = await mount(pageTag);
    expect(deepQuery(page.shadowRoot!, "h1")?.textContent).toBe("Upload");
    expect(deepQuery(page.shadowRoot!, "p")?.textContent).toContain(
      "controlled lists, drag and drop",
    );
    expect(
      page.shadowRoot?.querySelectorAll(
        "elf-page-upload-ex1, elf-page-upload-ex2, elf-page-upload-ex3, elf-page-upload-ex4, elf-page-upload-ex5, elf-page-upload-ex6, elf-page-upload-ex7, elf-page-upload-ex8, elf-page-upload-ex9",
      ),
    ).toHaveLength(9);

    const tables = page.shadowRoot?.querySelectorAll<PropsTableElement>("elf-props-table");
    expect(tables).toHaveLength(4);
    expect(tables?.[0]?.rows?.some((row) => row.name === "chunkSize")).toBe(true);
    expect(tables?.[1]?.rows?.some((row) => row.name === "success")).toBe(true);
    expect(tables?.[3]?.rows?.some((row) => row.name === "dropzone")).toBe(true);
    expect(tables?.[0]?.rows?.[0]?.desc).toContain("controlled file list");
  });

  it("keeps every preview centered and every changing state in the title row", async () => {
    for (const tag of exampleTags) {
      const example = await mount(tag);
      const playground = example.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
      const status = playground?.querySelector<HTMLElement>('[slot="status"]');

      expect(playground).not.toBeNull();
      expect(playground?.querySelector(".upload-demo-stage")).not.toBeNull();
      expect(status?.parentElement).toBe(playground);
      expect(status?.getAttribute("role")).toBe("status");
      expect(status?.getAttribute("aria-live")).toBe("polite");
      example.remove();
    }
  });

  it("keeps English Template and Script source free of untranslated Han text", async () => {
    for (const tag of exampleTags) {
      const example = await mount(tag);
      const playground = example.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
      expect(`${playground?.code ?? ""}\n${playground?.script ?? ""}`).not.toMatch(
        /[\u3400-\u9fff]/u,
      );
      example.remove();
    }
  });

  it("preserves the Vuetify-aligned input and dropzone structures", async () => {
    const inputExample = await mount(exampleTags[7]!);
    expect(inputExample.shadowRoot?.querySelector(".file-input-field")).toBeTruthy();
    expect(inputExample.shadowRoot?.querySelector(".file-input-chip")?.textContent).toContain(
      "design-system.pdf",
    );

    const dropExample = await mount(exampleTags[8]!);
    const upload = dropExample.shadowRoot?.querySelector<HTMLElement>("elf-upload");
    expect(upload?.getAttribute("drag")).not.toBeNull();
    expect(dropExample.shadowRoot?.querySelector(".upload-drop-or")).toBeTruthy();
    const browse = dropExample.shadowRoot?.querySelector<HTMLButtonElement>(".upload-browse");
    expect(browse).toBeTruthy();
    expect(upload?.shadowRoot?.querySelector('slot[name="dropzone"]')).toBeTruthy();

    const input = upload?.shadowRoot?.querySelector<HTMLInputElement>("input.native");
    const openFilePicker = vi.spyOn(input!, "click").mockImplementation(() => undefined);
    browse?.click();
    expect(openFilePicker).toHaveBeenCalledTimes(1);
  });

  it("updates the basic title status through the real file input", async () => {
    const example = await mount(exampleTags[0]!);
    const playground = example.shadowRoot?.querySelector<PlaygroundElement>("elf-playground");
    const upload = playground?.querySelector<HTMLElement>("elf-upload");
    const input = upload?.shadowRoot?.querySelector<HTMLInputElement>("input.native");
    const status = playground?.querySelector<HTMLElement>('[slot="status"]');

    Object.defineProperty(input, "files", {
      value: [new File(["report"], "report.pdf", { type: "application/pdf" })],
      configurable: true,
    });
    input?.dispatchEvent(new Event("change"));
    await wait();
    await wait();

    expect(status?.textContent).toContain("Selected 1 files");
    expect(status?.textContent).toContain("report.pdf");
  });
});
