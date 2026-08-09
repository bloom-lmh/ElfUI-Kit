import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const variable = (el: HTMLElement, name: string): string => el.style.getPropertyValue(name);

describe("elf-grid-item", () => {
  it("normalizes span and projects the default slot", async () => {
    const el = document.createElement("elf-grid-item");
    el.setAttribute("span", "6");
    el.textContent = "内容";
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("span")).toBe("6");
    expect(variable(el, "--_base-span")).toBe("6");
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });

  it("clamps invalid grid metrics to safe boundaries", async () => {
    const el = document.createElement("elf-grid-item");
    el.setAttribute("span", "-3");
    el.setAttribute("offset", "99");
    el.setAttribute("push", "-2");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("span")).toBe("1");
    expect(el.getAttribute("offset")).toBe("24");
    expect(el.getAttribute("push")).toBe("0");
    expect(variable(el, "--_base-total")).toBe("25");
  });

  it("offset consumes tracks while preserving content width", async () => {
    const el = document.createElement("elf-grid-item");
    el.setAttribute("span", "6");
    el.setAttribute("offset", "2");
    document.body.appendChild(el);
    await tick();
    expect(variable(el, "--_base-total")).toBe("8");
    expect(variable(el, "--_base-content-width")).toBe("75%");
    expect(variable(el, "--_base-offset-width")).toBe("25%");
  });

  it("push and pull produce a normalized relative shift", async () => {
    const el = document.createElement("elf-grid-item");
    el.setAttribute("span", "4");
    el.setAttribute("push", "3");
    el.setAttribute("pull", "1");
    document.body.appendChild(el);
    await tick();
    expect(variable(el, "--_base-shift")).toBe("50%");
  });

  it("supports numeric and object responsive breakpoints", async () => {
    const el = document.createElement("elf-grid-item") as HTMLElement & {
      xs: number;
      md: { span: number; offset: number };
    };
    el.xs = 12;
    el.md = { span: 6, offset: 2 };
    document.body.appendChild(el);
    await tick();
    expect(variable(el, "--_xs-span")).toBe("12");
    expect(variable(el, "--_md-span")).toBe("6");
    expect(variable(el, "--_md-total")).toBe("8");
  });

  it("reacts to base property updates", async () => {
    const el = document.createElement("elf-grid-item") as HTMLElement & {
      span: number;
      offset: number;
    };
    document.body.appendChild(el);
    el.span = 8;
    el.offset = 4;
    await tick();
    expect(el.getAttribute("span")).toBe("8");
    expect(el.getAttribute("offset")).toBe("4");
    expect(variable(el, "--_base-total")).toBe("12");
  });
});
