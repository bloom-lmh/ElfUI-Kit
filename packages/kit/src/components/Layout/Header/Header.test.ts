import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-header", () => {
  it("uses the 60px default height", async () => {
    const el = document.createElement("elf-header");
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("60px");
  });

  it("maps height attributes and property updates to the host CSS variable", async () => {
    const el = document.createElement("elf-header") as HTMLElement & { height: string };
    el.setAttribute("height", "48px");
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("48px");

    el.height = "4rem";
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("4rem");
  });

  it("renders default slot content", async () => {
    const el = document.createElement("elf-header");
    el.innerHTML = "<strong>控制台</strong>";
    document.body.appendChild(el);
    await tick();
    expect(el.querySelector("strong")?.textContent).toBe("控制台");
    expect(el.shadowRoot?.querySelector("slot")).toBeTruthy();
  });
});
