import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Heading } from "./index";
import type { HeadingElement } from "./types";

beforeAll(() => registerComponents(Heading));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

const createHeading = async (
  configure?: (element: HeadingElement) => void,
): Promise<HeadingElement> => {
  const element = document.createElement("elf-heading") as HeadingElement;
  element.textContent = "ElfUI heading";
  configure?.(element);
  document.body.appendChild(element);
  await tick();
  await tick();
  return element;
};

describe("elf-heading", () => {
  it("renders a semantic heading with guide defaults", async () => {
    const element = await createHeading();
    const root = element.shadowRoot!;

    expect(element.textContent).toContain("ElfUI heading");
    expect(root.querySelector("h2.heading slot")?.assignedNodes().length).toBe(1);
    expect(element.getAttribute("level")).toBe("2");
    expect(element.getAttribute("family")).toBe("guide");
    expect(element.hasAttribute("accent")).toBe(true);
    expect(element.hasAttribute("chip")).toBe(false);
    expect(root.querySelector(".heading")?.getAttribute("part")).toBe("heading");
  });

  it("maps family and level to the expected native element and scale", async () => {
    const element = await createHeading((heading) => {
      heading.level = 1;
      heading.family = "editorial";
    });
    const root = element.shadowRoot!;

    expect(root.querySelector("h1.heading")).toBeTruthy();
    expect(element.getAttribute("level")).toBe("1");
    expect(element.getAttribute("family")).toBe("editorial");
  });

  it("reflects color, alignment, and weight on the host", async () => {
    const element = await createHeading((heading) => {
      heading.color = "warning";
      heading.align = "center";
      heading.weight = "bold";
    });

    expect(element.getAttribute("color")).toBe("warning");
    expect(element.getAttribute("align")).toBe("center");
    expect(element.getAttribute("weight")).toBe("bold");
  });

  it("supports single-line truncation and multi-line clamp", async () => {
    const truncated = await createHeading((heading) => {
      heading.truncated = true;
    });
    expect(truncated.hasAttribute("truncated")).toBe(true);

    const clamped = await createHeading((heading) => {
      heading.lineClamp = 2;
    });
    expect(clamped.hasAttribute("data-line-clamp")).toBe(true);
    expect(clamped.style.getPropertyValue("--_heading-line-clamp")).toBe("2");
  });

  it("renders eyebrow, index, accent, and chip composition props", async () => {
    const element = await createHeading((heading) => {
      heading.level = 3;
      heading.eyebrow = "Getting started";
      heading.index = "02";
      heading.accent = true;
      heading.chip = true;
    });
    const root = element.shadowRoot!;

    expect(root.querySelector(".eyebrow")?.textContent).toBe("Getting started");
    expect(root.querySelector(".index")?.textContent).toBe("02");
    expect(element.hasAttribute("accent")).toBe(true);
    expect(element.hasAttribute("chip")).toBe(true);
    expect(element.hasAttribute("data-number-visible")).toBe(true);
  });

  it("allows explicit accent and chip overrides", async () => {
    const accentless = await createHeading((heading) => {
      heading.level = 2;
      heading.accent = false;
    });
    expect(accentless.hasAttribute("accent")).toBe(false);

    const plain = await createHeading((heading) => {
      heading.level = 3;
      heading.chip = false;
    });
    expect(plain.hasAttribute("chip")).toBe(false);
  });

  it("defaults brand h1 to gradient and allows disabling", async () => {
    const gradient = await createHeading((heading) => {
      heading.family = "brand";
      heading.level = 1;
    });
    expect(gradient.hasAttribute("gradient")).toBe(true);

    const plain = await createHeading((heading) => {
      heading.family = "brand";
      heading.level = 2;
    });
    expect(plain.hasAttribute("gradient")).toBe(false);

    const disabled = await createHeading((heading) => {
      heading.family = "brand";
      heading.level = 1;
      heading.gradient = false;
    });
    expect(disabled.hasAttribute("gradient")).toBe(false);
  });

  it("applies typography and spacing overrides", async () => {
    const element = await createHeading((heading) => {
      heading.lineHeight = 1.6;
      heading.marginTop = 24;
      heading.marginBottom = "2rem";
      heading.fontSize = 20;
      heading.letterSpacing = 0.5;
    });

    expect(element.hasAttribute("data-line-height")).toBe(true);
    expect(element.style.getPropertyValue("--_heading-line-height")).toBe("1.6");
    expect(element.hasAttribute("data-margin-top")).toBe(true);
    expect(element.style.getPropertyValue("--_heading-margin-top")).toBe("24px");
    expect(element.hasAttribute("data-margin-bottom")).toBe(true);
    expect(element.style.getPropertyValue("--_heading-margin-bottom")).toBe("2rem");
    expect(element.hasAttribute("data-font-size")).toBe(true);
    expect(element.style.getPropertyValue("--_heading-font-size")).toBe("20px");
    expect(element.hasAttribute("data-letter-spacing")).toBe(true);
    expect(element.style.getPropertyValue("--_heading-letter-spacing")).toBe("0.5px");
  });

  it("auto-numbers headings in DOM order within the same scope", async () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <elf-heading level="2" numbered>One</elf-heading>
      <elf-heading level="2" numbered>Two</elf-heading>
      <elf-heading level="3" numbered>Two point one</elf-heading>
    `;
    document.body.appendChild(root);
    await flush();

    const numbers = Array.from(root.querySelectorAll("elf-heading")).map(
      (heading) => heading.shadowRoot?.querySelector(".index")?.textContent,
    );
    expect(numbers).toEqual(["01", "02", "02.1"]);
  });

  it("formats numbers per family within isolated scopes", async () => {
    const expectations: Array<[string, string]> = [
      ["guide", "01"],
      ["editorial", "1"],
      ["terminal", "01"],
      ["brand", "01"],
      ["neon", "01"],
      ["minimal", "1"],
    ];
    const root = document.createElement("div");
    for (const [family] of expectations) {
      const scope = document.createElement("div");
      scope.setAttribute("data-heading-scope", "");
      scope.innerHTML = `<elf-heading family="${family}" level="2" numbered>${family}</elf-heading>`;
      root.appendChild(scope);
    }
    document.body.appendChild(root);
    await flush();

    const numbers = Array.from(root.querySelectorAll("elf-heading")).map(
      (heading) => heading.shadowRoot?.querySelector(".index")?.textContent,
    );
    expect(numbers).toEqual(expectations.map(([, number]) => number));
  });

  it("renders markdown bullet and ordered list headings", async () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <elf-heading level="3" markdown="ordered">Plan</elf-heading>
      <elf-heading level="3" markdown="ordered">Build</elf-heading>
      <elf-heading level="3" markdown="ordered">Ship</elf-heading>
      <elf-heading level="3" markdown="bullet">Notes</elf-heading>
    `;
    document.body.appendChild(root);
    await flush();

    const headings = Array.from(root.querySelectorAll("elf-heading"));
    const markers = headings.map(
      (heading) => heading.shadowRoot?.querySelector(".index")?.textContent,
    );
    expect(markers).toEqual(["1.", "2.", "3.", "-"]);
    expect(headings[0]?.getAttribute("markdown")).toBe("ordered");
    expect(headings[0]?.hasAttribute("data-number-visible")).toBe(true);
    expect(headings[0]?.hasAttribute("chip")).toBe(false);
  });

  it("lets a manual index override markdown ordered numbering", async () => {
    const element = await createHeading((heading) => {
      heading.level = 3;
      heading.markdown = "ordered";
      heading.index = "A";
    });
    const root = element.shadowRoot!;

    expect(root.querySelector(".index")?.textContent).toBe("A");
    expect(element.getAttribute("markdown")).toBe("ordered");
  });
});
