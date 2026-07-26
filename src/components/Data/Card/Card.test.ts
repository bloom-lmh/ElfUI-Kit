// elf-card 单元测试

import { readFileSync } from "node:fs";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("elf-card", () => {
  it("渲染默认卡片", async () => {
    const el = document.createElement("elf-card");
    el.textContent = "内容";
    document.body.appendChild(el);
    await tick();

    // 默认值不反映为 attribute，但 shadow 中有 .body
    expect(el.shadowRoot!.querySelector(".body")).toBeTruthy();
    expect(el.textContent).toContain("内容");
  });

  it("title + subtitle prop 渲染标题和副标题", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("title", "标题");
    el.setAttribute("subtitle", "副标题");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".title")!.textContent).toContain("标题");
    expect(el.shadowRoot!.querySelector(".subtitle")!.textContent).toBe("副标题");
  });

  it("supports Element Plus-compatible header, footer, classes, and body style props", async () => {
    const el = document.createElement("elf-card") as HTMLElement & {
      bodyStyle?: Record<string, string>;
    };
    el.setAttribute("header", "标题");
    el.setAttribute("footer", "页脚");
    el.setAttribute("header-class", "custom-header");
    el.setAttribute("body-class", "custom-body");
    el.setAttribute("footer-class", "custom-footer");
    el.bodyStyle = { color: "rgb(1, 2, 3)" };
    document.body.appendChild(el);
    await tick();

    const root = el.shadowRoot!;
    expect(root.querySelector(".header")?.textContent).toContain("标题");
    expect(root.querySelector(".footer")?.textContent).toContain("页脚");
    expect(root.querySelector(".header")?.classList.contains("custom-header")).toBe(true);
    expect(root.querySelector(".body")?.classList.contains("custom-body")).toBe(true);
    expect(root.querySelector(".footer")?.classList.contains("custom-footer")).toBe(true);
    expect(root.querySelector(".body")?.getAttribute("style")).toContain("color");
  });

  it.each(["always", "hover", "never"])("supports the %s shadow mode", async (shadow) => {
    const el = document.createElement("elf-card");
    el.setAttribute("shadow", shadow);
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("shadow")).toBe(shadow);
  });

  it.each(["elevated", "outlined", "filled", "tonal", "flat"])(
    "supports the %s surface variant",
    async (variant) => {
      const el = document.createElement("elf-card");
      el.setAttribute("variant", variant);
      document.body.appendChild(el);
      await tick();

      expect(el.getAttribute("variant")).toBe(variant);
    }
  );

  it.each(["default", "comfortable", "compact"])("supports %s density", async (density) => {
    const el = document.createElement("elf-card");
    el.setAttribute("density", density);
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("density")).toBe(density);
  });

  it("makes clickable cards keyboard accessible", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("clickable", "");
    document.body.appendChild(el);
    await tick();

    const content = el.shadowRoot!.querySelector(".card-content")!;
    let count = 0;
    el.addEventListener("click", () => count++);
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    content.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

    expect(content.getAttribute("role")).toBe("button");
    expect(content.getAttribute("tabindex")).toBe("0");
    expect(count).toBe(2);
  });

  it("does not emit an extra card activation for nested controls", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("clickable", "");
    el.setAttribute("title", "项目卡片");
    const action = document.createElement("button");
    action.type = "button";
    action.slot = "extra";
    action.textContent = "收藏";
    el.appendChild(action);
    document.body.appendChild(el);
    await tick();

    let nativeClicks = 0;
    let cardActivations = 0;
    el.addEventListener("click", (event) => {
      if (event instanceof CustomEvent) cardActivations++;
      else nativeClicks++;
    });
    action.click();
    action.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }));

    expect(nativeClicks).toBe(1);
    expect(cardActivations).toBe(0);
  });

  it.each(["disabled", "loading"])("locks clickable cards while %s", async (state) => {
    const el = document.createElement("elf-card");
    el.setAttribute("clickable", "");
    el.setAttribute(state, "");
    document.body.appendChild(el);
    await tick();

    const content = el.shadowRoot!.querySelector<HTMLElement>(".card-content")!;
    let count = 0;
    el.addEventListener("click", () => count++);
    content.click();
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(content.getAttribute("role")).toBe("button");
    expect(content.getAttribute("tabindex")).toBe("-1");
    expect(content.getAttribute("aria-disabled")).toBe("true");
    expect(count).toBe(0);
  });

  it("image prop 渲染封面图", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("image", "test.jpg");
    document.body.appendChild(el);
    await tick();

    const img = el.shadowRoot!.querySelector(".card-image-wrap img") as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain("test.jpg");
  });

  it("forwards image alt text and exposes a localized error state", async () => {
    const el = document.createElement("elf-card") as HTMLElement & {
      image?: string;
    };
    el.setAttribute("image", "/missing-cover.jpg");
    el.setAttribute("image-alt", "项目封面");
    document.body.appendChild(el);
    await tick();

    let loadCount = 0;
    let errorCount = 0;
    el.addEventListener("image-load", () => loadCount++);
    el.addEventListener("image-error", () => errorCount++);

    const image = el.shadowRoot!.querySelector<HTMLImageElement>(".card-image-wrap img")!;
    expect(image.alt).toBe("项目封面");
    image.dispatchEvent(new Event("error"));
    await tick();

    expect(errorCount).toBe(1);
    expect(el.hasAttribute("image-error")).toBe(true);
    expect(el.shadowRoot!.querySelector(".image-error")?.getAttribute("aria-label"))
      .toBe("图片暂时无法显示");

    el.image = "/logo.png";
    await tick();
    const recoveredImage = el.shadowRoot!.querySelector<HTMLImageElement>(".card-image-wrap img")!;
    expect(el.hasAttribute("image-error")).toBe(false);
    recoveredImage.dispatchEvent(new Event("load"));
    expect(loadCount).toBe(1);
  });

  it("overlay 渲染叠加文字", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("image", "test.jpg");
    el.setAttribute("overlay", "推荐");
    document.body.appendChild(el);
    await tick();

    const overlay = el.shadowRoot!.querySelector(".image-overlay")!;
    expect(overlay.textContent).toBe("推荐");
  });

  it("avatar 渲染头像", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("avatar", "avatar.jpg");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".avatar")).toBeTruthy();
  });

  it("horizontal 布局 image-placement=left", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("image", "test.jpg");
    el.setAttribute("image-placement", "left");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("image-placement")).toBe("left");
  });

  it("normalizes unsupported image placements", async () => {
    const el = document.createElement("elf-card");
    el.setAttribute("image-placement", "right");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("image-placement")).toBe("top");
  });

  it("footer slot 渲染", async () => {
    const el = document.createElement("elf-card");
    el.innerHTML = `<template #footer><button>确认</button></template>`;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".footer")).toBeTruthy();
  });

  it("cover 插槽接受没有文本内容的图片元素", async () => {
    const el = document.createElement("elf-card");
    const image = document.createElement("img");
    image.slot = "cover";
    image.src = "cover.jpg";
    image.alt = "封面";
    el.appendChild(image);
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.hasAttribute("has-cover")).toBe(true);
    expect(el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="cover"]')?.assignedElements())
      .toContain(image);
  });

  it("includes a reduced-motion fallback for cover and loading animation", () => {
    const cssText = readFileSync("src/components/Data/Card/style.scss", "utf8");
    expect(cssText).toContain("@media (prefers-reduced-motion: reduce)");
    expect(cssText).toContain(".loading-indicator");
    expect(cssText).toContain("animation: none");
  });
});
