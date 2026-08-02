import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { InputTag } from "./index";

beforeAll(() => {
  registerComponents(InputTag);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface InputTagEl extends HTMLElement {
  modelValue?: string[];
  placeholder?: string;
  collapseTags?: boolean;
  maxCollapseTags?: number;
}

const mount = async (patch: Partial<InputTagEl> = {}): Promise<InputTagEl> => {
  const el = document.createElement("elf-input-tag") as InputTagEl;
  Object.assign(el, { modelValue: ["Vue"], ...patch });
  document.body.appendChild(el);
  await tick();
  return el;
};

describe("elf-input-tag", () => {
  it("renders tags", async () => {
    const el = await mount();

    expect(el.shadowRoot!.querySelector("elf-tag")?.textContent).toContain("Vue");
  });

  it("adds tag on enter", async () => {
    const el = await mount({ modelValue: [] });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;

    input.value = "Elf";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["Elf"]);
  });

  it("reorders tags through drag and drop when draggable", async () => {
    const el = await mount({ modelValue: ["Vue", "Elf"] } as Partial<InputTagEl>);
    (el as HTMLElement & { draggable?: boolean }).draggable = true;
    await tick();
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    const tags = el.shadowRoot!.querySelectorAll("elf-tag");
    tags[0]!.dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    tags[1]!.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true }));

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["Elf", "Vue"]);
  });

  it("keeps surplus tags visible for a wrapping input layout", async () => {
    const el = await mount({
      modelValue: ["Vue", "React", "Solid"],
      collapseTags: true,
      maxCollapseTags: 1,
    });

    expect(el.shadowRoot!.querySelectorAll("elf-tag")).toHaveLength(3);
    expect(el.shadowRoot!.querySelector(".overflow-count")).toBeNull();
    expect(el.shadowRoot!.querySelector(".tag-strip")?.textContent).toContain("Solid");
    expect(
      el.shadowRoot!.querySelector("elf-tag")?.shadowRoot?.querySelector(".close svg"),
    ).toBeTruthy();
  });

  it("allows deleting every visible tag after wrapping", async () => {
    const el = await mount({
      modelValue: ["Vue", "React", "Solid"],
      collapseTags: true,
      maxCollapseTags: 1,
    });
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);

    const tags = el.shadowRoot!.querySelectorAll("elf-tag");
    expect(tags).toHaveLength(3);
    expect(tags[1]?.textContent).toContain("React");
    (tags[1]!.shadowRoot!.querySelector(".close") as HTMLButtonElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toEqual(["Vue", "Solid"]);
    expect(
      [...el.shadowRoot!.querySelectorAll("elf-tag")].map((tag) => tag.textContent?.trim()),
    ).toEqual(["Vue", "Solid"]);
  });

  it("reuses elf-tag semantics for type, effect, size, and close", async () => {
    const el = await mount({ modelValue: ["Elf"] });
    Object.assign(el, { tagType: "success", tagEffect: "plain", size: "lg" });
    await tick();

    const tag = el.shadowRoot!.querySelector("elf-tag") as HTMLElement & {
      closable?: boolean;
      size?: string;
    };
    expect(tag.getAttribute("type")).toBe("success");
    expect(tag.getAttribute("effect")).toBe("plain");
    expect(tag.size).toBe("lg");
    expect(tag.closable).toBe(true);
  });

  it("uses the outlined shared field surface by default", async () => {
    const el = await mount({ modelValue: [], label: "Tags" });
    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.hasAttribute("data-has-label")).toBe(true);
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Tags");
  });

  it("keeps the outlined frame when label is omitted", async () => {
    const el = await mount({ modelValue: [] });
    expect(el.shadowRoot!.querySelector(".field-outline")).toBeTruthy();
  });

  it("keeps breathing room above and below wrapped tags", async () => {
    const el = await mount({
      label: "Tags",
      modelValue: Array.from({ length: 16 }, (_, index) => `Tag ${index + 1}`),
    });
    const strip = el.shadowRoot!.querySelector<HTMLElement>(".tag-strip")!;

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.hasAttribute("data-has-label")).toBe(true);
    expect(strip).toBeTruthy();
    expect(strip.querySelectorAll("elf-tag")).toHaveLength(16);
  });
});
