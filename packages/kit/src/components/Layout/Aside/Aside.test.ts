import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-aside", () => {
  it("uses the Element Plus compatible 300px default width", async () => {
    const el = document.createElement("elf-aside");
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_width")).toBe("300px");
  });

  it("maps the width attribute to the host CSS variable", async () => {
    const el = document.createElement("elf-aside");
    el.setAttribute("width", "180px");
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_width")).toBe("180px");
  });

  it("reacts to width property updates", async () => {
    const el = document.createElement("elf-aside") as HTMLElement & { width: string };
    document.body.appendChild(el);
    el.width = "20rem";
    await tick();
    expect(el.style.getPropertyValue("--_width")).toBe("20rem");
  });

  it("renders default slot content", async () => {
    const el = document.createElement("elf-aside");
    el.innerHTML = "<nav>项目导航</nav>";
    document.body.appendChild(el);
    await tick();
    expect(el.querySelector("nav")?.textContent).toBe("项目导航");
    expect(el.shadowRoot?.querySelector("slot")).toBeTruthy();
  });
});
