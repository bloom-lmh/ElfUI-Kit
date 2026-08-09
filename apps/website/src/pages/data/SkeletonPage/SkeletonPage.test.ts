import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
let pageTag = "";
beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSkeleton } = await import("./index");
  pageTag = ensureCustomElement(PageSkeleton);
}, 30_000);
afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});
const collect = (root: Node): string => {
  let text = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return text.replace(/\s+/g, " ").trim();
};
const mount = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await new Promise((r) => setTimeout(r, 30));
  return collect(page);
};
describe("SkeletonPage locale", () => {
  it("renders Chinese docs", async () => {
    const text = await mount();
    expect(text).toContain("文字骨架");
    expect(text).toContain("仪表盘骨架");
    expect(text).toContain("自定义骨架模板");
  });
  it("renders strict English docs", async () => {
    document.documentElement.lang = "en-US";
    const text = await mount();
    expect(text).toContain("Text skeleton");
    expect(text).toContain("Dashboard skeleton");
    expect(text).toContain("Custom skeleton template");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
  it("keeps showcase placeholders compact", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await new Promise((resolve) => setTimeout(resolve, 30));
    const examples = Array.from(page.shadowRoot?.querySelectorAll<HTMLElement>("*") ?? []).filter(
      (element) => element.shadowRoot,
    );
    const card = examples.flatMap((example) =>
      Array.from(example.shadowRoot?.querySelectorAll<HTMLElement>("elf-card") ?? []),
    )[0];
    const image = card?.querySelector<HTMLElement>('elf-skeleton[variant="image"]');
    expect(card?.style.maxWidth).toBe("360px");
    expect(image?.getAttribute("height")).toBe("132px");
  });
});
