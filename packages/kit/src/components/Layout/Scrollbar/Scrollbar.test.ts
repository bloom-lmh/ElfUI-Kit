import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Scrollbar } from "./index";
import type { ScrollbarExpose } from "./types";

beforeAll(() => {
  registerComponents(Scrollbar);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ScrollbarEl extends HTMLElement, ScrollbarExpose {
  height?: number | string;
  maxHeight?: number | string;
}

const wrap = (el: ScrollbarEl): HTMLElement => el.shadowRoot!.querySelector(".wrap") as HTMLElement;

describe("elf-scrollbar", () => {
  it("emits scroll detail", async () => {
    const el = document.createElement("elf-scrollbar") as ScrollbarEl;
    el.height = 120;
    const onScroll = vi.fn();
    el.addEventListener("scroll", onScroll as EventListener);
    document.body.appendChild(el);
    await tick();
    const target = wrap(el);
    Object.defineProperty(target, "scrollTop", { value: 12, configurable: true });

    target.dispatchEvent(new Event("scroll"));

    expect((onScroll.mock.calls[0]![0] as CustomEvent).detail.scrollTop).toBe(12);
  });

  it("inline height on .wrap when height is set", async () => {
    const el = document.createElement("elf-scrollbar") as ScrollbarEl;
    el.height = 260;
    document.body.appendChild(el);
    await tick();

    expect(wrap(el).style.height).toBe("260px");
  });

  it("accepts string height and max-height", async () => {
    const el = document.createElement("elf-scrollbar") as ScrollbarEl;
    el.maxHeight = "280px";
    document.body.appendChild(el);
    await tick();

    expect(wrap(el).style.maxHeight).toBe("280px");
  });

  it("leaves height unset when default auto", async () => {
    const el = document.createElement("elf-scrollbar") as ScrollbarEl;
    document.body.appendChild(el);
    await tick();

    expect(wrap(el).style.height).toBe("");
    expect(wrap(el).style.maxHeight).toBe("");
  });

  it("reflects native attribute by default", async () => {
    const el = document.createElement("elf-scrollbar") as ScrollbarEl;
    document.body.appendChild(el);
    await tick();

    expect(el.hasAttribute("native")).toBe(true);
  });

  it("exposes setScrollTop / setScrollLeft / update", async () => {
    const el = document.createElement("elf-scrollbar") as ScrollbarEl;
    el.height = 100;
    document.body.appendChild(el);
    await tick();

    const target = wrap(el);
    Object.defineProperty(target, "scrollTop", { value: 0, configurable: true, writable: true });
    Object.defineProperty(target, "scrollLeft", { value: 0, configurable: true, writable: true });

    el.setScrollTop(40);
    el.setScrollLeft(15);
    el.update();

    expect(target.scrollTop).toBe(40);
    expect(target.scrollLeft).toBe(15);
    expect(el.wrapRef).toBe(target);
  });
});
