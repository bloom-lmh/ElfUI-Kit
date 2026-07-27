import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageCalendarEx4 } = await import("./ex4");
  exampleTag = ensureCustomElement(PageCalendarEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("Calendar documentation", () => {
  it("keeps the keyboard example constrained to a mobile-sized viewport", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const wrapper = page.shadowRoot!.querySelector<HTMLElement>("elf-playground > div")!;
    expect(wrapper.style.maxWidth).toBe("360px");
    expect(wrapper.querySelector("elf-calendar")?.getAttribute("aria-label")).toBe("排班日期");
  });
});
