import { describe, expect, it } from "vitest";

import { contrastRatio, createThemeExport, derivePrimaryTokens } from "./model";

describe("ThemeStudio model", () => {
  it("derives stable interaction colors from a custom primary", () => {
    expect(derivePrimaryTokens("#2563EB", false)).toEqual({
      primary: "#2563EB",
      primaryHover: "#2055CA",
      primaryActive: "#1B49AE",
      bgOverlay: "#EEF3FD",
    });
  });

  it("calculates WCAG contrast ratios", () => {
    expect(contrastRatio("#FFFFFF", "#2563EB")).toBeGreaterThan(5);
    expect(contrastRatio("#0F172A", "#FFFFFF")).toBeGreaterThan(17);
  });

  it("exports ConfigProvider, JSON, and CSS variable formats", () => {
    const tokens = { primary: "#2563EB", bgPaper: "#FFFFFF" };
    expect(createThemeExport("config", "brand", false, tokens)).toContain("defineElfUIConfig");
    expect(JSON.parse(createThemeExport("json", "brand", false, tokens))).toMatchObject({
      version: 1,
      name: "brand",
      theme: { tokens },
    });
    expect(createThemeExport("css", "brand", false, tokens)).toContain("--elf-primary: #2563EB");
  });
});
