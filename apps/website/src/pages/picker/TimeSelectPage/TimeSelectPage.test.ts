import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
let rangeTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [{ PageTimeSelect }, { PageTimeSelectEx3 }] = await Promise.all([
    import("./index"),
    import("./ex3"),
  ]);
  pageTag = ensureCustomElement(PageTimeSelect);
  rangeTag = ensureCustomElement(PageTimeSelectEx3);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("TimeSelect documentation", () => {
  it("renders four focused examples and API tables", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(
      page.shadowRoot?.querySelectorAll(
        "elf-page-time-select-ex1, elf-page-time-select-ex2, elf-page-time-select-ex3, elf-page-time-select-ex4",
      ),
    ).toHaveLength(4);
    const api = page.shadowRoot?.querySelector("elf-page-time-select-props");
    expect(api?.shadowRoot?.querySelectorAll("elf-props-table")).toHaveLength(3);
  });

  it("keeps linked range examples constrained and controlled", async () => {
    const page = document.createElement(rangeTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const selects = page.shadowRoot!.querySelectorAll<
      HTMLElement & { minTime?: string; maxTime?: string }
    >("elf-time-select");
    expect(selects).toHaveLength(2);
    expect(selects[0]?.maxTime).toBe("17:30");
    expect(selects[1]?.minTime).toBe("09:00");
  });
});
