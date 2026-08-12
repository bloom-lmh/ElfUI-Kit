import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const shellSource = readFileSync("apps/website/src/app/AppShell/index.ts", "utf8");

describe("AppShell language switch", () => {
  it("uses an icon-only trigger with a virtual dropdown menu", () => {
    expect(shellSource).toContain('ref="languageTrigger"');
    expect(shellSource).toContain('class="header-action language-action"');
    expect(shellSource).toContain("virtual-triggering");
    expect(shellSource).toContain(":virtualRef.prop=${languageTrigger.value}");
    expect(shellSource).not.toContain("languageDropdown.value.virtualRef = languageTrigger.value");
    expect(shellSource).not.toContain('class="language-toggle"');
  });
});
