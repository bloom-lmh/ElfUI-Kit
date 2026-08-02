import { describe, expect, it } from "vitest";

import {
  colorHexToRgb,
  formatColorValue,
  normalizeColorHex,
  normalizeColorPresets,
  parseColorAlpha,
  resolveColorFormat,
} from "./model";

describe("ColorPicker model", () => {
  it("normalizes supported hex and rgb inputs without leaking invalid values", () => {
    expect(normalizeColorHex("#AbC")).toBe("#aabbcc");
    expect(normalizeColorHex("#12A4ef")).toBe("#12a4ef");
    expect(normalizeColorHex("rgb(300, 16, 0)")).toBe("#ff1000");
    expect(normalizeColorHex("rgba(0, 106, 106, 0.8)")).toBe("#006a6a");
    expect(normalizeColorHex("not-a-color")).toBeNull();
    expect(colorHexToRgb("#006a6a")).toEqual([0, 106, 106]);
  });

  it("keeps format and alpha projection independent from component state", () => {
    expect(resolveColorFormat("rgb", "hex")).toBe("rgb");
    expect(resolveColorFormat("invalid", "rgb")).toBe("hex");
    expect(parseColorAlpha("rgba(0, 106, 106, 0.8)")).toBe(80);
    expect(parseColorAlpha("rgb(0, 106, 106)")).toBeNull();
    expect(
      formatColorValue({
        color: "#006a6a",
        format: "rgb",
        alpha: 100,
        showAlpha: false,
      }),
    ).toBe("rgb(0, 106, 106)");
    expect(
      formatColorValue({
        color: "#006a6a",
        format: "hex",
        alpha: 80,
        showAlpha: true,
      }),
    ).toBe("rgba(0, 106, 106, 0.8)");
  });

  it("prefers predefine and filters invalid preset entries", () => {
    expect(
      normalizeColorPresets(["#6750a4", { value: "#006a6a", label: "Teal" }, null], ["#ffffff"]),
    ).toEqual([
      { value: "#6750a4", label: "#6750a4" },
      { value: "#006a6a", label: "Teal" },
    ]);
    expect(normalizeColorPresets([], ["#ffffff"])).toEqual([
      { value: "#ffffff", label: "#ffffff" },
    ]);
  });
});
