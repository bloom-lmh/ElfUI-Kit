import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSelectEx5 } = await import("./ex5");
  exampleTag = ensureCustomElement(PageSelectEx5);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const deepQuery = <T extends Element>(root: ParentNode, selector: string): T | null => {
  const direct = root.querySelector<T>(selector);
  if (direct) return direct;
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (element.shadowRoot) {
      const nested = deepQuery<T>(element.shadowRoot, selector);
      if (nested) return nested;
    }
  }
  return null;
};

describe("SelectPage", () => {
  it("远程案例提供完整脚本，并真实呈现加载失败状态", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const playground = deepQuery<HTMLElement & { script?: string }>(page.shadowRoot!, "elf-playground");
    const select = deepQuery<HTMLElement>(page.shadowRoot!, "elf-select");
    expect(playground?.script).toContain("requestVersion");
    expect(playground?.script).toContain("remoteLoading");
    expect(select?.textContent).toContain("输入 error 模拟失败");

    (select?.shadowRoot?.querySelector(".trigger") as HTMLElement).click();
    await wait();
    const input = select?.shadowRoot?.querySelector<HTMLInputElement>(".filter-input");
    expect(input).toBeTruthy();

    input!.value = "error";
    input!.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await wait(800);

    expect(select?.textContent).toContain("服务暂时不可用");
    expect(select?.shadowRoot?.querySelector('slot[name="empty"]')).toBeTruthy();
  });
});
