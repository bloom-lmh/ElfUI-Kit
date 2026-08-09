import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { StepItem } from "./types";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface StepsEl extends HTMLElement {
  active?: number;
  direction?: string;
  items?: StepItem[];
  space?: string | number;
  processStatus?: string;
  finishStatus?: string;
  alignCenter?: boolean;
  simple?: boolean;
  size?: string;
  clickable?: boolean;
  alternativeLabel?: boolean;
  altLabels?: boolean;
  editable?: boolean;
  linear?: boolean;
  showPanels?: boolean;
  hideActions?: boolean;
  previousText?: string;
  nextText?: string;
  next?: () => void;
  prev?: () => void;
  setActive?: (index: number) => void;
}

const items: StepItem[] = [
  { title: "账号", description: "填写账号" },
  { title: "验证", description: "验证身份" },
  { title: "完成", description: "创建成功" },
];

const mount = async (patch: Partial<StepsEl> = {}): Promise<StepsEl> => {
  const el = document.createElement("elf-steps") as StepsEl;
  Object.assign(el, { items, active: 1, ...patch });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

const mountComposed = async (markup: string, patch: Partial<StepsEl> = {}): Promise<StepsEl> => {
  const el = document.createElement("elf-steps") as StepsEl;
  Object.assign(el, { active: 1, ...patch });
  el.innerHTML = markup;
  document.body.appendChild(el);
  await tick();
  await tick();
  await tick();
  return el;
};

describe("elf-steps", () => {
  it("根据 active 推断完成、当前和等待状态", async () => {
    const el = await mount();

    const nodes = Array.from(el.shadowRoot!.querySelectorAll(".step-item"));
    expect(nodes[0]!.className).toContain("is-finish");
    expect(nodes[1]!.className).toContain("is-process");
    expect(nodes[2]!.className).toContain("is-wait");
  });

  it("点击步骤触发受控 active 更新事件", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    (el.shadowRoot!.querySelectorAll(".step-button")[2] as HTMLElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(2);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      active: 2,
      item: items[2],
    });
    expect(el.shadowRoot!.querySelectorAll(".step-item")[2]!.className).toContain("is-active");
  });

  it("supports process-status and finish-status inference", async () => {
    const el = await mount({ processStatus: "error", finishStatus: "wait" });

    const nodes = Array.from(el.shadowRoot!.querySelectorAll(".step-item"));
    expect(nodes[0]!.className).toContain("is-wait");
    expect(nodes[1]!.className).toContain("is-error");
    expect(nodes[2]!.className).toContain("is-wait");
  });

  it("supports space, align-center and simple styles", async () => {
    const el = await mount({ space: 160, alignCenter: true, simple: true });
    const root = el.shadowRoot!.querySelector(".steps") as HTMLElement;

    expect(root.className).toContain("has-space");
    expect(root.className).toContain("is-align-center");
    expect(root.className).toContain("is-simple");
    expect(root.getAttribute("style")).toContain("--step-space: 160px");
  });

  it("disabled 步骤不可点击", async () => {
    const el = await mount({
      items: [items[0]!, { ...items[1]!, disabled: true }, items[2]!],
      active: 0,
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);

    (el.shadowRoot!.querySelectorAll(".step-button")[1] as HTMLElement).click();
    await tick();

    expect(onUpdate).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelectorAll(".step-item")[1]!.className).toContain("is-disabled");
  });

  it("支持垂直、尺寸和公开控制方法", async () => {
    const el = await mount({ direction: "vertical", size: "lg" });
    const onUpdate = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);

    expect(el.shadowRoot!.querySelector(".steps")!.className).toContain("is-vertical");
    expect(el.shadowRoot!.querySelector(".steps")!.className).toContain("size-lg");

    el.next!();
    await tick();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(2);

    el.setActive!(0);
    await tick();
    expect((onUpdate.mock.calls[1]![0] as CustomEvent).detail).toBe(0);
  });

  it("supports compositional steps with title, description and icon slots", async () => {
    const el = await mountComposed(`
      <elf-step title="创建项目" description="填写基础信息"></elf-step>
      <elf-step title="配置能力">
        <span slot="icon">CFG</span>
        <strong slot="title">配置能力</strong>
        <span slot="description">选择权限范围</span>
      </elf-step>
      <elf-step title="发布上线"></elf-step>
    `);
    const children = Array.from(el.querySelectorAll("elf-step")) as HTMLElement[];

    expect(el.shadowRoot!.querySelector(".steps")!.className).toContain("has-step-children");
    expect(children[0]!.getAttribute("data-status")).toBe("finish");
    expect(children[1]!.hasAttribute("data-active")).toBe(true);
    expect(children[2]!.getAttribute("data-status")).toBe("wait");
    expect(children[2]!.shadowRoot!.querySelector(".step-icon")!.textContent!.trim()).toBe("3");
    expect(
      children[1]!
        .shadowRoot!.querySelector<HTMLSlotElement>('slot[name="icon"]')!
        .assignedElements()[0]!.textContent,
    ).toBe("CFG");
    expect(
      children[1]!
        .shadowRoot!.querySelector<HTMLSlotElement>('slot[name="title"]')!
        .assignedElements()[0]!.textContent,
    ).toBe("配置能力");
  });

  it("emits the same public events from a compositional step", async () => {
    const el = await mountComposed(`
      <elf-step title="创建项目" value="create"></elf-step>
      <elf-step title="配置能力" value="config"></elf-step>
      <elf-step title="发布上线" value="publish"></elf-step>
    `);
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);
    el.addEventListener("change", onChange as EventListener);

    (
      el.querySelectorAll("elf-step")[2]!.shadowRoot!.querySelector("button") as HTMLButtonElement
    ).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(2);
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      active: 2,
      item: expect.objectContaining({ title: "发布上线", value: "publish" }),
    });
  });

  it("supports roving keyboard navigation and skips disabled steps", async () => {
    const el = await mountComposed(
      `
      <elf-step title="创建项目"></elf-step>
      <elf-step title="配置能力"></elf-step>
      <elf-step title="邀请成员" disabled></elf-step>
      <elf-step title="发布上线"></elf-step>
    `,
      { editable: true },
    );
    const onUpdate = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);
    const activeButton = el.querySelectorAll("elf-step")[1]!.shadowRoot!.querySelector("button")!;

    activeButton.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(3);
    expect(el.querySelectorAll("elf-step")[3]!.hasAttribute("data-active")).toBe(true);
  });

  it("keeps linear navigation on the defined path unless steps are editable", async () => {
    const el = await mount({ active: 0, linear: true, clickable: true });
    const onUpdate = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);

    (el.shadowRoot!.querySelectorAll(".step-button")[2] as HTMLButtonElement).click();
    await tick();
    expect(onUpdate).not.toHaveBeenCalled();

    const editableEl = await mount({ active: 0, linear: true, clickable: true, editable: true });
    editableEl.addEventListener("update:active", onUpdate as EventListener);
    (editableEl.shadowRoot!.querySelectorAll(".step-button")[2] as HTMLButtonElement).click();
    await tick();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(2);
  });

  it("keeps disabled and non-clickable compositional steps inert", async () => {
    const el = await mountComposed(
      `
      <elf-step title="创建项目"></elf-step>
      <elf-step title="配置能力"></elf-step>
    `,
      { active: 0, clickable: false },
    );
    const onUpdate = vi.fn();
    el.addEventListener("update:active", onUpdate as EventListener);

    (
      el.querySelectorAll("elf-step")[1]!.shadowRoot!.querySelector("button") as HTMLButtonElement
    ).click();
    await tick();

    expect(onUpdate).not.toHaveBeenCalled();
    expect(
      el
        .querySelectorAll("elf-step")[1]!
        .shadowRoot!.querySelector("button")!
        .getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("synchronizes controlled active updates and supports an empty items state", async () => {
    const el = await mount({ active: 0 });

    el.active = 2;
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".step-item")[2]!.className).toContain("is-active");

    el.items = [];
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".step-item")).toHaveLength(0);
  });

  it("renders an integrated stepper panel with configurable actions", async () => {
    const el = await mount({
      active: 1,
      showPanels: true,
      editable: true,
      altLabels: true,
      previousText: "返回",
      nextText: "继续",
      items: [
        { title: "第一步", content: "填写基本资料" },
        { title: "第二步", content: "配置访问权限" },
        { title: "第三步", content: "确认并发布" },
      ],
    });

    expect(el.shadowRoot!.querySelector(".stepper.has-panels")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".steps.is-alternative")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".stepper-panel")?.textContent).toContain("配置访问权限");
    const actions = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".stepper-action");
    expect(actions[0]!.textContent).toContain("返回");
    expect(actions[1]!.textContent).toContain("继续");
    actions[1]!.click();
    await tick();
    expect(el.shadowRoot!.querySelector(".stepper-panel")?.textContent).toContain("确认并发布");
  });

  it("can hide integrated stepper actions", async () => {
    const el = await mount({ showPanels: true, hideActions: true });
    expect(el.shadowRoot!.querySelector(".stepper-panel")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".stepper-actions")).toBeNull();
  });
});
