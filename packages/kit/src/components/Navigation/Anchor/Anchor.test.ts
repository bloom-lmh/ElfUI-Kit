import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  history.replaceState(null, "", "/");
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AnchorEl extends HTMLElement {
  items?: unknown[];
  modelValue?: string;
  defaultActive?: string;
  container?: string | HTMLElement;
  offset?: number;
  bound?: number;
  bounds?: number;
  marker?: boolean;
  type?: string;
  direction?: string;
  duration?: number;
  smooth?: boolean;
  props?: Record<string, string>;
  scrollToAnchor?: (href: string) => void;
}

interface AnchorLinkEl extends HTMLElement {
  href?: string;
  active?: boolean;
  level?: number;
}

const sections = ["intro", "usage", "api"];

const installSections = (): void => {
  for (const [index, id] of sections.entries()) {
    const section = document.createElement("section");
    section.id = id;
    section.getBoundingClientRect = vi.fn(() => ({
      top: index * 160 - window.scrollY,
      left: 0,
      right: 100,
      bottom: index * 160 - window.scrollY + 80,
      width: 100,
      height: 80,
      x: 0,
      y: index * 160 - window.scrollY,
      toJSON: () => ({}),
    })) as unknown as Element["getBoundingClientRect"];
    document.body.appendChild(section);
  }
};

