import { readFileSync } from "node:fs";
import { registerComponents } from "@elfui/core";
import { beforeAll, describe, expect, it } from "vitest";

import { resolveAppMenuIcon } from "../../app/menu-icons";
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
    await new Promise<void>((resolve) => setTimeout(resolve, 20));

    const header = Array.from(element.shadowRoot!.children).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && Boolean(child.shadowRoot?.querySelector("h1")),
    )!;
    expect(header).toBeTruthy();
    expect(header.shadowRoot?.querySelector("h1")?.textContent).toBe("Select 选择器");
    expect(header.shadowRoot?.textContent).toContain("表单组件");
    expect(header.shadowRoot?.textContent).toContain("v1.0.0");
    expect(header.shadowRoot?.querySelector(".hero-title-icon path")?.getAttribute("d")).toBe(
      resolveAppMenuIcon("/"),
    );
  });

  it("keeps the page hero card compact without an outer shadow", () => {
    const source = readFileSync(
      "packages/kit/src/components/Navigation/PageHeader/style.scss",
      "utf8",
    );
    const heroBlock = source.slice(
      source.indexOf(".is-hero {"),
      source.indexOf(".is-hero.is-card"),
    );

    expect(source).toContain("border-radius: var(--elf-radius-md);");
    expect(heroBlock).not.toContain("box-shadow");
    expect(source).toContain("border-radius: inherit;");
  });

  it("renders breadcrumb navigation below the page hero", async () => {
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
    const breadcrumb = element.shadowRoot!.querySelector<HTMLElement>(".docs-hero-breadcrumb");

    expect(header.nextElementSibling).toBe(breadcrumb);
    expect(breadcrumb?.shadowRoot?.textContent).toContain("首页");
    expect(breadcrumb?.shadowRoot?.textContent).toContain("表单组件");
    expect(breadcrumb?.shadowRoot?.textContent).toContain("Select 选择器");
  });
});
