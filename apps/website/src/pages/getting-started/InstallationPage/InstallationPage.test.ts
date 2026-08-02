import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageInstallation } = await import("./index");
  pageTag = ensureCustomElement(PageInstallation);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const collectText = (root: Node): string => {
  let text = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return text.replace(/\s+/g, " ").trim();
};

const mount = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await new Promise((resolve) => setTimeout(resolve, 60));
  return page;
};

describe("InstallationPage locale", () => {
  it("renders complete Chinese installation docs", async () => {
    const page = await mount();
    const text = collectText(page);

    expect(text).toContain("安装");
    expect(text).toContain("环境要求");
    expect(text).toContain("创建项目");
    expect(text).toContain("安装组件库");
    expect(text).toContain("注册组件库");
    expect(text).toContain("使用组件");
    expect(text).toContain("验证安装");
    expect(text).toContain("下一步");
    expect(text).not.toContain("新项目推荐使用官方脚手架");
  });

  it("renders complete English installation docs without Han characters", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount();
    const text = collectText(page);

    expect(text).toContain("Installation");
    expect(text).toContain("Requirements");
    expect(text).toContain("Create a project");
    expect(text).toContain("Install the Kit");
    expect(text).toContain("Register the Kit");
    expect(text).toContain("Use a component");
    expect(text).toContain("Verify the installation");
    expect(text).toContain("Next steps");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("renders every code block with elf-code-card", async () => {
    const page = await mount();
    interface CodeCardProbe extends HTMLElement {
      code: string;
      items: Array<{ key: string }>;
    }
    const cards = Array.from(
      page.shadowRoot?.querySelectorAll("elf-code-card") || [],
    ) as Array<CodeCardProbe>;

    expect(cards.length).toBe(6);
    expect(cards.every((card) => Boolean(card.shadowRoot?.querySelector(".card-header")))).toBe(
      true,
    );
    expect(cards.every((card) => card.code.length > 0 || card.items.length > 0)).toBe(true);
    expect(page.shadowRoot?.querySelectorAll("elf-quote").length).toBeGreaterThanOrEqual(2);
    expect(page.shadowRoot?.querySelectorAll("elf-table").length).toBe(2);
    expect(page.shadowRoot?.querySelector(".create-section > h2")).toBeTruthy();
    expect(page.shadowRoot?.querySelector(".installation-next-card")).toBeTruthy();
    expect(page.shadowRoot?.querySelector(".installation-verify-row")).toBeTruthy();
    expect(page.shadowRoot?.querySelectorAll(".installation-next-card elf-link").length).toBe(1);
    expect(page.shadowRoot?.querySelector(".installation-reading-card")).toBeTruthy();
    expect(page.shadowRoot?.querySelectorAll(".installation-reading-card elf-link").length).toBe(2);
    expect(cards.filter((card) => card.items.length > 0).map((card) => card.items.length)).toEqual([
      4, 3, 2,
    ]);
  });
});
