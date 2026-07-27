import { afterEach, beforeAll, describe, expect, it } from "vitest";

let virtualTransferTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTransferEx4 } = await import("./ex4");
  virtualTransferTag = ensureCustomElement(PageTransferEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("TransferPage", () => {
  it("成员分配案例以虚拟窗口渲染并保留过滤空态", async () => {
    const page = document.createElement(virtualTransferTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const transfer = page.shadowRoot!.querySelector("elf-transfer")!;
    expect(transfer.shadowRoot!.querySelectorAll(".panel-left .panel-item").length).toBeLessThan(20);
    expect(transfer.shadowRoot!.querySelectorAll(".panel-right .panel-item")).toHaveLength(3);

    const input = transfer.shadowRoot!.querySelector<HTMLInputElement>(".panel-left .panel-filter input")!;
    input.value = "不存在的成员";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    expect(transfer.shadowRoot!.querySelector(".panel-left .panel-empty")?.textContent).toContain("没有匹配成员");
  });
});
