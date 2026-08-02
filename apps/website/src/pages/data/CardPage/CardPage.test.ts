import { afterEach, beforeAll, describe, expect, it } from "vitest";

let interactionExampleTag = "";
let stateExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageCardEx2 } = await import("./ex2");
  const { PageCardEx3 } = await import("./ex3");
  interactionExampleTag = ensureCustomElement(PageCardEx2);
  stateExampleTag = ensureCustomElement(PageCardEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Card documentation", () => {
  it("keeps whole-card keyboard activation separate from the nested favorite action", async () => {
    const page = document.createElement(interactionExampleTag);
    document.body.appendChild(page);
    await tick();

    const card = page.shadowRoot!.querySelector<HTMLElement>(".card-project")!;
    const content = card.shadowRoot!.querySelector<HTMLElement>(".card-content")!;
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("整卡激活 1");

    const favorite = page.shadowRoot!.querySelector<HTMLButtonElement>(".card-favorite")!;
    favorite.click();
    await tick();
    expect(favorite.getAttribute("aria-pressed")).toBe("true");
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("整卡激活 1");
  });

  it("finishes loading and recovers a failed shortcut cover", async () => {
    const page = document.createElement(stateExampleTag);
    document.body.appendChild(page);
    await tick();

    const cards = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-card");
    const reportCard = cards[0]!;
    const mediaCard = cards[1] as HTMLElement & { image?: string };
    expect(reportCard.hasAttribute("loading")).toBe(true);

    const loadingToggle = page.shadowRoot!.querySelector<HTMLButtonElement>(
      ".card-demo-actions button",
    )!;
    loadingToggle.click();
    await tick();
    expect(reportCard.hasAttribute("loading")).toBe(false);

    mediaCard
      .shadowRoot!.querySelector<HTMLImageElement>(".card-image-wrap img")!
      .dispatchEvent(new Event("error"));
    await tick();
    const retry = page.shadowRoot!.querySelector<HTMLButtonElement>(".card-media-error button")!;
    expect(retry).toBeTruthy();
    retry.click();
    await tick();

    expect(mediaCard.image).toBe("/logo.png");
    mediaCard
      .shadowRoot!.querySelector<HTMLImageElement>(".card-image-wrap img")!
      .dispatchEvent(new Event("load"));
    await tick();
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("图片已恢复");
  });
});
