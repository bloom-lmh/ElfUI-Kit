import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Heading } from "./index";
import type { HeadingElement } from "./types";

beforeAll(() => registerComponents(Heading));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

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
  it("renders a semantic heading with section defaults", async () => {
    const element = await createHeading();
    const root = element.shadowRoot!;

    expect(element.textContent).toContain("ElfUI heading");
    expect(root.querySelector("h2.heading slot")?.assignedNodes().length).toBe(1);
    expect(element.getAttribute("level")).toBe("2");
    expect(element.getAttribute("variant")).toBe("section");
    expect(root.querySelector(".heading")?.getAttribute("part")).toBe("heading");
  });

  it("maps level and variant to the expected native element and scale", async () => {
    const element = await createHeading((heading) => {
      heading.level = 1;
      heading.variant = "display";
    });
    const root = element.shadowRoot!;

    expect(root.querySelector("h1.heading")).toBeTruthy();
    expect(element.getAttribute("level")).toBe("1");
    expect(element.getAttribute("variant")).toBe("display");
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
      heading.variant = "subsection";
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
  });
});
