// elf-tag 测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-tag", () => {
  it("默认渲染 slot 内容", async () => {
    const el = document.createElement("elf-tag");
    el.textContent = "标签";
    document.body.appendChild(el);
    await tick();
    expect(el.textContent).toContain("标签");
  });

  it("closable 显示关闭按钮，点击 emit close", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("closable", "");
    document.body.appendChild(el);
    await tick();
    await tick();

    const closeBtn = el.shadowRoot!.querySelector(".close") as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();

    let closed = false;
    el.addEventListener("close", () => {
      closed = true;
    });
    closeBtn.click();
    await tick();
    expect(closed).toBe(true);
  });

  it("关闭按钮不会触发标签 click", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("closable", "");
    document.body.appendChild(el);
    await tick();
    await tick();

    let clicks = 0;
    el.addEventListener("click", () => clicks++);
    (el.shadowRoot!.querySelector(".close") as HTMLButtonElement).click();
    await tick();
    expect(clicks).toBe(0);
  });

  it("disabled 不渲染关闭按钮", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("closable", "");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelector(".close")).toBeNull();
  });

  it("color attribute 反射", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("color", "danger");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("color")).toBe("danger");
  });

  it("type 与 effect 映射为兼容的颜色和变体", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("type", "success");
    el.setAttribute("effect", "dark");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("color")).toBe("success");
    expect(el.getAttribute("variant")).toBe("filled");
  });

  it("支持任意 CSS 自定义颜色", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("color", "#7c3aed");
    document.body.appendChild(el);
    await tick();

    const tag = el.shadowRoot!.querySelector<HTMLElement>(".tag")!;
    expect(el.getAttribute("color")).toBe("#7c3aed");
    expect(tag.style.getPropertyValue("--_color")).toBe("#7c3aed");
    expect(tag.style.getPropertyValue("--_bg")).toContain("#7c3aed");
  });

  it("同步 hit 与 disable-transitions 状态", async () => {
    const el = document.createElement("elf-tag") as HTMLElement & {
      hit: boolean;
      disableTransitions: boolean;
    };
    document.body.appendChild(el);
    el.hit = true;
    el.disableTransitions = true;
    await tick();

    expect(el.hasAttribute("hit")).toBe(true);
    expect(el.hasAttribute("disable-transitions")).toBe(true);
  });

  it("未选中的 CheckTag 可点击切换并派发模型事件", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("checked", "false");
    el.textContent = "Selectable";
    document.body.appendChild(el);
    await tick();
    await tick();

    const values: boolean[] = [];
    el.addEventListener("update:checked", (event) => values.push((event as CustomEvent<boolean>).detail));
    const tag = el.shadowRoot!.querySelector<HTMLElement>(".tag")!;
    expect(tag.getAttribute("role")).toBe("button");
    expect(tag.getAttribute("tabindex")).toBe("0");
    expect(tag.getAttribute("aria-pressed")).toBe("false");
    expect(tag.getAttribute("aria-label")).toBe("Selectable");

    tag.click();
    await tick();
    expect(values).toEqual([true]);
    expect(tag.getAttribute("aria-pressed")).toBe("true");

    tag.click();
    await tick();
    expect(values).toEqual([true, false]);
    expect(tag.getAttribute("aria-pressed")).toBe("false");
  });

  it("CheckTag 支持 Enter 和 Space 键盘切换", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("checked", "false");
    document.body.appendChild(el);
    await tick();
    await tick();

    const tag = el.shadowRoot!.querySelector<HTMLElement>(".tag")!;
    tag.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect(tag.getAttribute("aria-pressed")).toBe("true");

    tag.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await tick();
    expect(tag.getAttribute("aria-pressed")).toBe("false");
  });

  it("外部 checked property 变化会同步内部状态", async () => {
    const el = document.createElement("elf-tag") as HTMLElement & { checked: boolean };
    el.setAttribute("checked", "false");
    document.body.appendChild(el);
    await tick();
    await tick();

    el.checked = true;
    await tick();
    expect(el.shadowRoot!.querySelector(".tag")!.getAttribute("aria-pressed")).toBe("true");

    el.checked = false;
    await tick();
    expect(el.shadowRoot!.querySelector(".tag")!.getAttribute("aria-pressed")).toBe("false");
  });

  it("disabled CheckTag 不可交互且暴露无障碍状态", async () => {
    const el = document.createElement("elf-tag");
    el.setAttribute("checked", "false");
    el.setAttribute("disabled", "");
    document.body.appendChild(el);
    await tick();
    await tick();

    let changes = 0;
    el.addEventListener("change", () => changes++);
    const tag = el.shadowRoot!.querySelector<HTMLElement>(".tag")!;
    tag.click();
    await tick();
    expect(changes).toBe(0);
    expect(tag.getAttribute("aria-disabled")).toBe("true");
    expect(tag.hasAttribute("tabindex")).toBe(false);
  });

  it("使用独立 label part 承载长内容并保留完整文本", async () => {
    const el = document.createElement("elf-tag");
    el.textContent = "需要人工复核的超长状态标签";
    document.body.appendChild(el);
    await tick();

    const label = el.shadowRoot!.querySelector<HTMLElement>('[part="label"]')!;
    expect(label).toBeTruthy();
    expect(label.querySelector("slot")?.assignedNodes().map((node) => node.textContent).join("")).toBe(
      "需要人工复核的超长状态标签"
    );
  });

  it("programmatic size、round 与 disabled 会反射到宿主", async () => {
    const el = document.createElement("elf-tag") as HTMLElement & {
      size: string;
      round: boolean;
      disabled: boolean;
    };
    document.body.appendChild(el);
    el.size = "lg";
    el.round = true;
    el.disabled = true;
    await tick();

    expect(el.getAttribute("size")).toBe("lg");
    expect(el.hasAttribute("round")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("非法 size 回退为 md", async () => {
    const el = document.createElement("elf-tag") as HTMLElement & { size: string };
    document.body.appendChild(el);
    el.size = "giant";
    await tick();

    expect(el.getAttribute("size")).toBe("md");
  });
});
