import { readFileSync } from "node:fs";

import { afterEach, beforeAll, describe, expect, it } from "vitest";

interface DividerElement extends HTMLElement {
  borderStyle?: string;
  contentPosition?: string;
  dashed?: boolean;
  direction?: string;
}

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

const mount = async (
  attributes: Record<string, string> = {},
  content = "",
): Promise<DividerElement> => {
  const element = document.createElement("elf-divider") as DividerElement;
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  element.textContent = content;
  document.body.appendChild(element);
  await tick();
  return element;
};

describe("elf-divider", () => {
  it.each(["solid", "dashed", "dotted", "double"])(
    "supports the %s border style",
    async (borderStyle) => {
      const element = await mount({ "border-style": borderStyle });

      expect(element.getAttribute("border-style")).toBe(borderStyle);
      expect(element.shadowRoot!.querySelectorAll(".line")).toHaveLength(2);
    },
  );

  it("normalizes invalid props and keeps dashed as a compatibility alias", async () => {
    const element = await mount({
      "border-style": "groove",
      "content-position": "outside",
      direction: "diagonal",
    });

    expect(element.getAttribute("border-style")).toBe("solid");
    expect(element.getAttribute("content-position")).toBe("center");
    expect(element.getAttribute("direction")).toBe("horizontal");

    element.dashed = true;
    await tick();
    expect(element.getAttribute("border-style")).toBe("dashed");
  });

  it("reflects property updates used by component styling", async () => {
    const element = await mount();
    element.direction = "vertical";
    element.contentPosition = "right";
    element.borderStyle = "dotted";
    await tick();

    expect(element.getAttribute("direction")).toBe("vertical");
    expect(element.getAttribute("content-position")).toBe("right");
    expect(element.getAttribute("border-style")).toBe("dotted");
  });

  it("exposes separator semantics and uses visible slot text as its name", async () => {
    const element = await mount({}, "Release boundary");

    expect(element.getAttribute("role")).toBe("separator");
    expect(element.getAttribute("aria-orientation")).toBe("horizontal");
    expect(element.getAttribute("aria-label")).toBe("Release boundary");
    expect(element.getAttribute("has-content")).toBe("");
    expect(element.shadowRoot!.querySelector("slot")?.assignedNodes()[0]?.textContent).toBe(
      "Release boundary",
    );
  });

  it("updates its accessible name when slot content changes", async () => {
    const element = await mount({}, "Before");
    element.textContent = "After release";
    await tick();

    expect(element.getAttribute("aria-label")).toBe("After release");
  });

  it("keeps whitespace-only content decorative", async () => {
    const element = await mount({}, "   \n ");

    expect(element.hasAttribute("has-content")).toBe(false);
    expect(element.hasAttribute("aria-label")).toBe(false);
  });

  it("announces vertical orientation", async () => {
    const element = await mount({ direction: "vertical", "border-style": "dotted" });

    expect(element.getAttribute("aria-orientation")).toBe("vertical");
    expect(element.getAttribute("border-style")).toBe("dotted");
  });

  it("uses logical borders and protects long divider content", () => {
    const cssText = readFileSync("packages/kit/src/components/Data/Divider/style.scss", "utf8");
    expect(cssText).toContain("border-block-start:");
    expect(cssText).toContain("border-inline-start:");
    expect(cssText).toContain("text-overflow: ellipsis");
    expect(cssText).toContain("max-width: min(70%, 40rem)");
  });
});
