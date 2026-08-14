import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { expect, test } from "@playwright/test";

import { collectCriticalPageBenchmark } from "./benchmark-critical-pages.playwright.js";

const outputPath = resolve("docs/baselines/current-critical-pages.json");

test("captures the current critical-page baseline", async ({ browserName, page }) => {
  await page.goto("/");

  const result = {
    browserName,
    ...(await collectCriticalPageBenchmark(page)),
  };
  const scenarios = Object.values(result.summary);

  expect(scenarios.length).toBeGreaterThan(0);
  expect(scenarios.every((scenario) => scenario.targetFound)).toBe(true);
  expect(scenarios.every((scenario) => scenario.workloadSatisfied)).toBe(true);

  await mkdir(resolve("docs/baselines"), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
});
