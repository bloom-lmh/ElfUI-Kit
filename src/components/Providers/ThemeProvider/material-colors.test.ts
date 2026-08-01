import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  MATERIAL_COLOR_PALETTES,
  MATERIAL_COLOR_TONES,
  getMaterialColorPalette,
} from "./material-colors";
import { DARK_THEME_TOKENS, LIGHT_THEME_TOKENS, THEME_PRESETS, getThemePreset } from "./presets";

describe("Material color palettes", () => {
  it("exposes the complete Material family list in stable display order", () => {
    expect(MATERIAL_COLOR_PALETTES).toHaveLength(19);
    expect(MATERIAL_COLOR_PALETTES.map((palette) => palette.id)).toEqual([
      "red",
      "pink",
      "purple",
      "deep-purple",
      "indigo",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "blue-grey",
      "grey",
    ]);
  });

  it("keeps Vuetify-compatible base, lighten, darken, and accent values", () => {
    expect(MATERIAL_COLOR_TONES).toHaveLength(14);
    expect(getMaterialColorPalette("blue").colors).toMatchObject({
      lighten5: "#E3F2FD",
      base: "#2196F3",
      darken4: "#0D47A1",
      accent4: "#2962FF",
    });
    expect(getMaterialColorPalette("grey").colors).not.toHaveProperty("accent1");
  });

  it("uses Blue as the fallback for unknown family ids", () => {
    expect(getMaterialColorPalette("unknown").id).toBe("blue");
  });

  it("builds every bundled theme from Material color families without changing legacy ids", () => {
    expect(THEME_PRESETS.map((preset) => preset.id)).toEqual([
      "material",
      "midnight",
      "forest",
      "violet",
      "sunset",
    ]);
    expect(getThemePreset("material").tokens.primary).toBe(
      getMaterialColorPalette("blue").colors.darken2,
    );
    expect(getThemePreset("midnight").tokens.primary).toBe(
      getMaterialColorPalette("indigo").colors.lighten2,
    );
    expect(getThemePreset("forest").tokens.primary).toBe(
      getMaterialColorPalette("teal").colors.darken2,
    );
    expect(getThemePreset("violet").tokens.primary).toBe(
      getMaterialColorPalette("deep-purple").colors.base,
    );
    expect(getThemePreset("sunset").tokens.primary).toBe(
      getMaterialColorPalette("deep-orange").colors.darken2,
    );
  });

  it("keeps first-paint CSS variables synchronized with the Provider defaults", () => {
    const tokenSource = readFileSync(resolve(process.cwd(), "src/styles/_tokens.scss"), "utf8");

    for (const value of [
      LIGHT_THEME_TOKENS.primary,
      LIGHT_THEME_TOKENS.primaryHover,
      LIGHT_THEME_TOKENS.primaryActive,
      DARK_THEME_TOKENS.primary,
      DARK_THEME_TOKENS.primaryHover,
      DARK_THEME_TOKENS.primaryActive,
    ]) {
      expect(tokenSource.toLowerCase()).toContain(String(value).toLowerCase());
    }
  });
});
