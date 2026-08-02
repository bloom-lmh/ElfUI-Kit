import { describe, expect, it } from "vitest";

import { createNativeDateAdapter } from "./date";

describe("native date adapter", () => {
  const adapter = createNativeDateAdapter();

  it("parses and formats local dates without UTC offset drift", () => {
    const value = adapter.parse("2026-07-29", "YYYY-MM-DD");

    expect(value).not.toBeNull();
    expect(adapter.toISODate(value!)).toBe("2026-07-29");
    expect(adapter.format(value!, "DD/MM/YYYY")).toBe("29/07/2026");
  });

  it("supports date-time patterns and rejects invalid calendar values", () => {
    const value = adapter.parse("2026/07/29 18:05:09", "YYYY/MM/DD HH:mm:ss");

    expect(adapter.toISODateTime(value!)).toBe("2026-07-29T18:05:09");
    expect(adapter.parse("2026-02-30", "YYYY-MM-DD")).toBeNull();
  });

  it("performs immutable date arithmetic", () => {
    const source = adapter.create(2026, 0, 15);
    const result = adapter.add(source, 2, "month");

    expect(adapter.toISODate(source)).toBe("2026-01-15");
    expect(adapter.toISODate(result)).toBe("2026-03-15");
    expect(adapter.compare(result, source)).toBe(1);
    expect(adapter.daysInMonth(adapter.create(2028, 1))).toBe(29);
    expect(adapter.toISODate(adapter.add(adapter.create(2026, 0, 31), 1, "month"))).toBe(
      "2026-02-28",
    );
  });

  it("supports locale-aware named presets", () => {
    const value = adapter.create(2026, 6, 29);

    expect(adapter.format(value, "monthShort", { locale: "en-US" })).toBe("Jul");
    expect(adapter.format(value, "monthShort", { locale: "zh-CN" })).toContain("7");
  });

  it("exposes calendar fields and ISO week numbers without consumer-side date math", () => {
    const value = adapter.create(2026, 6, 29);

    expect(adapter.getYear(value)).toBe(2026);
    expect(adapter.getMonth(value)).toBe(6);
    expect(adapter.getDate(value)).toBe(29);
    expect(adapter.getWeekday(value)).toBe(3);
    expect(adapter.getWeekNumber(value)).toBe(31);
  });
});
