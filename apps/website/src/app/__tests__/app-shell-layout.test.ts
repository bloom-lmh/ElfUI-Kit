import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const shellStyle = readFileSync("apps/website/src/app/AppShell/style.scss", "utf8");
const shellSource = readFileSync("apps/website/src/app/AppShell/index.ts", "utf8");

describe("AppShell sidebar menu layout", () => {
  it("fills elf-aside without leaving a rounded gap at the border", () => {
    const menuRule = shellStyle
      .split(".app-menu")[1]
      ?.slice(0, shellStyle.indexOf("}", shellStyle.indexOf(".app-menu")));

    expect(menuRule).toContain("--m-radius: 0");
    expect(shellSource.match(/<elf-menu/g)).toHaveLength(2);
    expect(shellSource.match(/width="100%"/g)?.length).toBeGreaterThanOrEqual(2);
  });
});
