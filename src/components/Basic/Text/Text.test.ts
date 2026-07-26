import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Text } from "./index";

interface TextElement extends HTMLElement {
  type?: string;
  size?: string;
  truncated?: boolean;
  lineClamp?: number | string;
  tag?: string;
  mark?: boolean;
  deleted?: boolean;
  inserted?: boolean;
  strong?: boolean;
  italic?: boolean;
}

beforeAll(() => {
  registerComponents(Text);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

const mountText = async (configure?: (element: TextElement) => void): Promise<TextElement> => {
  const element = document.createElement("elf-text") as TextElement;
  configure?.(element);
  document.body.appendChild(element);
  await tick();
  return element;
};

describe("elf-text", () => {
  it("normalizes semantic types and invalid values", async () => {
    const element = await mountText((text) => {
      text.type = "success";
    });
    expect(element.getAttribute("type")).toBe("success");

    element.type = "unknown";
    await tick();
    expect(element.getAttribute("type")).toBe("");
  });

  it("supports Element Plus sizes and compact aliases", async () => {
    const element = await mountText((text) => {
      text.size = "large";
    });
    expect(element.getAttribute("size")).toBe("large");

    element.size = "sm";
    await tick();
    expect(element.getAttribute("size")).toBe("sm");

    element.size = "oversized";
    await tick();
    expect(element.getAttribute("size")).toBe("");
  });

  it("reflects truncation and formatting flags", async () => {
    const element = await mountText((text) => {
      text.truncated = true;
      text.mark = true;
      text.deleted = true;
      text.inserted = true;
      text.strong = true;
      text.italic = true;
    });

    for (const flag of ["truncated", "mark", "deleted", "inserted", "strong", "italic"]) {
      expect(element.hasAttribute(flag)).toBe(true);
    }
  });

  it("normalizes numeric, string, zero, and invalid line clamps", async () => {
    const element = await mountText((text) => {
      text.lineClamp = 3;
    });
    expect(element.hasAttribute("data-line-clamp")).toBe(true);
    expect(element.style.getPropertyValue("--_line-clamp")).toBe("3");

    element.lineClamp = "2";
    await tick();
    expect(element.style.getPropertyValue("--_line-clamp")).toBe("2");

    element.lineClamp = 0;
    await tick();
    expect(element.hasAttribute("data-line-clamp")).toBe(true);
    expect(element.style.getPropertyValue("--_line-clamp")).toBe("1");

    element.lineClamp = "invalid";
    await tick();
    expect(element.style.getPropertyValue("--_line-clamp")).toBe("1");
  });

  it("removes the line clamp flag when the property is cleared", async () => {
    const element = await mountText((text) => {
      text.lineClamp = 2;
    });
    expect(element.hasAttribute("data-line-clamp")).toBe(true);

    element.lineClamp = undefined;
    await tick();
    expect(element.hasAttribute("data-line-clamp")).toBe(false);
  });

  it.each([
    ["span", "span"],
    ["p", "p"],
    ["strong", "strong"],
    ["sub", "sub"],
    ["sup", "sup"],
    ["h2", "h2"]
  ])("renders tag=%s with native semantics", async (tag, selector) => {
    const element = await mountText((text) => {
      text.tag = tag;
      text.textContent = "Semantic text";
    });
    expect(element.shadowRoot!.querySelector(`${selector}.text`)).toBeTruthy();
    expect(element.getAttribute("tag")).toBe(tag);
  });

  it("falls back to a span for unsafe tags", async () => {
    const element = await mountText((text) => {
      text.tag = "script";
      text.textContent = "Safe text";
    });
    expect(element.shadowRoot!.querySelector("span.text")).toBeTruthy();
    expect(element.getAttribute("tag")).toBe("span");
  });

  it("exposes the semantic element through part=text", async () => {
    const element = await mountText();
    expect(element.shadowRoot!.querySelector("[part='text']")).toBeTruthy();
  });
});
