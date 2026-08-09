import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let outlineTag = "";
let pageTag = "";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
  const { ensureCustomElement } = await import("@elfui/core");
  const { MdOutline } = await import("./index");
  const { MdPage } = await import("../MdPage/index");
  outlineTag = ensureCustomElement(MdOutline);
  pageTag = ensureCustomElement(MdPage);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("MdOutline", () => {
  it("renders direct toc data with depth filtering", async () => {
    const outline = document.createElement(outlineTag);
    (outline as unknown as { toc?: unknown }).toc = [
      { id: "a", text: "Alpha", depth: 2 },
      { id: "b", text: "Beta", depth: 3 },
      { id: "c", text: "Gamma", depth: 4 },
    ];
    (outline as unknown as { maxDepth?: number }).maxDepth = 3;
    document.body.appendChild(outline);
    await tick();

    const links = outline.shadowRoot!.querySelectorAll<HTMLAnchorElement>(".md-outline-link");
    expect(Array.from(links).map((link) => link.textContent)).toEqual(["Alpha", "Beta"]);
    expect(links[0]?.getAttribute("href")).toBe("#a");
  });

  it("tracks a target md-page and highlights the active heading", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const page = document.createElement(pageTag);
    page.id = "doc";
    page.textContent = "# One\n\n## Two";
    const outline = document.createElement(outlineTag);
    outline.setAttribute("target", "doc");
    document.body.append(page, outline);
    await tick();
    await tick();

    const links = outline.shadowRoot!.querySelectorAll<HTMLAnchorElement>(".md-outline-link");
    expect(Array.from(links).map((link) => link.textContent)).toEqual(["One", "Two"]);

    page.dispatchEvent(
      new CustomEvent("active-change", { detail: "two", bubbles: true, composed: true }),
    );
    await tick();
    expect(outline.shadowRoot!.querySelector(".md-outline-item.is-active")?.textContent).toContain(
      "Two",
    );

    links[1]!.click();
    await tick();
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("shows an empty state without entries", async () => {
    const outline = document.createElement(outlineTag);
    document.body.appendChild(outline);
    await tick();

    expect(outline.shadowRoot!.querySelector(".md-outline-empty")?.textContent).toBe("No outline");
  });
});
