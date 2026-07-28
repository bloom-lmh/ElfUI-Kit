import { beforeAll, beforeEach, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageAccessibility } = await import("./index");
  pageTag = ensureCustomElement(PageAccessibility);
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

const findByAttribute = (root: Node, name: string): Element | null => {
  if (root instanceof Element && root.hasAttribute(name)) return root;
  if (root instanceof Element && root.shadowRoot) {
    const shadowMatch = findByAttribute(root.shadowRoot, name);
    if (shadowMatch) return shadowMatch;
  }
  for (const child of root.childNodes) {
    const childMatch = findByAttribute(child, name);
    if (childMatch) return childMatch;
  }
  return null;
};

describe("Accessibility guide", () => {
  it("documents the shared accessibility contract", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const text = collectText(page);
    expect(text).toContain("Accessibility 无障碍");
    expect(text).toContain("焦点与弱化动效");
    expect(text).toContain("Accessibility contract");
  });

  it("exposes the keyboard shortcut semantics", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const button = findByAttribute(page, "aria-keyshortcuts");
    expect(button?.getAttribute("aria-keyshortcuts")).toContain("Control+K");
  });
});
