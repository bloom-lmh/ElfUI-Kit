import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Autocomplete } from "./index";

beforeAll(() => {
  registerComponents(Autocomplete);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

interface AutocompleteEl extends HTMLElement {
  modelValue?: string;
  clearable?: boolean;
  options?: unknown[];
  fetchSuggestions?: (query: string) => Promise<unknown[]>;
  debounce?: number;
  highlightFirstItem?: boolean;
  allowCreate?: boolean;
  createText?: string;
  virtual?: boolean;
  itemHeight?: number;
  maxHeight?: number;
  overscan?: number;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  fitInputWidth?: boolean;
  popperOptions?: Record<string, unknown>;
  noDataText?: string;
  errorText?: string;
}

describe("elf-autocomplete", () => {
  it("keeps the clear action overlaid at the field end without changing field flow", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.modelValue = "Vue";
    el.clearable = true;
    document.body.appendChild(el);
    await tick();

    const clear = el.shadowRoot!.querySelector<HTMLButtonElement>(".clear")!;
    expect(clear).toBeTruthy();
    expect(clear.parentElement?.classList.contains("field")).toBe(true);
  });

  it("filters and selects options", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "apple" }, { value: "banana" }];
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "app";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    (el.shadowRoot!.querySelector(".option") as HTMLButtonElement).dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    );
    expect(onSelect).toHaveBeenCalled();
  });

  it("filters local suggestions using the current query", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "Vue" }, { value: "React" }];
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "r";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    expect(el.shadowRoot!.textContent).toContain("React");
    expect(el.shadowRoot!.textContent).not.toContain("Vue");
    expect(el.shadowRoot!.querySelector(".panel")?.getAttribute("role")).toBe("listbox");
  });

  it("selects the option that is currently rendered after a previous selection", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "Vue" }, { value: "React" }];
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "Vue";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    (el.shadowRoot!.querySelector(".option") as HTMLButtonElement).dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    );
    await tick();

    input.value = "React";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".option")?.textContent).toContain("React");
    (el.shadowRoot!.querySelector(".option") as HTMLButtonElement).dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    );

    expect((onSelect.mock.calls.at(-1)![0] as CustomEvent).detail.value).toBe("React");
  });

  it("uses keyboard navigation and accessible combobox semantics", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "apple" }, { value: "banana" }];
    el.highlightFirstItem = true;
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await tick();
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-expanded")).toBe("true");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect(onChange).toHaveBeenCalled();
  });

  it("opens local suggestions on a native focus event", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "Vue" }, { value: "React" }];
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.focus();
    await tick();

    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(el.shadowRoot!.querySelectorAll(".option")).toHaveLength(2);
  });

  it("opens local suggestions when a pointer focuses the input", async () => {
    const el = document.createElement("elf-autocomplete") as HTMLElement & Record<string, unknown>;
    el.options = [{ value: "Vue" }, { value: "React" }];
    el.triggerOnFocus = true;
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input")!;
    input.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await tick();

    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(el.shadowRoot!.querySelectorAll(".option")).toHaveLength(2);
  });

  it("creates a non-existing value from the keyboard", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = [{ value: "Vue" }, { value: "React" }];
    el.allowCreate = true;
    el.createText = "创建";
    el.highlightFirstItem = true;
    const onCreate = vi.fn();
    const onSelect = vi.fn();
    const onDocumentKeydown = vi.fn();
    el.addEventListener("create", onCreate as EventListener);
    el.addEventListener("select", onSelect as EventListener);
    document.addEventListener("keydown", onDocumentKeydown);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "Svelte";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    const createOption = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-create="true"]');
    expect(createOption?.textContent).toContain("创建");
    expect(createOption?.textContent).toContain("Svelte");

    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect((onCreate.mock.calls[0]![0] as CustomEvent).detail).toEqual({
      label: "Svelte",
      value: "Svelte",
    });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onDocumentKeydown).not.toHaveBeenCalled();
    document.removeEventListener("keydown", onDocumentKeydown);
  });

  it("virtualizes long suggestions and keeps keyboard navigation in view", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.options = Array.from({ length: 100 }, (_, index) => ({
      label: `成员 ${String(index + 1).padStart(3, "0")}`,
      value: `member-${index + 1}`,
    }));
    el.virtual = true;
    el.itemHeight = 32;
    el.maxHeight = 160;
    el.overscan = 2;
    el.highlightFirstItem = true;
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await tick();

    const viewport = el.shadowRoot!.querySelector<HTMLElement>(".options-viewport")!;
    expect(viewport.dataset.virtualized).toBe("true");
    expect(el.shadowRoot!.querySelectorAll(".option").length).toBeLessThan(20);
    expect(el.shadowRoot!.querySelector<HTMLElement>(".options-track")!.style.height).toBe(
      "3200px",
    );

    for (let index = 0; index < 15; index += 1) {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    }
    await tick();
    await tick();

    expect(viewport.scrollTop).toBeGreaterThan(0);
    expect(input.getAttribute("aria-activedescendant")).toContain("option-15");
  });

  it("debounces remote suggestions and ignores an older response", async () => {
    let resolveFirst: ((value: unknown[]) => void) | undefined;
    const fetchSuggestions = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<unknown[]>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce([{ value: "new" }]);
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.fetchSuggestions = fetchSuggestions;
    el.debounce = 0;
    document.body.appendChild(el);
    await tick();
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;

    input.value = "old";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    input.value = "new";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    resolveFirst?.([{ value: "old" }]);
    await tick();

    expect(fetchSuggestions).toHaveBeenCalledTimes(2);
    expect(el.shadowRoot!.textContent).toContain("new");
    expect(el.shadowRoot!.textContent).not.toContain("old");
  });

  it("renders an accessible empty state after a remote request resolves", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.fetchSuggestions = vi.fn().mockResolvedValue([]);
    el.debounce = 0;
    el.noDataText = "没有匹配建议";
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "missing";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    await tick();

    const panel = el.shadowRoot!.querySelector(".panel") as HTMLElement;
    expect(panel.getAttribute("role")).toBe("status");
    expect(panel.textContent).toContain("没有匹配建议");
    expect(input.getAttribute("aria-expanded")).toBe("true");
  });

  it("turns a rejected remote request into an error state and can recover", async () => {
    const error = new Error("network unavailable");
    const fetchSuggestions = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce([{ value: "recovered" }]);
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.fetchSuggestions = fetchSuggestions;
    el.debounce = 0;
    el.errorText = "建议加载失败，请重试";
    const onError = vi.fn();
    el.addEventListener("fetch-error", onError as EventListener);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "error";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    await tick();

    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0]![0] as CustomEvent).detail).toBe(error);
    expect(el.shadowRoot!.querySelector(".panel")?.textContent).toContain("建议加载失败，请重试");

    input.value = "recovered";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".panel")?.getAttribute("role")).toBe("listbox");
    expect(el.shadowRoot!.textContent).toContain("recovered");
  });

  it("keeps a non-teleported panel positioned inside the component", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.teleported = false;
    el.options = [{ value: "Vue" }];
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await tick();

    const panel = el.shadowRoot!.querySelector(".panel") as HTMLElement;
    expect(panel.getAttribute("popover")).toBeNull();
    expect(panel.classList.contains("is-teleported")).toBe(false);
  });

  it("gives one Escape event to only the topmost suggestion panel", async () => {
    const first = document.createElement("elf-autocomplete") as AutocompleteEl;
    const second = document.createElement("elf-autocomplete") as AutocompleteEl;
    first.options = [{ value: "First" }];
    second.options = [{ value: "Second" }];
    document.body.append(first, second);
    await tick();

    first
      .shadowRoot!.querySelector<HTMLInputElement>("input")!
      .dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    second
      .shadowRoot!.querySelector<HTMLInputElement>("input")!
      .dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await tick();
    expect(first.shadowRoot!.querySelector(".panel")).toBeTruthy();
    expect(second.shadowRoot!.querySelector(".panel")).toBeTruthy();

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      }),
    );
    await tick();
    expect(first.shadowRoot!.querySelector(".panel")).toBeTruthy();
    expect(second.shadowRoot!.querySelector(".panel")).toBeNull();

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      }),
    );
    await tick();
    expect(first.shadowRoot!.querySelector(".panel")).toBeNull();
  });

  it("closes a top-layer panel on external scroll", async () => {
    const originalShow = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "showPopover");
    const originalHide = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "hidePopover");
    const showPopover = vi.fn();
    const hidePopover = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "showPopover", {
      configurable: true,
      value: showPopover,
    });
    Object.defineProperty(HTMLElement.prototype, "hidePopover", {
      configurable: true,
      value: hidePopover,
    });

    try {
      const el = document.createElement("elf-autocomplete") as AutocompleteEl;
      el.options = [{ value: "Vue" }, { value: "React" }];
      el.appendTo = "#overlay-root";
      el.fitInputWidth = true;
      el.popperOptions = {
        modifiers: [
          { name: "offset", options: { offset: [12, 18] } },
          { name: "preventOverflow", options: { padding: 10 } },
        ],
      };
      document.body.appendChild(el);
      await tick();

      const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
      const anchorLeft = 100;
      input.getBoundingClientRect = vi.fn(() => ({
        left: anchorLeft,
        top: 100,
        right: anchorLeft + 240,
        bottom: 134,
        width: 240,
        height: 34,
        x: anchorLeft,
        y: 100,
        toJSON: () => ({}),
      })) as unknown as Element["getBoundingClientRect"];
      input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
      await tick();

      const panel = el.shadowRoot!.querySelector(".panel") as HTMLElement;
      panel.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        right: 240,
        bottom: 96,
        width: 240,
        height: 96,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      })) as unknown as Element["getBoundingClientRect"];
      window.dispatchEvent(new Event("resize"));
      await frame();
      await tick();

      expect(showPopover).toHaveBeenCalled();
      expect(panel.getAttribute("popover")).toBe("manual");
      expect(panel.dataset.appendTo).toBe("#overlay-root");
      expect(panel.style.position).toBe("fixed");
      expect(panel.style.left).toBe("112px");
      expect(panel.style.top).toBe("152px");
      expect(panel.style.width).toBe("240px");

      panel.dispatchEvent(new Event("scroll", { bubbles: true, composed: true }));
      await tick();
      expect(input.getAttribute("aria-expanded")).toBe("true");

      window.dispatchEvent(new Event("scroll"));
      await frame();
      await tick();
      expect(input.getAttribute("aria-expanded")).toBe("false");
      expect(el.shadowRoot!.querySelector(".panel")).toBeNull();
    } finally {
      if (originalShow) Object.defineProperty(HTMLElement.prototype, "showPopover", originalShow);
      else delete (HTMLElement.prototype as HTMLElement & { showPopover?: () => void }).showPopover;
      if (originalHide) Object.defineProperty(HTMLElement.prototype, "hidePopover", originalHide);
      else delete (HTMLElement.prototype as HTMLElement & { hidePopover?: () => void }).hidePopover;
    }
  });

  it("reflects the shared field surface contract", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    el.setAttribute("variant", "outlined");
    el.setAttribute("label", "Framework");
    document.body.appendChild(el);
    await tick();

    expect(el.getAttribute("variant")).toBe("outlined");
    expect(el.hasAttribute("data-has-label")).toBe(true);
    expect(el.shadowRoot!.querySelector(".field-label")?.textContent).toBe("Framework");
    expect(el.shadowRoot!.querySelector(".field-outline legend")?.textContent).toBe("Framework");
  });

  it("uses the filled field surface by default", async () => {
    const el = document.createElement("elf-autocomplete") as AutocompleteEl;
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("variant")).toBe("filled");
  });

  it.each(["default", "underlined", "solo", "solo-filled", "solo-inverted"])(
    "reflects the shared %s field variant",
    async (variant) => {
      const el = document.createElement("elf-autocomplete") as AutocompleteEl;
      el.setAttribute("variant", variant);
      document.body.appendChild(el);
      await tick();
      expect(el.getAttribute("variant")).toBe(variant);
    },
  );
});
