import { describe, expect, it } from "vitest";

import { APP_SKINS } from "./skins";

describe("documentation app skins", () => {
  it("provides five unique Provider themes", () => {
    expect(APP_SKINS.map((skin) => skin.id)).toEqual([
      "material",
      "midnight",
      "forest",
      "violet",
      "sunset",
    ]);
    expect(new Set(APP_SKINS.map((skin) => skin.id)).size).toBe(APP_SKINS.length);
  });

  it("defines field surfaces for custom skins", () => {
    for (const skin of APP_SKINS.filter((item) => item.providerTheme === "custom")) {
      expect(skin.tokens.primary).toBeTruthy();
      expect(skin.tokens.bgPaper).toBeTruthy();
      expect(skin.tokens.fieldBg).toBeTruthy();
      expect(skin.tokens.fieldHoverBg).toBeTruthy();
    }
  });
});
