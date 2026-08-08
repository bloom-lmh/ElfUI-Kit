import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const shellStyle = readFileSync("apps/website/src/app/AppShell/style.scss", "utf8");
const shellSource = readFileSync("apps/website/src/app/AppShell/index.ts", "utf8");
const kitManifest = JSON.parse(readFileSync("packages/kit/package.json", "utf8")) as {
  sideEffects?: string[];
};

describe("AppShell sidebar menu layout", () => {
  it("fills elf-aside without leaving a rounded gap at the border", () => {
    const menuRule = shellStyle
      .split(".app-menu")[1]
      ?.slice(0, shellStyle.indexOf("}", shellStyle.indexOf(".app-menu")));

    expect(menuRule).toContain("--m-radius: 0");
    expect(shellSource.match(/<elf-menu/g)).toHaveLength(2);
    expect(shellSource.match(/width="100%"/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("declares every shell dependency through the framework component registry", () => {
    const registration = shellSource.match(/useComponents\(([\s\S]*?)\);/)?.[1] ?? "";
    const dependencies = [
      "ConfigProvider",
      "LocaleProvider",
      "Progress",
      "Layout",
      "Loading",
      "Header",
      "Dropdown",
      "Aside",
      "Menu",
      "Main",
      "DocsToc",
      "Footer",
    ];

    for (const dependency of dependencies) expect(registration).toContain(dependency);
    expect(registration).not.toContain("Button");
    expect(shellSource).not.toContain("components/Basic/Button");
    expect(shellSource).not.toContain("registerComponents(Button)");
  });

  it("preserves source registration entrypoints in production builds", () => {
    expect(kitManifest.sideEffects).toEqual(
      expect.arrayContaining([
        "./src/library.ts",
        "./src/components/index.ts",
        "./src/components/Basic/index.ts",
        "./src/components/Data/index.ts",
        "./src/components/Feedback/index.ts",
        "./src/components/Form/register.ts",
        "./src/components/Layout/index.ts",
        "./src/components/Navigation/index.ts",
        "./src/components/Picker/index.ts",
        "./src/components/Providers/index.ts",
      ]),
    );
  });
});
