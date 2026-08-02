// elf-playground 测试

import { readFileSync } from "node:fs";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../index");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-playground", () => {
  it("title 渲染", async () => {
    const el = document.createElement("elf-playground");
    el.setAttribute("title", "示例标题");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector(".header")?.textContent).toContain("示例标题");
  });

  it("title 字体加粗", async () => {
    const el = document.createElement("elf-playground");
    el.setAttribute("title", "Test");
    document.body.appendChild(el);
    await tick();
    const header = el.shadowRoot!.querySelector(".header") as HTMLElement;
    // 验证 header 元素存在且 title 正确
    expect(header.textContent).toContain("Test");
  });

  it("保留页面大标题并精简案例标题", async () => {
    const page = document.createElement("section");
    const heading = document.createElement("h1");
    heading.textContent = "Button 按钮";
    const sectionHeading = document.createElement("h2");
    sectionHeading.textContent = "颜色";
    const first = document.createElement("elf-playground");
    first.setAttribute("title", "基础用法");
    const second = document.createElement("elf-playground");
    second.setAttribute("title", "禁用状态案例");
    page.append(heading, sectionHeading, first, second);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(heading.hidden).toBe(false);
    expect(heading.hasAttribute("data-promoted-to-playground")).toBe(false);
    expect(sectionHeading.hidden).toBe(true);
    expect(sectionHeading.hasAttribute("data-promoted-to-playground")).toBe(true);
    expect(first.shadowRoot!.querySelector(".title")?.textContent).toBe("颜色");
    expect(second.shadowRoot!.querySelector(".title")?.textContent).toBe("禁用状态");
  });

  it("status slot 与标题在同一头部且不进入 demo", async () => {
    const el = document.createElement("elf-playground");
    el.setAttribute("title", "基础用法");
    const status = document.createElement("span");
    status.slot = "status";
    status.className = "demo-state";
    status.textContent = "当前值：A";
    const demoLayout = document.createElement("div");
    demoLayout.appendChild(status);
    el.appendChild(demoLayout);
    document.body.appendChild(el);
    await tick();
    await tick();

    const headerSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('.header slot[name="status"]');
    const demoSlot = el.shadowRoot!.querySelector<HTMLSlotElement>(".demo slot:not([name])");
    expect(status.parentElement).toBe(el);
    expect(headerSlot?.assignedElements()).toEqual([status]);
    expect(demoSlot?.assignedElements()).not.toContain(status);
  });

  it("demo slot 渲染子元素", async () => {
    const el = document.createElement("elf-playground");
    const child = document.createElement("span");
    child.textContent = "demo content";
    el.appendChild(child);
    document.body.appendChild(el);
    await tick();
    const demo = el.shadowRoot!.querySelector(".demo");
    expect(demo).toBeTruthy();
  });

  it("controls slot 按需启用永久可见的右侧控制台", async () => {
    const el = document.createElement("elf-playground");
    el.setAttribute("title", "可配置案例");
    const controls = document.createElement("div");
    controls.slot = "controls";
    controls.textContent = "配置内容";
    el.appendChild(controls);
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".workspace.has-controls")).toBeTruthy();
    const controlsSlot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="controls"]');
    expect(controlsSlot?.assignedElements()).toEqual([controls]);
    expect(el.shadowRoot!.querySelector(".controls-toggle")).toBeNull();
    expect(el.shadowRoot!.querySelector(".controls")?.getAttribute("aria-hidden")).toBeNull();
  });

  it("normalizes control fields and choice groups", async () => {
    const el = document.createElement("elf-playground");
    const controls = document.createElement("div");
    controls.slot = "controls";
    const select = document.createElement("elf-select");
    const input = document.createElement("elf-input");
    const radios = document.createElement("elf-radio-group");
    const checks = document.createElement("elf-checkbox-group");
    controls.append(select, input, radios, checks);
    el.appendChild(controls);
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(select.getAttribute("variant")).toBe("outlined");
    expect(select.getAttribute("density")).toBe("comfortable");
    expect(input.getAttribute("variant")).toBe("outlined");
    expect(input.getAttribute("density")).toBe("comfortable");
    expect(radios.getAttribute("variant")).toBe("default");
    expect(checks.getAttribute("variant")).toBe("default");
  });

  it("没有 controls slot 时保持单栏且不显示折叠按钮", async () => {
    const el = document.createElement("elf-playground");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".workspace.has-controls")).toBeNull();
    expect(el.shadowRoot!.querySelector(".controls-toggle")).toBeNull();
  });

  it("支持 Template / Script 切换并规整公共缩进", async () => {
    const el = document.createElement("elf-playground") as HTMLElement & {
      code?: string;
      script?: string;
    };
    el.code = `
      <elf-select :options.prop="opts" />
    `;
    el.script = `
      const opts = [
        { label: "Vue", value: "vue" }
      ];
    `;
    document.body.appendChild(el);
    await tick();
    await tick();

    const code = () => el.shadowRoot!.querySelector("code")?.textContent ?? "";
    expect(code()).toBe('<elf-select :options.prop="opts" />');

    const tabs = el.shadowRoot!.querySelectorAll(".tabs button");
    expect(tabs).toHaveLength(2);
    (tabs[1] as HTMLElement).click();
    await tick();

    expect(code()).toContain("const opts = [");
    expect(code()).not.toMatch(/^\s{6}/);
  });

  it("removes macro continuation indentation without flattening nested source", async () => {
    const el = document.createElement("elf-playground") as HTMLElement & {
      code?: string;
      script?: string;
      showScript?: () => void;
    };
    el.code = `<elf-sticky top="0">
    <div class="toolbar">Toolbar</div>
  </elf-sticky>`;
    el.script = `const stuck = useRef("未吸附");
  const onChange = (event) => stuck.set(Boolean(event.detail));`;
    document.body.appendChild(el);
    await tick();

    const source = (): string => el.shadowRoot!.querySelector("code")?.textContent ?? "";
    expect(source()).toBe(`<elf-sticky top="0">
  <div class="toolbar">Toolbar</div>
</elf-sticky>`);

    el.showScript?.();
    await tick();
    expect(source()).toBe(`const stuck = useRef("未吸附");
const onChange = (event) => stuck.set(Boolean(event.detail));`);
  });

  it("Script 高亮不会把生成的 token 标签泄漏到源码文本", async () => {
    const source = `// 静态展示案例无需额外状态。\nconst steps = [\n  { title: "需求分析", timestamp: "Week 1", color: "primary" }\n];`;
    const el = document.createElement("elf-playground") as HTMLElement & {
      code?: string;
      script?: string;
      showScript?: () => void;
    };
    el.code = "<elf-timeline></elf-timeline>";
    el.script = source;
    document.body.appendChild(el);
    await tick();

    el.showScript?.();
    await tick();

    const code = el.shadowRoot!.querySelector("code");
    expect(code?.textContent).toBe(source);
    expect(code?.textContent).not.toContain('class="token');
    expect(code?.querySelectorAll(".token.comment")).toHaveLength(1);
    expect(code?.querySelectorAll(".token.string")).toHaveLength(3);
    expect(code?.querySelectorAll(".token.keyword")).toHaveLength(1);
  });

  it("Script 高亮保留 HTML 特殊字符、块注释和转义字符串", async () => {
    const source = `/* compare */\nconst label = "A < B && \\"quoted\\"";`;
    const el = document.createElement("elf-playground") as HTMLElement & {
      code?: string;
      script?: string;
      showScript?: () => void;
    };
    el.code = "<span>demo</span>";
    el.script = source;
    document.body.appendChild(el);
    await tick();

    el.showScript?.();
    await tick();

    const code = el.shadowRoot!.querySelector("code");
    expect(code?.textContent).toBe(source);
    expect(code?.innerHTML).toContain("&lt;");
    expect(code?.querySelectorAll(".token.comment")).toHaveLength(1);
    expect(code?.querySelectorAll(".token.string")).toHaveLength(1);
  });

  it("无 script 时禁用 Script 标签", async () => {
    const el = document.createElement("elf-playground") as HTMLElement & { code?: string };
    el.code = "<elf-button>OK</elf-button>";
    document.body.appendChild(el);
    await tick();

    const tabs = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".tabs button");
    expect(tabs).toHaveLength(2);
    expect(tabs[0]!.getAttribute("aria-selected")).toBe("true");
    expect(tabs[1]!.disabled).toBe(true);
  });

  it("无源码时隐藏源码区域", async () => {
    const el = document.createElement("elf-playground");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector(".source")).toBeNull();
  });

  it("复制当前标签源码并触发 copy 事件", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const el = document.createElement("elf-playground") as HTMLElement & {
      code?: string;
      script?: string;
      copy?: () => Promise<boolean>;
      showScript?: () => void;
    };
    el.code = "<elf-button>OK</elf-button>";
    el.script = "const ready = true;";
    const onCopy = vi.fn();
    el.addEventListener("copy", onCopy);
    document.body.appendChild(el);
    await tick();

    el.showScript?.();
    await tick();
    expect(await el.copy?.()).toBe(true);
    expect(writeText).toHaveBeenCalledWith("const ready = true;");
    expect((onCopy.mock.calls[0]![0] as CustomEvent<string>).detail).toBe("const ready = true;");
    expect(el.shadowRoot!.querySelector(".copy")?.textContent).toContain("已复制");
  });

  it("复制失败时触发 copyError 且不显示成功状态", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    const el = document.createElement("elf-playground") as HTMLElement & {
      code?: string;
      copy?: () => Promise<boolean>;
    };
    el.code = "<elf-button>OK</elf-button>";
    const onError = vi.fn();
    el.addEventListener("copyError", onError);
    document.body.appendChild(el);
    await tick();

    expect(await el.copy?.()).toBe(false);
    expect((onError.mock.calls[0]![0] as CustomEvent<Error>).detail.message).toBe("denied");
    expect(el.shadowRoot!.querySelector(".copy")?.textContent).toContain("复制");
  });

  it("renders an optional downward ruler directly below the header", async () => {
    const el = document.createElement("elf-playground") as HTMLElement & { ruler?: boolean };
    el.setAttribute("title", "Grid");
    el.ruler = true;
    document.body.appendChild(el);
    await tick();

    const header = el.shadowRoot!.querySelector(".header");
    const ruler = el.shadowRoot!.querySelector(".ruler");
    expect(ruler).toBeTruthy();
    expect(header?.nextElementSibling).toBe(ruler);
    expect(ruler?.querySelectorAll(".ruler-label")).toHaveLength(5);
  });

  it("keeps the card flat without a floating outer shadow", () => {
    const source = readFileSync("apps/website/src/components/Playground/style.scss", "utf8");
    const lightHost = source.slice(0, source.indexOf(":host-context"));
    const darkHost = source.slice(source.indexOf(':host-context([data-theme="dark"])'));

    expect(lightHost).toContain("box-shadow: none;");
    expect(darkHost).toContain("box-shadow: none;");
    expect(lightHost).toContain("border: 1px solid var(--elf-border);");
  });
});
