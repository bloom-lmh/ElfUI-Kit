import { beforeAll, beforeEach, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageBuildStyles } = await import("./index");
  pageTag = ensureCustomElement(PageBuildStyles);
});

beforeEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const collectText = (root: Node): string => {
  let output = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) output += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return output.replace(/\s+/g, " ").trim();
};

describe("Build and styles guide", () => {
  it("documents only real public package entries", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const text = collectText(page);
    expect(text).toContain("@elfui/kit/styles/utilities.css");
    expect(text).toContain("Build contract");
    expect(text).not.toContain("@elfui/kit/components/");
  });

  it("keeps reset, layers and theme ownership explicit", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const text = collectText(page);
    expect(text).toContain("Reset 与 CSS Layers");
    expect(text).toContain("Theme & customization");
  });
});
