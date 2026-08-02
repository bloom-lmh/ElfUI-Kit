import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
let providerTag = "";
let keyboardTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const [{ PageCalendar }, { PageCalendarEx2 }, { PageCalendarEx4 }] = await Promise.all([
    import("./index"),
    import("./ex2"),
    import("./ex4"),
  ]);
  pageTag = ensureCustomElement(PageCalendar);
  providerTag = ensureCustomElement(PageCalendarEx2);
  keyboardTag = ensureCustomElement(PageCalendarEx4);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const flush = async (): Promise<void> => {
  await new Promise((resolve) => queueMicrotask(resolve));
  await new Promise((resolve) => queueMicrotask(resolve));
};

const shadowText = (root: ParentNode): string => {
  let text = root instanceof HTMLElement ? (root.textContent ?? "") : "";
  root.querySelectorAll<HTMLElement>("*").forEach((element) => {
    if (element.shadowRoot) text += ` ${shadowText(element.shadowRoot)}`;
  });
  return text;
};

describe("Calendar documentation", () => {
  it("renders five focused examples and complete API tables", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await flush();

    expect(
      page.shadowRoot?.querySelectorAll(
        "elf-page-calendar-ex1, elf-page-calendar-ex2, elf-page-calendar-ex3, elf-page-calendar-ex4, elf-page-calendar-ex5",
      ),
    ).toHaveLength(5);
    const api = page.shadowRoot?.querySelector("elf-page-calendar-props");
    expect(api?.shadowRoot?.querySelectorAll("elf-props-table")).toHaveLength(3);
  });

  it("demonstrates the Provider week-start fallback without a local override", async () => {
    const page = document.createElement(providerTag);
    document.body.appendChild(page);
    await flush();

    const provider = page.shadowRoot?.querySelector("elf-config-provider") as HTMLElement & {
      config?: { date?: { firstDayOfWeek?: number } };
    };
    const calendar = page.shadowRoot?.querySelector("elf-calendar") as HTMLElement & {
      firstDayOfWeek?: number;
    };
    expect(provider.config?.date?.firstDayOfWeek).toBe(0);
    expect(calendar.firstDayOfWeek).toBeUndefined();
    expect(
      calendar.shadowRoot?.querySelectorAll<HTMLElement>(".week span")[1]?.textContent,
    ).toContain("日");
  });

  it("keeps the keyboard example constrained to a compact viewport", async () => {
    const page = document.createElement(keyboardTag);
    document.body.appendChild(page);
    await flush();

    expect(page.shadowRoot?.querySelector(".demo-calendar.is-compact")).not.toBeNull();
    expect(
      (
        page.shadowRoot?.querySelector("elf-calendar") as HTMLElement & {
          ariaLabel?: string;
        }
      ).ariaLabel,
    ).toBe("排班日期");
  });

  it("renders the complete page without Chinese leakage in English mode", async () => {
    document.documentElement.lang = "en-US";
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await flush();
    await flush();

    expect(shadowText(page.shadowRoot!)).not.toMatch(/[\u3400-\u9fff]/);
  });
});
