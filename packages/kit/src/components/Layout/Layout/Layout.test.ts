// Layout / Header / Aside / Main / Footer 测试

import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Aside } from "../Aside";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Main } from "../Main";
import { Layout } from "./index";

beforeAll(() => {
  registerComponents(Layout, Header, Aside, Main, Footer);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-layout", () => {
  it("没有 Aside 时自动解析为 vertical", async () => {
    const el = document.createElement("elf-layout");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
    expect(el.getAttribute("data-direction")).toBe("vertical");
  });

  it("direction=horizontal 解析到布局状态", async () => {
    const el = document.createElement("elf-layout");
    el.setAttribute("direction", "horizontal");
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("direction")).toBe("horizontal");
    expect(el.getAttribute("data-direction")).toBe("horizontal");
  });

  it("直接包含 Aside 时自动解析为 horizontal", async () => {
    const el = document.createElement("elf-layout");
    el.appendChild(document.createElement("elf-aside"));
    el.appendChild(document.createElement("elf-main"));
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("data-direction")).toBe("horizontal");
  });

  it("显式 vertical 优先于 Aside 自动推断", async () => {
    const el = document.createElement("elf-layout");
    el.setAttribute("direction", "vertical");
    el.appendChild(document.createElement("elf-aside"));
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("data-direction")).toBe("vertical");
  });

  it("slot 内容变化后重新推断方向", async () => {
    const el = document.createElement("elf-layout");
    document.body.appendChild(el);
    await tick();
    const slot = el.shadowRoot!.querySelector("slot")!;
    el.appendChild(document.createElement("elf-aside"));
    slot.dispatchEvent(new Event("slotchange"));
    await tick();
    expect(el.getAttribute("data-direction")).toBe("horizontal");

    el.querySelector("elf-aside")!.remove();
    slot.dispatchEvent(new Event("slotchange"));
    await tick();
    expect(el.getAttribute("data-direction")).toBe("vertical");
  });
});

describe("elf-header", () => {
  it("height prop 写入 css var", async () => {
    const el = document.createElement("elf-header") as HTMLElement & { height?: string };
    el.setAttribute("height", "56px");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("56px");
  });
});

describe("elf-aside", () => {
  it("width prop 写入 css var", async () => {
    const el = document.createElement("elf-aside");
    el.setAttribute("width", "200px");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_width")).toBe("200px");
  });
});

describe("elf-main / elf-footer", () => {
  it("elf-main 渲染", async () => {
    const el = document.createElement("elf-main");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });

  it("elf-footer height 写入 css var", async () => {
    const el = document.createElement("elf-footer");
    el.setAttribute("height", "40px");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("40px");
  });
});
