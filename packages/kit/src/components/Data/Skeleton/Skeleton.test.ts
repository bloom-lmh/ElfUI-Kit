import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

type SkeletonHost = HTMLElement & {
  loading?: boolean;
  count?: number;
  rows?: number;
  throttle?: number | { leading?: number; trailing?: number };
};

const mount = async (patch: Partial<SkeletonHost> = {}): Promise<SkeletonHost> => {
  const el = document.createElement("elf-skeleton") as SkeletonHost;
  Object.assign(el, patch);
  document.body.appendChild(el);
  await tick();
  return el;
};

describe("elf-skeleton", () => {
  it("renders default-slot content when loading is false", async () => {
    const el = await mount();
    el.textContent = "Loaded content";
    await tick();

    expect(el.shadowRoot!.querySelector(".placeholder")).toBeNull();
    expect(el.shadowRoot!.querySelector("slot")?.assignedNodes()[0]?.textContent).toBe(
      "Loaded content",
    );
  });

  it("renders the default three text rows while loading", async () => {
    const el = await mount({ loading: true });

    expect(el.shadowRoot!.querySelectorAll(".skeleton")).toHaveLength(3);
    expect(el.shadowRoot!.querySelector(".root")?.getAttribute("aria-busy")).toBe("true");
  });

  it("uses count and rows to generate predictable placeholder groups", async () => {
    const el = await mount({ loading: true, count: 2, rows: 2 });

    expect(el.shadowRoot!.querySelectorAll(".group")).toHaveLength(2);
    expect(el.shadowRoot!.querySelectorAll(".skeleton")).toHaveLength(4);
  });

  it("keeps non-text variants to one placeholder per group", async () => {
    const el = await mount({ loading: true, count: 2 });
    el.setAttribute("variant", "circle");
    await tick();

    expect(el.shadowRoot!.querySelectorAll(".skeleton")).toHaveLength(2);
  });

  it("renders a custom template slot while loading", async () => {
    const el = await mount({ loading: true });
    el.innerHTML = '<span slot="template">Custom placeholder</span>';
    await tick();

    const template = el.shadowRoot!.querySelector('slot[name="template"]') as HTMLSlotElement;
    expect(template.assignedNodes()[0]?.textContent).toContain("Custom placeholder");
  });

  it("delays showing a loading skeleton with numeric throttle", async () => {
    const el = await mount({ throttle: 20 });
    el.loading = true;
    await tick();

    expect(el.shadowRoot!.querySelector(".placeholder")).toBeNull();
    await wait(30);
    expect(el.shadowRoot!.querySelector(".placeholder")).toBeTruthy();
  });

  it("reflects the animated state for the shimmer stylesheet", async () => {
    const el = await mount({ loading: true });
    el.setAttribute("animated", "");
    await tick();

    expect(el.hasAttribute("animated")).toBe(true);
  });
});
