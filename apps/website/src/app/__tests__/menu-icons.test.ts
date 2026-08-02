import { describe, expect, it } from "vitest";

import { navItems } from "../../routes";
import { appMenuIconRoutes, resolveAppMenuIcon, resolveAppMenuIconColor } from "../menu-icons";

const isMaterialPath = (value: string): boolean => /^M[\d\s,.-]+[A-Za-z]/u.test(value);
const isHexColor = (value: string): boolean => /^#[0-9a-f]{6}$/iu.test(value);

describe("AppShell Material menu icons", () => {
  it("assigns an explicit Material icon to every navigation route", () => {
    expect(new Set(appMenuIconRoutes)).toEqual(new Set(navItems.map(({ to }) => to)));
    expect(navItems.every(({ to }) => isMaterialPath(resolveAppMenuIcon(to)))).toBe(true);
    expect(navItems.every(({ to }) => isHexColor(resolveAppMenuIconColor(to)))).toBe(true);
  });

  it("assigns a Material icon to every navigation group", () => {
    const groups = Array.from(new Set(navItems.flatMap(({ group }) => (group ? [group] : []))));
    expect(groups.every((group) => isMaterialPath(resolveAppMenuIcon(`group:${group}`)))).toBe(
      true,
    );
    expect(groups.every((group) => isHexColor(resolveAppMenuIconColor(`group:${group}`)))).toBe(
      true,
    );
  });
});
