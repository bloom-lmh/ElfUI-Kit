import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";
import { compileString } from "sass-embedded";

import { navItems, routes } from "../routes";
import { BREAKPOINTS, CATALOG } from "../pages/utilities/UtilitiesPage/catalog";

const utilitySource = readFileSync(resolve(process.cwd(), "src/styles/utilities.scss"), "utf8");
const utilityStyles = compileString(utilitySource).css;
const catalogEntries = Object.entries(CATALOG);

describe("ElfUI utility classes", () => {
  it("publishes the Vuetify 4 utility contract and ElfUI compatibility aliases", () => {
    for (const className of [
      "border-e-xl", "border-opacity-75", "border-dashed", "rounded-ts-xl",
      "d-xxl-flex", "d-print-none", "hidden-xl-and-down", "d-sr-only",
      "pointer-events-none", "cursor-grabbing", "hover-elevation-5",
      "elevation-24", "flex-lg-1-0-100", "justify-md-space-evenly",
      "align-self-sm-baseline", "order-xl-last", "float-print-end",
      "overflow-x-auto", "position-sticky", "w-xxl-33", "h-md-screen",
      "ga-lg-16", "mx-xxl-n16", "ms-md-auto", "text-md-display-large",
      "text-lg-end", "text-h4", "font-weight-black"
    ]) {
      expect(utilityStyles).toContain(`.${className}`);
    }
  });

  it("uses the current Vuetify 4 breakpoint and spacing scales", () => {
    for (const breakpoint of BREAKPOINTS.slice(1)) {
      expect(utilityStyles).toContain(`@media (min-width: ${breakpoint.min})`);
    }

    expect(utilityStyles).toContain(".pa-16");
    expect(utilityStyles).toContain("padding: 64px !important");
    expect(utilityStyles).toContain(".me-n16");
    expect(utilityStyles).toContain("margin-inline-end: -64px !important");
    expect(utilityStyles).toContain(".gc-auto");
  });

  it("keeps every documented category backed by examples and reference groups", () => {
    expect(catalogEntries).toHaveLength(14);
    expect(new Set(catalogEntries.map(([key]) => key)).size).toBe(catalogEntries.length);

    for (const [key, category] of catalogEntries) {
      expect(category.description.length).toBeGreaterThan(10);
      expect(category.groups.length).toBeGreaterThan(0);
      expect(category.groups.every((group) => group.examples.length > 0)).toBe(true);
      for (const className of category.groups.flatMap((group) => group.examples)) {
        expect(utilityStyles, `${key}: .${className}`).toContain(`.${className}`);
      }
    }
  });

  it("keeps the utilities menu and routes in sync", () => {
    const utilityNav = navItems.filter((item) => item.to === "/utilities");
    const routePaths = new Set(routes.map((route) => route.path));

    expect(navItems[0]).toEqual({ to: "/providers/config", text: "Global configuration 全局配置", group: "Guide 指南" });
    expect(utilityNav).toEqual([{ to: "/utilities", text: "Utilities 工具类", group: "Utilities 工具类" }]);
    expect(utilityNav.every((item) => routePaths.has(item.to))).toBe(true);
    expect(catalogEntries.every(([key]) => routePaths.has(`/utilities/${key}`))).toBe(true);
  });
});
