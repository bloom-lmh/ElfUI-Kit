// elf-avatar 单元测试

import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((r) => queueMicrotask(r));

describe("elf-avatar", () => {
  it("无 src 和 icon 时显示首字母缩写", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("alt", "张三");
    document.body.appendChild(el);
    await tick();

    const avatar = el.shadowRoot!.querySelector(".avatar")!;
    expect(avatar).toBeTruthy();
    const initials = avatar.querySelector(".initials")!;
    expect(initials.textContent).toBe("张三");
  });

  it("两个单词的 alt 取两字首字母", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("alt", "Jane Doe");
    document.body.appendChild(el);
    await tick();

    const initials = el.shadowRoot!.querySelector(".initials")!;
    expect(initials.textContent).toBe("JD");
  });

  it("alt 超过两字时只取前两个字符", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("alt", "Admin");
    document.body.appendChild(el);
    await tick();

    const initials = el.shadowRoot!.querySelector(".initials")!;
    expect(initials.textContent).toBe("AD");
  });

  it("有 icon 时显示图标", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("icon", "★");
    document.body.appendChild(el);
    await tick();

    const icon = el.shadowRoot!.querySelector(".icon")!;
    expect(icon).toBeTruthy();
    expect(icon.textContent).toBe("★");
  });

  it("有 src 时显示 img 元素", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("src", "https://example.com/img.jpg");
    el.setAttribute("alt", "Test");
    document.body.appendChild(el);
    await tick();

    const img = el.shadowRoot!.querySelector("img")!;
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe("https://example.com/img.jpg");
  });

  it("forwards src-set and normalizes fit", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("src", "https://example.com/avatar.png");
    el.setAttribute("src-set", "avatar.png 1x, avatar@2x.png 2x");
    el.setAttribute("fit", "contain");
    document.body.appendChild(el);
    await tick();

    const img = el.shadowRoot!.querySelector("img")!;
    expect(img.getAttribute("srcset")).toContain("avatar@2x.png 2x");
    expect(el.getAttribute("fit")).toBe("contain");
  });

  it("emits error and renders the fallback after image failure", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("src", "https://example.com/missing.png");
    el.setAttribute("alt", "Jane Doe");
    document.body.appendChild(el);
    await tick();

    let error: Event | undefined;
    el.addEventListener("error", (event) => {
      error = (event as CustomEvent<Event>).detail;
    });
    el.shadowRoot!.querySelector("img")!.dispatchEvent(new Event("error"));
    await tick();

    expect(error).toBeInstanceOf(Event);
    expect(el.shadowRoot!.querySelector("img")).toBeNull();
    expect(el.shadowRoot!.querySelector(".initials")?.textContent).toBe("JD");
    expect(el.shadowRoot!.querySelector(".avatar")?.getAttribute("role")).toBe("img");
    expect(el.shadowRoot!.querySelector(".avatar")?.getAttribute("aria-label")).toBe("Jane Doe");
  });

  it("uses native image semantics while the source is available", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("src", "https://example.com/avatar.png");
    el.setAttribute("alt", "Ada Lovelace");
    document.body.appendChild(el);
    await tick();

    const avatar = el.shadowRoot!.querySelector(".avatar")!;
    expect(avatar.hasAttribute("role")).toBe(false);
    expect(avatar.hasAttribute("aria-label")).toBe(false);
    expect(el.shadowRoot!.querySelector("img")?.getAttribute("alt")).toBe("Ada Lovelace");
  });

  it("renders an icon slot even without the icon prop", async () => {
    const el = document.createElement("elf-avatar");
    el.innerHTML = '<span slot="icon">◎</span>';
    document.body.appendChild(el);
    await tick();

    const iconSlot = el.shadowRoot!.querySelector('slot[name="icon"]') as HTMLSlotElement;
    expect(iconSlot.assignedNodes()[0]?.textContent).toContain("◎");
  });

  it("size 属性反射到 host", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("size", "lg");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("size")).toBe("lg");
    expect(el.shadowRoot!.querySelector(".avatar")).toBeTruthy();
  });

  it("shape 属性反射到 host", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("shape", "square");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("shape")).toBe("square");
  });

  it("color 属性设置自定义背景色", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("alt", "X");
    el.setAttribute("color", "#7b1fa2");
    document.body.appendChild(el);
    await tick();

    const avatar = el.shadowRoot!.querySelector(".avatar") as HTMLElement;
    expect(["#7b1fa2", "rgb(123, 31, 162)"]).toContain(avatar.style.backgroundColor);
  });

  it("无 alt 时使用哈希颜色作为背景", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("alt", "Test");
    document.body.appendChild(el);
    await tick();

    const avatar = el.shadowRoot!.querySelector(".avatar") as HTMLElement;
    expect(avatar.style.backgroundColor).toBeTruthy();
    expect(avatar.style.backgroundColor).not.toBe("");
  });

  it("part 属性可被外部 ::part(avatar) 选中", async () => {
    const el = document.createElement("elf-avatar");
    el.setAttribute("alt", "A");
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector("[part='avatar']")).toBeTruthy();
  });
});
