import { createMemoryHistory, createRouter, setActiveRouter } from "@elfui/router";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let routerExampleTag = "";
let safetyExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageLinkEx2 } = await import("./ex2");
  const { PageLinkEx3 } = await import("./ex3");
  routerExampleTag = ensureCustomElement(PageLinkEx2);
  safetyExampleTag = ensureCustomElement(PageLinkEx3);
});

afterEach(() => {
  setActiveRouter(null);
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Link documentation", () => {
  it("demonstrates real router navigation and updates the title-row status", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      initialPath: "/basic/link",
      routes: [
        { path: "/basic/link", component: "link-page" },
        { path: "/basic/button", component: "button-page" },
        { path: "/basic/icon", component: "icon-page" }
      ]
    });
    setActiveRouter(router);
    const page = document.createElement(routerExampleTag);
    document.body.appendChild(page);
    await tick();

    const links = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-link");
    expect(links[0]!.hasAttribute("data-exact-active")).toBe(true);

    links[1]!.shadowRoot!.querySelector<HTMLAnchorElement>("a")!.click();
    await router.isReady();
    await tick();

    expect(router.current.peek().path).toBe("/basic/button");
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("Button");
  });

  it("shows safe external and fully disabled link semantics", async () => {
    const page = document.createElement(safetyExampleTag);
    document.body.appendChild(page);
    await tick();

    const links = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-link");
    const externalAnchor = links[0]!.shadowRoot!.querySelector<HTMLAnchorElement>("a")!;
    const disabledAnchor = links[1]!.shadowRoot!.querySelector<HTMLAnchorElement>("a")!;

    expect(new Set(externalAnchor.rel.split(/\s+/))).toEqual(
      new Set(["external", "noopener", "noreferrer"])
    );
    expect(disabledAnchor.getAttribute("href")).toBeNull();
    expect(disabledAnchor.getAttribute("tabindex")).toBe("-1");
    expect(disabledAnchor.getAttribute("aria-disabled")).toBe("true");
  });
});
