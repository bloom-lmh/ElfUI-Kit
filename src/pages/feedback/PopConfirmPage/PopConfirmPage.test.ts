import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let customExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PagePopConfirmEx2 } = await import("./ex2");
  const { PagePopConfirmEx3 } = await import("./ex3");
  exampleTag = ensureCustomElement(PagePopConfirmEx2);
  customExampleTag = ensureCustomElement(PagePopConfirmEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("PopConfirmPage", () => {
  it("异步案例先展示失败并允许原地重试", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const popConfirm = page.shadowRoot!.querySelector<HTMLElement & { visible?: boolean }>(
      'elf-pop-confirm[trigger="manual"]'
    )!;
    popConfirm.visible = true;
    await wait();

    popConfirm.shadowRoot!.querySelector<HTMLButtonElement>(".pop-confirm-action.primary")!.click();
    await wait(950);
    expect(page.shadowRoot!.textContent).toContain("校验失败，请在气泡内重试");
    expect(popConfirm.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();

    popConfirm.shadowRoot!.querySelector<HTMLButtonElement>(".pop-confirm-action.primary")!.click();
    await wait(950);
    expect(page.shadowRoot!.textContent).toContain("已提交审批");
  });

  it("teleport 案例通过 actions 插槽驱动公开确认方法", async () => {
    const page = document.createElement(customExampleTag);
    document.body.appendChild(page);
    await wait();

    const playground = page.shadowRoot!.querySelector<HTMLElement & { code?: string }>("elf-playground")!;
    expect(playground.code).toContain("teleported");
    expect(playground.code).toContain('slot="actions"');
    const popConfirm = page.shadowRoot!.querySelector<HTMLElement>(".custom-confirm")!;
    popConfirm.shadowRoot!.querySelector<HTMLElement>(".pop-confirm")!.click();
    await wait();

    const actions = popConfirm.querySelectorAll<HTMLElement>('[slot="actions"] elf-button');
    expect(actions).toHaveLength(2);
    actions[1]!.click();
    await wait();
    expect(page.shadowRoot!.textContent).toContain("版本已发布");
  });
});
