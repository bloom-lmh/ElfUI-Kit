import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Quote } from "./index";

beforeAll(() => {
  registerComponents(Quote);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-quote", () => {
  it("renders semantic blockquote content and optional metadata", async () => {
    const quote = document.createElement("elf-quote") as HTMLElement & {
      title?: string;
      cite?: string;
    };
    quote.title = "Design note";
    quote.cite = "ElfUI";
    quote.textContent = "Keep supporting copy concise.";
    document.body.appendChild(quote);
    await tick();

    expect(quote.shadowRoot?.querySelector("blockquote")).toBeTruthy();
    expect(quote.shadowRoot?.textContent).toContain("Design note");
    expect(quote.shadowRoot?.textContent).toContain("ElfUI");
    expect(quote.textContent).toContain("Keep supporting copy concise.");
  });

  it("normalizes type and variant while reflecting compact mode", async () => {
    const quote = document.createElement("elf-quote") as HTMLElement & {
      type?: string;
      variant?: string;
      compact?: boolean;
    };
    document.body.appendChild(quote);
    quote.type = "danger";
    quote.variant = "outlined";
    quote.compact = true;
    await tick();

    expect(quote.getAttribute("type")).toBe("danger");
    expect(quote.getAttribute("variant")).toBe("outlined");
    expect(quote.hasAttribute("compact")).toBe(true);

    quote.type = "unknown";
    quote.variant = "unknown";
    await tick();
    expect(quote.getAttribute("type")).toBe("default");
    expect(quote.getAttribute("variant")).toBe("soft");
  });
});