const mount = async (patch: Partial<AnchorEl> = {}): Promise<AnchorEl> => {
  installSections();
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: patch.offset ? 10 : 0,
    writable: true,
  });
  vi.spyOn(window, "scrollTo").mockImplementation((options?: ScrollToOptions | number) => {
    if (typeof options === "object" && options) {
      Object.defineProperty(window, "scrollY", {
        configurable: true,
        value: Number(options.top || 0),
        writable: true,
      });
    }
  });

  const el = document.createElement("elf-anchor") as AnchorEl;
  Object.assign(el, {
    items: [
      { title: "Intro", href: "#intro" },
      { title: "Usage", href: "#usage" },
      { title: "API", href: "#api", disabled: true },
    ],
    smooth: false,
    ...patch,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const activeText = (el: AnchorEl): string =>
  el.shadowRoot!.querySelector(".item.is-active")?.textContent?.trim() || "";

describe("elf-anchor", () => {
  it("renders anchor items and activates the first reachable target", async () => {
    const el = await mount();

    expect(el.shadowRoot!.querySelectorAll(".item")).toHaveLength(3);
    expect(activeText(el)).toContain("Intro");
  });

  it("clicks an item, emits events and scrolls to the target", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const onClick = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as unknown as EventListener);
    el.addEventListener("change", onChange as unknown as EventListener);
    el.addEventListener("click", onClick as unknown as EventListener);

    (el.shadowRoot!.querySelectorAll(".link")[1] as HTMLElement).click();
    await tick();
    await tick();

    expect(activeText(el)).toContain("Usage");
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("#usage");
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      href: "#usage",
      oldHref: "#intro",
    });
    expect((onClick.mock.calls[0]![0] as CustomEvent).detail.href).toBe("#usage");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 160, behavior: "auto" });
  });

  it("updates the active item while the page scrolls", async () => {
    const el = await mount({ bounds: 8 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 170, writable: true });

    window.dispatchEvent(new Event("scroll"));
    await tick();
    await tick();

    expect(activeText(el)).toContain("Usage");
  });

  it("supports custom field names", async () => {
    const el = await mount({
      props: { title: "label", href: "to", disabled: "locked", children: "nodes" },
      items: [
        { label: "Guide", to: "#intro" },
        {
          label: "Reference",
          to: "#usage",
          nodes: [{ label: "Disabled", to: "#api", locked: true }],
        },
      ],
    });

    expect(el.shadowRoot!.textContent).toContain("Guide");
    expect(el.shadowRoot!.textContent).toContain("Reference");
    expect(el.shadowRoot!.querySelectorAll(".item")).toHaveLength(3);
  });

  it("does not activate disabled items", async () => {
    const el = await mount();

    (el.shadowRoot!.querySelectorAll(".link")[2] as HTMLElement).click();
    await tick();

    expect(activeText(el)).toContain("Intro");
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("supports bound alias, direction, type, marker and scrollTo expose", async () => {
    const el = await mount({
      bound: 20,
      direction: "horizontal",
      type: "underline",
      marker: false,
      duration: 0,
    });

    expect(el.shadowRoot!.querySelector(".anchor.is-horizontal.is-underline")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".track")).toBeNull();

    Object.defineProperty(window, "scrollY", { configurable: true, value: 145, writable: true });
    window.dispatchEvent(new Event("scroll"));
    await tick();
    expect(activeText(el)).toContain("Usage");

    el.scrollToAnchor!("#usage");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 160, behavior: "auto" });
  });

  it("supports compositional anchor links and nested sub-links", async () => {
    const el = await mount({ items: [] });
    el.innerHTML = `
      <elf-anchor-link href="#intro" title="Intro"></elf-anchor-link>
      <elf-anchor-link href="#usage" title="Usage">
        <elf-anchor-link slot="sub-link" href="#api" title="API"></elf-anchor-link>
      </elf-anchor-link>
    `;
    await tick();
    await tick();

    const links = Array.from(el.querySelectorAll("elf-anchor-link")) as AnchorLinkEl[];
    expect(links).toHaveLength(3);
    expect(links.map((link) => link.level)).toEqual([0, 0, 1]);
    expect(links[1]!.shadowRoot!.querySelector(".link")!.textContent).toContain("Usage");
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();

    const onClick = vi.fn();
    el.addEventListener("click", onClick as unknown as EventListener);
    (links[1]!.shadowRoot!.querySelector(".link") as HTMLElement).click();
    await tick();
    await tick();

    expect(links[1]!.active).toBe(true);
    expect((onClick.mock.calls[0]![0] as CustomEvent).detail.href).toBe("#usage");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 160, behavior: "auto" });
  });

  it("reconnects when the scroll container changes", async () => {
    const first = document.createElement("div");
    const second = document.createElement("div");
    document.body.append(first, second);
    const firstAdd = vi.spyOn(first, "addEventListener");
    const firstRemove = vi.spyOn(first, "removeEventListener");
    const secondAdd = vi.spyOn(second, "addEventListener");

    const el = await mount({ container: first });
    expect(firstAdd).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });

    el.container = second;
    await tick();
    await tick();

    expect(firstRemove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(secondAdd).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
  });

  it("keeps horizontal items intrinsic and scrolls the selected last item into view", async () => {
    const el = await mount({
      direction: "horizontal",
      marker: false,
      smooth: false,
      items: [
        { title: "Overview", href: "#intro" },
        { title: "Install", href: "#usage" },
        { title: "Reference", href: "#api" },
        { title: "Release notes", href: "#release" },
      ],
    });
    const list = el.shadowRoot!.querySelector<HTMLElement>(".list")!;
    const renderedItems = el.shadowRoot!.querySelectorAll<HTMLElement>(".item");
    Object.defineProperty(list, "clientWidth", { configurable: true, value: 220 });
    Object.defineProperty(list, "scrollLeft", { configurable: true, value: 0, writable: true });
    Object.defineProperty(renderedItems[3], "offsetLeft", { configurable: true, value: 430 });
    Object.defineProperty(renderedItems[3], "offsetWidth", { configurable: true, value: 110 });
    const scrollTo = vi.fn();
    Object.defineProperty(list, "scrollTo", { configurable: true, value: scrollTo });

    (renderedItems[3].querySelector(".link") as HTMLAnchorElement).click();
    await tick();

    expect(activeText(el)).toContain("Release notes");
    expect(scrollTo).toHaveBeenCalledWith({ left: 320, behavior: "auto" });
  });

  it("keeps wheel scrolling while previous and next controls select sibling anchors", async () => {
    const el = await mount({ direction: "horizontal", smooth: false, defaultActive: "#intro" });
    const list = el.shadowRoot!.querySelector<HTMLElement>(".list")!;
    Object.defineProperty(list, "clientWidth", { configurable: true, value: 200 });
    Object.defineProperty(list, "scrollWidth", { configurable: true, value: 600 });
    Object.defineProperty(list, "scrollLeft", { configurable: true, value: 0, writable: true });
    const wheel = new WheelEvent("wheel", { deltaY: 80, cancelable: true, bubbles: true });
    list.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(true);
    expect(list.scrollLeft).toBe(80);

    const previous = el.shadowRoot!.querySelector(
      ".scroll-control.is-previous",
    ) as HTMLButtonElement;
    const next = el.shadowRoot!.querySelector(".scroll-control.is-next") as HTMLButtonElement;
    expect(previous.disabled).toBe(true);
    next.click();
    await tick();

    expect(activeText(el)).toContain("Usage");
    expect(previous.disabled).toBe(false);
    expect(el.shadowRoot!.querySelectorAll(".scroll-control")).toHaveLength(2);
  });

  it("scrolls a horizontally overflowing content container on anchor navigation", async () => {
    const container = document.createElement("div");
    container.id = "horizontal-content";
    Object.defineProperties(container, {
      clientWidth: { configurable: true, value: 300 },
      scrollWidth: { configurable: true, value: 900 },
      scrollLeft: { configurable: true, value: 0, writable: true },
    });
    container.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      left: 100,
      right: 400,
      bottom: 200,
      width: 300,
      height: 200,
      x: 100,
      y: 0,
      toJSON: () => ({}),
    })) as unknown as Element["getBoundingClientRect"];
    const target = document.createElement("section");
    target.id = "horizontal-end";
    target.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      left: 600,
      right: 820,
      bottom: 200,
      width: 220,
      height: 200,
      x: 600,
      y: 0,
      toJSON: () => ({}),
    })) as unknown as Element["getBoundingClientRect"];
    container.appendChild(target);
    const contentScrollTo = vi.fn();
    Object.defineProperty(container, "scrollTo", { configurable: true, value: contentScrollTo });
    document.body.appendChild(container);

    const el = document.createElement("elf-anchor") as AnchorEl;
    Object.assign(el, {
      direction: "horizontal",
      smooth: false,
      container: "#horizontal-content",
      items: [{ title: "Release notes", href: "#horizontal-end" }],
    });
    document.body.appendChild(el);
    await tick();
    await tick();

    el.scrollToAnchor!("#horizontal-end");
    expect(contentScrollTo).toHaveBeenCalledWith({ left: 500, behavior: "auto" });
  });
});
