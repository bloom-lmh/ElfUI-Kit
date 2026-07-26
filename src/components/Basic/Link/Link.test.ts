import {
  createMemoryHistory,
  createRouter,
  setActiveRouter,
  type RouteLocationRaw
} from "@elfui/router";
import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Link } from "./index";

beforeAll(() => {
  registerComponents(Link);
});

afterEach(() => {
  setActiveRouter(null);
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

interface LinkElement extends HTMLElement {
  type?: string;
  href?: string;
  to?: RouteLocationRaw;
  replace?: boolean;
  target?: string;
  rel?: string;
  activeClass?: string;
  exactActiveClass?: string;
  disabled?: boolean;
  underline?: boolean;
  icon?: string;
}

const mount = async (patch: Partial<LinkElement> = {}): Promise<LinkElement> => {
  const element = document.createElement("elf-link") as LinkElement;
  element.textContent = "Docs";
  Object.assign(element, patch);
  document.body.appendChild(element);
  await tick();
  return element;
};

const anchorOf = (element: LinkElement): HTMLAnchorElement =>
  element.shadowRoot!.querySelector<HTMLAnchorElement>("a")!;

describe("elf-link", () => {
  it("renders the native href, semantic type, and underline state", async () => {
    const element = await mount({ type: "primary", href: "#api", underline: false });
    const anchor = anchorOf(element);

    expect(element.getAttribute("type")).toBe("primary");
    expect(anchor.getAttribute("href")).toBe("#api");
    expect(anchor.getAttribute("part")).toBe("link");
    expect(anchor.dataset.underline).toBe("false");
  });

  it("normalizes unknown semantic types to default", async () => {
    const element = await mount({ type: "secondary" });
    expect(element.getAttribute("type")).toBe("default");
  });

  it("removes navigation attributes and blocks pointer activation while disabled", async () => {
    const element = await mount({
      disabled: true,
      href: "/docs",
      target: "_blank",
      rel: "external"
    });
    const bubbledClick = vi.fn();
    element.addEventListener("click", bubbledClick);

    anchorOf(element).click();

    expect(bubbledClick).not.toHaveBeenCalled();
    expect(anchorOf(element).getAttribute("href")).toBeNull();
    expect(anchorOf(element).getAttribute("target")).toBeNull();
    expect(anchorOf(element).getAttribute("rel")).toBeNull();
    expect(anchorOf(element).getAttribute("tabindex")).toBe("-1");
    expect(anchorOf(element).getAttribute("aria-disabled")).toBe("true");
    expect(element.hasAttribute("disabled")).toBe(true);
  });

  it.each(["Enter", " "])("blocks the %s key while disabled", async (key) => {
    const element = await mount({ disabled: true, href: "#api" });
    const bubbledKeydown = vi.fn();
    element.addEventListener("keydown", bubbledKeydown);

    const event = new KeyboardEvent("keydown", { key, bubbles: true, composed: true, cancelable: true });
    anchorOf(element).dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(bubbledKeydown).not.toHaveBeenCalled();
  });

  it("adds safe rel tokens to a new browsing context without dropping explicit tokens", async () => {
    const element = await mount({
      href: "https://example.com",
      target: "_blank",
      rel: "external noopener"
    });
    const rel = new Set(anchorOf(element).rel.split(/\s+/));

    expect(rel).toEqual(new Set(["external", "noopener", "noreferrer"]));
  });

  it("does not add rel tokens to same-context links", async () => {
    const element = await mount({ href: "/docs", target: "_self" });
    expect(anchorOf(element).getAttribute("rel")).toBeNull();
  });

  it("resolves and navigates a router target", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      initialPath: "/",
      routes: [
        { path: "/", component: "home-page" },
        { path: "/guide", component: "guide-page" }
      ]
    });
    setActiveRouter(router);
    const element = await mount({ to: "/guide" });
    const navigated = vi.fn();
    element.addEventListener("navigate", navigated);

    anchorOf(element).click();
    await router.isReady();
    await tick();

    expect(router.current.peek().path).toBe("/guide");
    expect(navigated).toHaveBeenCalledOnce();
    expect((navigated.mock.calls[0]![0] as CustomEvent).detail).toBe("/guide");
    expect(element.hasAttribute("data-active")).toBe(true);
    expect(element.hasAttribute("data-exact-active")).toBe(true);
    expect(anchorOf(element).getAttribute("aria-current")).toBe("page");
  });

  it("uses replace navigation and gives to precedence over href", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      initialPath: "/",
      routes: [
        { path: "/", component: "home-page" },
        { path: "/guide", component: "guide-page" }
      ]
    });
    setActiveRouter(router);
    const replace = vi.spyOn(router, "replace");
    const element = await mount({ href: "/ignored", to: "/guide", replace: true });

    anchorOf(element).click();
    await tick();

    expect(anchorOf(element).getAttribute("href")).toBe("/guide");
    expect(replace).toHaveBeenCalledWith("/guide");
  });

  it("leaves modified router clicks to the browser", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      initialPath: "/",
      routes: [
        { path: "/", component: "home-page" },
        { path: "/guide", component: "guide-page" }
      ]
    });
    setActiveRouter(router);
    const push = vi.spyOn(router, "push");
    const element = await mount({ to: "/guide" });
    const event = new MouseEvent("click", {
      bubbles: true,
      composed: true,
      cancelable: true,
      ctrlKey: true
    });

    anchorOf(element).dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(push).not.toHaveBeenCalled();
  });

  it("falls back to a usable path when no router is active", async () => {
    const element = await mount({ to: { path: "/guide" } });
    expect(anchorOf(element).getAttribute("href")).toBe("/guide");
  });

  it("renders the icon property in the icon fallback", async () => {
    const element = await mount({ icon: "↗" });
    const icon = element.shadowRoot!.querySelector(".prop-icon");

    expect(icon?.textContent).toBe("↗");
  });
});
