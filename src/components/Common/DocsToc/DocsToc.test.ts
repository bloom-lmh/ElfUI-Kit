import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const wait = (ms = 120): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("elf-docs-toc", () => {
  it("收集目标中的二、三级标题并点击滚动", async () => {
    const shell = document.createElement("div");
    const main = document.createElement("main");
    main.className = "docs-main";
    const section = document.createElement("h2");
    section.textContent = "基础用法";
    const example = document.createElement("h3");
    example.textContent = "可配置案例";
    const playground = document.createElement("elf-playground");
    playground.setAttribute("title", "交互案例");
    const runtimeHeading = document.createElement("h3");
    runtimeHeading.textContent = "运行时面板标题";
    playground.appendChild(runtimeHeading);
    const scrollIntoView = vi.fn();
    section.scrollIntoView = scrollIntoView;
    main.append(section, example, playground);

    const toc = document.createElement("elf-docs-toc") as HTMLElement & { target?: string; refresh?: () => void };
    toc.setAttribute("target", ".docs-main");
    shell.append(main, toc);
    document.body.appendChild(shell);
    toc.refresh?.();
    await wait();

    expect(section.dataset.docsTocId).toBeTruthy();
    const buttons = toc.shadowRoot!.querySelectorAll<HTMLButtonElement>(".item");
    expect(Array.from(buttons, (button) => button.textContent?.trim())).toEqual([
      "基础用法",
      "可配置案例",
      "交互案例"
    ]);
    expect(buttons[2]?.classList.contains("level-2")).toBe(true);
    buttons[0]!.click();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("无分组标题时仍收集 Playground 标题", async () => {
    const shell = document.createElement("div");
    const main = document.createElement("main");
    main.className = "ungrouped-docs-main";
    const playground = document.createElement("elf-playground");
    playground.setAttribute("title", "独立案例");
    main.appendChild(playground);

    const toc = document.createElement("elf-docs-toc") as HTMLElement & { refresh?: () => void };
    toc.setAttribute("target", ".ungrouped-docs-main");
    shell.append(main, toc);
    document.body.appendChild(shell);
    toc.refresh?.();
    await wait();

    expect(toc.shadowRoot?.querySelector(".item")?.textContent?.trim()).toBe("独立案例");
  });

  it("merges Props, Events, Expose, and Slots headings into one API item", async () => {
    const shell = document.createElement("div");
    const main = document.createElement("main");
    main.className = "api-docs-main";
    for (const label of ["Props", "Events", "Expose", "Slots"]) {
      const heading = document.createElement("h2");
      heading.textContent = label;
      main.appendChild(heading);
    }

    const toc = document.createElement("elf-docs-toc") as HTMLElement & { refresh?: () => void };
    toc.setAttribute("target", ".api-docs-main");
    shell.append(main, toc);
    document.body.appendChild(shell);
    toc.refresh?.();
    await wait();

    const labels = Array.from(
      toc.shadowRoot?.querySelectorAll<HTMLButtonElement>(".item") ?? [],
      (item) => item.textContent?.trim()
    );
    expect(labels).toEqual(["API"]);
  });

  it("scrolls promoted section titles to their visible Playground card", async () => {
    const shell = document.createElement("div");
    const main = document.createElement("main");
    main.className = "promoted-docs-main";
    const heading = document.createElement("h2");
    heading.textContent = "受控状态";
    heading.hidden = true;
    heading.setAttribute("data-promoted-to-playground", "");
    const playground = document.createElement("elf-playground");
    playground.setAttribute("title", "受控状态");
    const headingScroll = vi.fn();
    const playgroundScroll = vi.fn();
    heading.scrollIntoView = headingScroll;
    playground.scrollIntoView = playgroundScroll;
    main.append(heading, playground);

    const toc = document.createElement("elf-docs-toc") as HTMLElement & { refresh?: () => void };
    toc.setAttribute("target", ".promoted-docs-main");
    shell.append(main, toc);
    document.body.appendChild(shell);
    toc.refresh?.();
    await wait();

    toc.shadowRoot?.querySelector<HTMLButtonElement>(".item")?.click();
    expect(playgroundScroll).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(headingScroll).not.toHaveBeenCalled();
    expect(playground.dataset.docsTocId).toBeTruthy();
    expect(heading.dataset.docsTocId).toBeUndefined();
  });

  it("没有可导航标题时不渲染空目录", async () => {
    const shell = document.createElement("div");
    const main = document.createElement("main");
    main.className = "docs-main";
    const toc = document.createElement("elf-docs-toc") as HTMLElement & { target?: string };
    toc.setAttribute("target", ".docs-main");
    shell.append(main, toc);
    document.body.appendChild(shell);
    await wait();

    expect(toc.shadowRoot!.querySelector("nav")).toBeNull();
  });

  it("允许 Playground 显式声明平铺目录层级", async () => {
    const shell = document.createElement("div");
    const main = document.createElement("main");
    main.className = "flat-docs-main";
    const playground = document.createElement("elf-playground");
    playground.setAttribute("title", "平铺案例");
    playground.dataset.docsTocLevel = "2";
    main.appendChild(playground);

    const toc = document.createElement("elf-docs-toc") as HTMLElement & { refresh?: () => void };
    toc.setAttribute("target", ".flat-docs-main");
    shell.append(main, toc);
    document.body.appendChild(shell);
    toc.refresh?.();
    await wait();

    const item = toc.shadowRoot?.querySelector(".item");
    expect(item?.textContent?.trim()).toBe("平铺案例");
    expect(item?.classList.contains("level-2")).toBe(true);
    expect(item?.classList.contains("level-3")).toBe(false);
  });

  it("跨开放 Shadow Root 查找文档主区域", async () => {
    const shell = document.createElement("section");
    const shellRoot = shell.attachShadow({ mode: "open" });
    const main = document.createElement("main");
    main.className = "shadow-docs-main";
    const heading = document.createElement("h2");
    heading.textContent = "Shadow DOM 文档";
    main.appendChild(heading);
    shellRoot.appendChild(main);

    const toc = document.createElement("elf-docs-toc") as HTMLElement & { refresh?: () => void };
    toc.setAttribute("target", ".shadow-docs-main");
    document.body.append(shell, toc);
    toc.refresh?.();
    await wait();

    expect(toc.shadowRoot?.querySelector(".item")?.textContent?.trim()).toBe("Shadow DOM 文档");
  });
});
