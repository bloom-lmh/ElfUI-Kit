import { createMemoryHistory, createRouter, setActiveRouter } from "@elfui/router";
import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { OverviewCard } from "./index";

beforeAll(() => {
  registerComponents(OverviewCard);
});

afterEach(() => {
  setActiveRouter(null);
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};
const cardTag = (): string =>
  String(
    (OverviewCard as typeof OverviewCard & { __elfDefinition?: { tag?: string } }).__elfDefinition
      ?.tag,
  );

describe("OverviewCard", () => {
  it("renders a linked title, badge, preview slot, and accessible name", async () => {
    const card = document.createElement(cardTag()) as HTMLElement & {
      title: string;
      href: string;
      badge: string;
      ariaLabel: string;
    };
    Object.assign(card, {
      title: "Button 按钮",
      href: "/basic/button",
      badge: "New",
      ariaLabel: "Open Button documentation",
    });
    card.innerHTML = '<span data-preview="button">Action</span>';
    document.body.appendChild(card);
    await tick();

    const link = card.shadowRoot?.querySelector("elf-link");
    const anchor = link?.shadowRoot?.querySelector<HTMLAnchorElement>("a");
    expect(anchor?.getAttribute("href")).toBe("/basic/button");
    expect(anchor?.getAttribute("aria-label")).toBeNull();
    expect(link?.querySelector(".sr-only")?.textContent).toBe("Open Button documentation");
    expect(link?.querySelector(".surface")?.getAttribute("aria-hidden")).toBe("true");
    expect(card.shadowRoot?.querySelector(".title")?.textContent).toContain("Button");
    expect(card.shadowRoot?.querySelector(".badge")?.textContent).toBe("New");
    expect(card.querySelector("[data-preview='button']")?.textContent).toBe("Action");
  });

  it("navigates through the active router when the card is clicked", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      initialPath: "/overview",
      routes: [
        { path: "/overview", component: "overview-page" },
        { path: "/basic/button", component: "button-page" },
      ],
    });
    setActiveRouter(router);
    const card = document.createElement(cardTag()) as HTMLElement & {
      title: string;
      href: string;
      ariaLabel: string;
    };
    Object.assign(card, {
      title: "Button",
      href: "/basic/button",
      ariaLabel: "Open Button documentation",
    });
    document.body.appendChild(card);
    await tick();

    card.shadowRoot?.querySelector("elf-link")?.shadowRoot?.querySelector("a")?.click();
    await router.isReady();
    await tick();

    expect(router.current.peek().path).toBe("/basic/button");
  });
});
