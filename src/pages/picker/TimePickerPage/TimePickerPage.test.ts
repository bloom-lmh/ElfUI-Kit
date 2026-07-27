import { afterEach, beforeAll, describe, expect, it } from "vitest";

const exampleTags: string[] = [];

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [{ PageTimePickerEx1 }, { PageTimePickerEx2 }, { PageTimePickerEx3 }, { PageTimePickerEx4 }, { PageTimePickerEx5 }] = await Promise.all([
    import("./ex1"),
    import("./ex2"),
    import("./ex3"),
    import("./ex4"),
    import("./ex5")
  ]);
  exampleTags.push(
    ensureCustomElement(PageTimePickerEx1),
    ensureCustomElement(PageTimePickerEx2),
    ensureCustomElement(PageTimePickerEx3),
    ensureCustomElement(PageTimePickerEx4),
    ensureCustomElement(PageTimePickerEx5)
  );
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("TimePicker documentation", () => {
  it("centers every picker example inside its Playground", async () => {
    for (const tag of exampleTags) {
      const page = document.createElement(tag);
      document.body.appendChild(page);
      await tick();
      await tick();

      const wrapper = page.shadowRoot!.querySelector<HTMLElement>("elf-playground > div")!;
      expect(wrapper.style.placeItems).toBe("center");
      expect(wrapper.style.width).toBe("100%");
      expect(wrapper.style.maxWidth).not.toBe("");
      page.remove();
    }
  });
});
