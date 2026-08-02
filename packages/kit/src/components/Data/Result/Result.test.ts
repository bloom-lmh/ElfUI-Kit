import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { registerComponents } from "@elfui/core";

import { Result } from "./index";

beforeAll(() => {
  registerComponents(Result);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ResultEl extends HTMLElement {
  icon?: string;
  title?: string;
  subTitle?: string;
}

describe("elf-result", () => {
  it("renders status, title and subtitle", async () => {
    const el = document.createElement("elf-result") as ResultEl;
    el.icon = "success";
    el.title = "Saved";
    el.subTitle = "Your changes are ready";
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("icon")).toBe("success");
    expect(el.shadowRoot!.textContent).toContain("Saved");
    expect(el.shadowRoot!.textContent).toContain("Your changes are ready");
    expect(el.shadowRoot!.querySelector(".result")?.getAttribute("role")).toBe("status");
  });

  it.each(["success", "warning", "error", "info"])(
    "renders the %s fallback SVG icon",
    async (icon) => {
      const el = document.createElement("elf-result") as ResultEl;
      el.icon = icon;
      document.body.appendChild(el);
      await tick();

      const iconSvg = el.shadowRoot!.querySelector(".icon-svg") as SVGElement;
      expect(iconSvg.dataset.icon).toBe(icon);
      expect(iconSvg.getAttribute("aria-hidden")).toBe("true");
    },
  );

  it("projects named icon, title, subtitle, and extra slots", async () => {
    const el = document.createElement("elf-result");
    el.innerHTML = `
      <span slot="icon">★</span>
      <strong slot="title">Custom title</strong>
      <span slot="sub-title">Custom subtitle</span>
      <button slot="extra">Retry</button>
    `;
    document.body.appendChild(el);
    await tick();

    for (const slot of ["icon", "title", "sub-title", "extra"]) {
      const projected = el.shadowRoot!.querySelector(`slot[name="${slot}"]`) as HTMLSlotElement;
      expect(projected.assignedNodes().length).toBeGreaterThan(0);
    }
  });
});
