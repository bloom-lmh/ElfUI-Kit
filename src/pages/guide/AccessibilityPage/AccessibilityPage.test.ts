import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageAccessibility } = await import("./index");
  pageTag = ensureCustomElement(PageAccessibility);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
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

const mount = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await tick();
  await tick();
  return page;
};

describe("Accessibility guide", () => {
  it("中文页面覆盖案例、运行状态、源码和契约表", async () => {
    const text = collectText(await mount());
    expect(text).toContain("焦点与弱化动效");
    expect(text).toContain("快捷键与生命周期");
    expect(text).toContain("无障碍契约");
    expect(text).toContain("等待 Ctrl/⌘ + K");
  });

  it("英文页面覆盖案例、运行状态、源码和契约表且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mount());
    expect(text).toContain("Focus and reduced motion");
    expect(text).toContain("Hotkeys and lifecycle");
    expect(text).toContain("Accessibility contract");
    expect(text).toContain("Waiting for Ctrl/⌘ + K");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("exposes the keyboard shortcut semantics", async () => {
    const page = await mount();
    const button = findByAttribute(page, "aria-keyshortcuts");
    expect(button?.getAttribute("aria-keyshortcuts")).toContain("Control+K");
  });
});
