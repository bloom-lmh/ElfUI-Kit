import { describe, expect, it } from "vitest";

import {
  createTimeOptions,
  formatClockTime,
  parseClockTime,
  parseTimeStep,
  toClockValue,
} from "./time-options";

describe("picker time options", () => {
  it("parses strict clock values without silently clamping invalid input", () => {
    expect(parseClockTime("08:05")).toEqual({
      hours: 8,
      minutes: 5,
      totalMinutes: 485,
    });
    expect(parseClockTime("24:00")).toBeNull();
    expect(parseClockTime("09:7")).toBeNull();
  });

  it("normalizes clock values and safely falls back for an invalid step", () => {
    expect(toClockValue(545)).toBe("09:05");
    expect(parseTimeStep("00:15")).toBe(15);
    expect(parseTimeStep("00:00")).toBe(30);
  });

  it("builds an end-exclusive list by default and can append the exact end", () => {
    expect(
      createTimeOptions({
        start: "08:30",
        end: "09:00",
        step: "00:15",
      }).map((option) => option.value),
    ).toEqual(["08:30", "08:45"]);

    expect(
      createTimeOptions({
        start: "08:30",
        end: "09:05",
        step: "00:20",
        includeEndTime: true,
      }).map((option) => option.value),
    ).toEqual(["08:30", "08:50", "09:05"]);
  });

  it("marks linked min and max boundaries as disabled", () => {
    const options = createTimeOptions({
      start: "08:00",
      end: "10:30",
      step: "00:30",
      minTime: "08:30",
      maxTime: "09:30",
      includeEndTime: true,
    });

    expect(options.map((option) => [option.value, option.disabled])).toEqual([
      ["08:00", true],
      ["08:30", false],
      ["09:00", false],
      ["09:30", false],
      ["10:00", true],
      ["10:30", true],
    ]);
  });

  it("formats 24-hour and 12-hour labels while retaining canonical values", () => {
    expect(formatClockTime(0, "hh:mm A")).toBe("12:00 AM");
    expect(formatClockTime(13 * 60 + 5, "h:mm a")).toBe("1:05 pm");
    expect(
      createTimeOptions({
        start: "13:00",
        end: "14:00",
        step: "00:30",
        format: "hh:mm A",
      }),
    ).toMatchObject([
      { value: "13:00", label: "01:00 PM" },
      { value: "13:30", label: "01:30 PM" },
    ]);
  });

  it("returns no options for a reversed range", () => {
    expect(createTimeOptions({ start: "18:00", end: "09:00" })).toEqual([]);
  });
});
