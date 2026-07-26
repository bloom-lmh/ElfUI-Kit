import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTagEx2 } = await import("./ex2");
  exampleTag = ensureCustomElement(PageTagEx2);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Tag documentation", () => {
  it("updates selectable filters through the checked model event", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();

    const frontend = page.shadowRoot!.querySelector<HTMLElement>('elf-tag[data-id="frontend"]')!;
    frontend.shadowRoot!.querySelector<HTMLElement>(".tag")!.click();
    await tick();

    expect(frontend.shadowRoot!.querySelector(".tag")?.getAttribute("aria-pressed")).toBe("true");
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("Frontend");
  });

  it("adds, edits, and removes a dynamic tag without putting edit state into Tag", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();

    const addInput = page.shadowRoot!.querySelector<HTMLInputElement>(".tag-add-form input")!;
    addInput.value = "Release";
    addInput.dispatchEvent(new Event("input", { bubbles: true }));
    page.shadowRoot!.querySelector<HTMLFormElement>(".tag-add-form")!.dispatchEvent(
      new SubmitEvent("submit", { bubbles: true, cancelable: true })
    );
    await tick();

    const added = Array.from(page.shadowRoot!.querySelectorAll<HTMLElement>(".tag-editor-list elf-tag"))
      .find((tag) => tag.textContent?.includes("Release"))!;
    expect(added).toBeTruthy();

    const firstEdit = page.shadowRoot!.querySelector<HTMLButtonElement>(".tag-edit-trigger")!;
    firstEdit.click();
    await tick();
    const editInput = page.shadowRoot!.querySelector<HTMLInputElement>(".tag-edit-input")!;
    editInput.value = "Design tokens";
    editInput.dispatchEvent(new Event("input", { bubbles: true }));
    editInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    await tick();
    expect(page.shadowRoot!.querySelector(".tag-editor-list")?.textContent).toContain("Design tokens");

    added.shadowRoot!.querySelector<HTMLButtonElement>(".close")!.click();
    await tick();
    expect(page.shadowRoot!.querySelector(".tag-editor-list")?.textContent).not.toContain("Release");
  });
});
