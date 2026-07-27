import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const sampleData = [
  { key: "1", label: "Item 1" },
  { key: "2", label: "Item 2" },
  { key: "3", label: "Item 3" },
  { key: "4", label: "Item 4" }
];

const mount = async (configure?: (el: any) => void): Promise<any> => {
  const el = document.createElement("elf-transfer") as any;
  el.data = sampleData;
  configure?.(el);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-transfer", () => {
  it("renders source, target, and action controls", async () => {
    const el = await mount();
    expect(el.shadowRoot!.querySelector(".panel-left")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".panel-right")).toBeTruthy();
    expect(el.shadowRoot!.querySelectorAll(".buttons button")).toHaveLength(2);
    expect(el.shadowRoot!.querySelectorAll(".panel-left .panel-item")).toHaveLength(4);
    expect(el.shadowRoot!.querySelector(".direction-icon.is-right")).not.toBeNull();
    expect(el.shadowRoot!.querySelector(".direction-icon.is-left")).not.toBeNull();
    expect(Array.from(el.shadowRoot!.querySelectorAll(".buttons button"), (button) => button.textContent?.trim())).toEqual(["", ""]);
  });

  it("keeps custom button texts instead of rendering default direction icons", async () => {
    const el = await mount((transfer) => {
      transfer.buttonTexts = ["移除", "添加"];
    });
    expect(Array.from(el.shadowRoot!.querySelectorAll(".buttons button"), (button) => button.textContent?.trim())).toEqual(["添加", "移除"]);
    expect(el.shadowRoot!.querySelector(".direction-icon")).toBeNull();
  });

  it("renders selected model keys in the target panel", async () => {
    const el = await mount((transfer) => {
      transfer.modelValue = ["1", "3"];
    });
    expect(el.shadowRoot!.querySelectorAll(".panel-left .panel-item")).toHaveLength(2);
    expect(el.shadowRoot!.querySelectorAll(".panel-right .panel-item")).toHaveLength(2);
  });

  it("moves checked source items and emits update and change payloads", async () => {
    const el = await mount();
    let update: unknown;
    let change: unknown;
    el.addEventListener("update:modelValue", (event: Event) => (update = (event as CustomEvent).detail));
    el.addEventListener("change", (event: Event) => (change = (event as CustomEvent).detail));
    const checkbox = el.shadowRoot!.querySelector<HTMLInputElement>(".panel-left .panel-item input")!;
    checkbox.click();
    await tick();
    (el.shadowRoot!.querySelector(".buttons button:first-child") as HTMLButtonElement).click();
    await tick();

    expect(update).toEqual(["1"]);
    expect(change).toEqual([["1"], "right", ["1"]]);
    expect(el.shadowRoot!.querySelector(".panel-right")?.textContent).toContain("Item 1");
  });

  it("does not move disabled items and reports checked-key changes", async () => {
    const el = await mount((transfer) => {
      transfer.data = [...sampleData, { key: "disabled", label: "Disabled", disabled: true }];
    });
    let checked: unknown;
    el.addEventListener("left-check-change", (event: Event) => (checked = (event as CustomEvent).detail));
    const inputs = el.shadowRoot!.querySelectorAll<HTMLInputElement>(".panel-left .panel-item input");
    const disabled = Array.from(inputs).find((input) => input.disabled)!;
    expect(disabled).toBeTruthy();
    (inputs[0] as HTMLInputElement).click();
    await tick();
    expect(checked).toEqual([["1"], ["1"]]);
    (el.shadowRoot!.querySelector(".buttons button:first-child") as HTMLButtonElement).click();
    await tick();
    expect(el.shadowRoot!.querySelector(".panel-right")?.textContent).not.toContain("Disabled");
  });

  it("applies default checked keys only to selectable items", async () => {
    const el = await mount((transfer) => {
      transfer.data = [...sampleData, { key: "disabled", label: "Disabled", disabled: true }];
      transfer.leftDefaultChecked = ["1", "disabled"];
    });
    const toRight = el.shadowRoot!.querySelector(".buttons button:first-child") as HTMLButtonElement;
    expect(toRight.disabled).toBe(false);
    toRight.click();
    await tick();
    expect(el.shadowRoot!.querySelector(".panel-right")?.textContent).toContain("Item 1");
    expect(el.shadowRoot!.querySelector(".panel-right")?.textContent).not.toContain("Disabled");
  });

  it("clears both select-all controls after transferring all source items", async () => {
    const el = await mount();
    const selectAllSource = el.shadowRoot!.querySelector<HTMLInputElement>(
      '.panel-left [aria-label="Select all source items"]'
    )!;
    selectAllSource.click();
    await tick();
    expect(selectAllSource.checked).toBe(true);

    (el.shadowRoot!.querySelector(".buttons button:first-child") as HTMLButtonElement).click();
    await tick();
    await tick();

    const sourceSelectAll = el.shadowRoot!.querySelector<HTMLInputElement>(
      '.panel-left [aria-label="Select all source items"]'
    )!;
    const targetSelectAll = el.shadowRoot!.querySelector<HTMLInputElement>(
      '.panel-right [aria-label="Select all target items"]'
    )!;
    expect(sourceSelectAll.checked).toBe(false);
    expect(targetSelectAll.checked).toBe(false);
    expect(el.shadowRoot!.querySelectorAll(".panel-left .panel-item")).toHaveLength(0);
    expect(el.shadowRoot!.querySelectorAll(".panel-right .panel-item")).toHaveLength(4);
  });

  it("supports unshift target order with controlled model writeback", async () => {
    const el = await mount((transfer) => {
      transfer.modelValue = ["2"];
      transfer.targetOrder = "unshift";
      transfer.leftDefaultChecked = ["1"];
      transfer.addEventListener("update:modelValue", ((event: CustomEvent) => {
        transfer.modelValue = event.detail;
      }) as EventListener);
    });
    (el.shadowRoot!.querySelector(".buttons button:first-child") as HTMLButtonElement).click();
    await tick();
    const labels = Array.from(el.shadowRoot!.querySelectorAll(".panel-right .panel-item span")).map((node) => node.textContent?.trim());
    expect(labels).toEqual(["Item 1", "Item 2"]);
  });

  it("filters with a custom method and clears queries through the exposed method", async () => {
    const el = await mount((transfer) => {
      transfer.filterable = true;
      transfer.filterMethod = (query: string, item: { key: string }) => query === item.key;
    });
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".panel-left .panel-filter input")!;
    input.value = "3";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".panel-left .panel-item")).toHaveLength(1);
    expect(el.shadowRoot!.querySelector(".panel-left")?.textContent).toContain("Item 3");
    el.clearQuery();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".panel-left .panel-item")).toHaveLength(4);
  });

  it("hides both panels behind empty slots when the data set is empty", async () => {
    const el = await mount((transfer) => {
      transfer.data = [];
    });
    expect(el.shadowRoot!.querySelectorAll(".panel-empty")).toHaveLength(2);
  });

  it("virtualizes a thousand options and scrolls to a key through the public API", async () => {
    const el = await mount((transfer) => {
      transfer.data = Array.from({ length: 1000 }, (_, index) => ({
        key: `item-${index + 1}`,
        label: `Item ${String(index + 1).padStart(4, "0")}`
      }));
      transfer.virtual = true;
      transfer.height = 180;
      transfer.itemSize = 36;
      transfer.overscan = 2;
    });

    expect(el.shadowRoot!.querySelectorAll(".panel-left .panel-item").length).toBeLessThan(15);
    expect(el.shadowRoot!.textContent).toContain("Item 0001");
    expect(el.shadowRoot!.textContent).not.toContain("Item 1000");

    el.scrollToItem("left", "item-1000");
    await tick();
    await tick();
    expect(el.shadowRoot!.textContent).toContain("Item 1000");
  });

  it("supports Space selection and directional transfer from the keyboard", async () => {
    const el = await mount();
    let update: unknown;
    el.addEventListener("update:modelValue", (event: Event) => (update = (event as CustomEvent).detail));
    const option = el.shadowRoot!.querySelector<HTMLElement>('.panel-left [role="option"]')!;

    option.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await tick();
    expect(option.getAttribute("aria-selected")).toBe("true");

    option.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    expect(update).toEqual(["1"]);
    expect(el.shadowRoot!.querySelector(".panel-right")?.textContent).toContain("Item 1");
  });

  it("shows the empty state after a filter has no matches", async () => {
    const el = await mount((transfer) => {
      transfer.filterable = true;
      transfer.emptyText = "Nothing matched";
    });
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".panel-left .panel-filter input")!;
    input.value = "missing";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    expect(el.shadowRoot!.querySelector(".panel-left .panel-empty")?.textContent).toContain("Nothing matched");
  });

  it("renders typed custom content with side and selection context", async () => {
    const el = await mount((transfer) => {
      transfer.renderContent = (item: { label: string }, context: { side: string; checked: boolean }) => {
        const content = document.createElement("strong");
        content.textContent = `${context.side}:${item.label}:${context.checked ? "checked" : "idle"}`;
        return content;
      };
    });

    expect(el.shadowRoot!.querySelector(".panel-left .item-content")?.textContent).toBe("left:Item 1:idle");
    expect(el.shadowRoot!.querySelectorAll(".item-content")).toHaveLength(4);
  });

  it("falls back to the mapped label when no renderer is provided", async () => {
    const el = await mount();
    const options = el.shadowRoot!.querySelectorAll<HTMLElement>(".panel-item");
    expect(options).toHaveLength(4);
    expect(options[0]?.textContent).toContain("Item 1");
  });
});
