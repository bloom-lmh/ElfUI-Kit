// cspell:ignore vitesse palenight

import { describe, expect, it } from "vitest";

import {
  formatCodeCardSource,
  highlightCodeCardSource,
  normalizeCodeCardLanguage,
  normalizeCodeCardSource,
  resolveCodeCardLines,
  resolveCodeCardTheme,
} from "./model";

describe("CodeCard model", () => {
  it("normalizes language aliases and resolves paired themes", () => {
    expect(normalizeCodeCardLanguage("TS")).toBe("typescript");
    expect(normalizeCodeCardLanguage("shell")).toBe("bash");
    expect(normalizeCodeCardLanguage("unknown-language")).toBe("plaintext");
    expect(resolveCodeCardTheme("github", "light")).toBe("github-light");
    expect(resolveCodeCardTheme("github", "dark")).toBe("github-dark");
    expect(resolveCodeCardTheme("material", "light")).toBe("material-theme-lighter");
    expect(resolveCodeCardTheme("material", "dark")).toBe("material-theme-palenight");
    expect(resolveCodeCardTheme("vitesse", "light")).toBe("vitesse-light");
    expect(resolveCodeCardTheme("vitesse", "dark")).toBe("vitesse-dark");
  });

  it("returns line-preserving syntax tokens", async () => {
    const result = await highlightCodeCardSource(
      "const ready = true;\nconsole.log(ready);",
      "javascript",
      "github-light",
    );

    expect(result.lines).toHaveLength(2);
    expect(result.lines[0].map((token) => token.content).join("")).toBe("const ready = true;");
    expect(result.lines[0].some((token) => token.color !== result.foreground)).toBe(true);
  });

  it("formats supported languages with their dedicated parser", async () => {
    await expect(formatCodeCardSource("const value={ready:true}", "javascript")).resolves.toBe(
      "const value = { ready: true };\n",
    );
    await expect(formatCodeCardSource('{"name":"ElfUI","ready":true}', "json")).resolves.toBe(
      '{ "name": "ElfUI", "ready": true }\n',
    );
  });

  it("removes template-literal margin without flattening nested code", () => {
    expect(
      normalizeCodeCardSource(`
        <script type="module">
          import { registerAllComponents } from "@elfui/kit";
          registerAllComponents();
        </script>
      `),
    ).toBe(
      '<script type="module">\n  import { registerAllComponents } from "@elfui/kit";\n  registerAllComponents();\n</script>',
    );
  });

  it("normalizes single lines, tuple ranges, and object ranges", () => {
    expect([...resolveCodeCardLines([1, [3, 5], { start: 9, end: 7 }, 0, [20, 22]], 10)]).toEqual([
      1, 3, 4, 5, 7, 8, 9,
    ]);
  });
});
