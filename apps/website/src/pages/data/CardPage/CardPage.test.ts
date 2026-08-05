import { afterEach, beforeAll, describe, expect, it } from "vitest";

let interactionExampleTag = "";
let stateExampleTag = "";
let compositionExampleTag = "";
let creativeExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageCardEx2 } = await import("./ex2");
  const { PageCardEx3 } = await import("./ex3");
  const { PageCardEx4 } = await import("./ex4");
  const { PageCardEx5 } = await import("./ex5");
  interactionExampleTag = ensureCustomElement(PageCardEx2);
  stateExampleTag = ensureCustomElement(PageCardEx3);
  compositionExampleTag = ensureCustomElement(PageCardEx4);
  creativeExampleTag = ensureCustomElement(PageCardEx5);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Card documentation", () => {
  it("renders the composition showcase with four composed cards", async () => {
    const page = document.createElement(compositionExampleTag);
    document.body.appendChild(page);
    await tick();

    const cards = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-card");
    expect(cards).toHaveLength(4);
    const cardImages = Array.from(cards).flatMap((card) =>
      Array.from(card.shadowRoot?.querySelectorAll<HTMLImageElement>("img") ?? []),
    );
    expect(cardImages).toHaveLength(3);
    expect(cardImages.filter((img) => img.closest(".card-image-wrap"))).toHaveLength(2);
    expect(page.shadowRoot!.querySelector(".card-profile-stats")?.textContent).toContain("12");
    expect(page.shadowRoot!.querySelector(".card-revenue strong")?.textContent).toContain("86,420");
    expect(page.shadowRoot!.querySelector('elf-card[image-placement="left"]')).toBeTruthy();
    expect(page.shadowRoot!.querySelectorAll("elf-tag").length).toBeGreaterThanOrEqual(2);
  });

  it("renders creative 3D, glow, and stacked card surfaces", async () => {
    const page = document.createElement(creativeExampleTag);
    document.body.appendChild(page);
    await tick();

    expect(page.shadowRoot!.querySelectorAll(".card-3d")).toHaveLength(1);
    expect(page.shadowRoot!.querySelectorAll(".card-press")).toHaveLength(1);
    expect(page.shadowRoot!.querySelectorAll(".card-flip-scene")).toHaveLength(1);
    expect(page.shadowRoot!.querySelectorAll(".card-glow")).toHaveLength(1);
    expect(page.shadowRoot!.querySelectorAll(".card-stack")).toHaveLength(1);
    expect(page.shadowRoot!.querySelectorAll("elf-card")).toHaveLength(5);
    const images = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-card");
    const loaded = Array.from(images).filter((card) =>
      card.shadowRoot?.querySelector(".card-image-wrap img"),
    );
    expect(loaded).toHaveLength(3);
  });

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
