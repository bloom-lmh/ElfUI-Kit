import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageInstallation } = await import("./index");
  pageTag = ensureCustomElement(PageInstallation);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Installation (Markdown)", () => {
  it("renders the installation guide through elf-md-page with library code cards and tables", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();

    const mdPage = page.shadowRoot!.querySelector<HTMLElement>("elf-md-page");
    expect(mdPage?.getAttribute("max-width")).toBe("100%");

    const content = mdPage?.shadowRoot?.querySelector<HTMLElement>(".md-content");
    expect(content?.querySelector("h2")?.textContent).toContain("环境要求");
    const cards = Array.from(content?.querySelectorAll<HTMLElement>("elf-code-card") ?? []);
    expect(cards.length).toBeGreaterThanOrEqual(6);
    const cardText = cards.map(
      (card) => card.shadowRoot?.querySelector(".card-body code")?.textContent ?? "",
    );
    expect(cardText.some((text) => text.includes('<script type="module">'))).toBe(true);
    expect(cardText.some((text) => text.includes("defineHtml"))).toBe(true);
    expect(content?.querySelectorAll("elf-table").length).toBeGreaterThanOrEqual(2);
    expect(content?.querySelectorAll("elf-quote").length).toBeGreaterThanOrEqual(1);
    expect(content?.querySelector("elf-card")).toBeTruthy();
    expect(content?.querySelector("elf-button")).toBeTruthy();
    expect(content?.querySelector("elf-input")).toBeTruthy();
    expect(content?.querySelector("elf-tag")).toBeTruthy();
    expect(content?.querySelector("elf-link")).toBeTruthy();
  });
});
