import { registerComponents } from "@elfui/core";
import { beforeAll, describe, expect, it } from "vitest";

import { DocsHero } from "./index";

beforeAll(() => registerComponents(DocsHero));

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-docs-hero", () => {
  it("reuses PageHeader for the shared component-page hero", async () => {
    const element = document.createElement("elf-docs-hero") as HTMLElement & {
      category: string;
      title: string;
      description: string;
    };
    Object.assign(element, {
      category: "form",
      title: "Select 选择器",
      description: "Choose a value.",
    });
    document.body.appendChild(element);
    await tick();
    await tick();

    const header = Array.from(element.shadowRoot!.children).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && Boolean(child.shadowRoot?.querySelector("h1")),
    )!;
    expect(header).toBeTruthy();
    expect(header.shadowRoot?.querySelector("h1")?.textContent).toBe("Select 选择器");
    expect(header.shadowRoot?.textContent).toContain("表单组件");
    expect(header.shadowRoot?.textContent).toContain("v1.0.0");
  });
});
