// Light/dark theme QA sweep.
// Usage (mirrors scripts/audit-doc-navigation.playwright.js):
//   1) open http://localhost:5174/?auditStart=0&auditEnd=40
//   2) playwright-cli run-code --filename scripts/theme-light-dark-audit.playwright.js
// Chunks are parsed from the initial page URL so the sweep can be resumed.
async (page) => {
  const baseUrl = "http://localhost:5174";
  const response = await page.request.get(`${baseUrl}/src/routes/index.ts`);
  const routeSource = await response.text();
  const staticRoutes = Array.from(
    routeSource.matchAll(/path:\s*"([^"]+)"/g),
    (match) => match[1],
  ).filter((path) => path !== "/" && path !== "/form/debug");
  const utilityRoutes = [
    "borders",
    "border-radius",
    "content",
    "cursor",
    "display",
    "elevation",
    "flex",
    "float",
    "opacity",
    "overflow",
    "position",
    "sizing",
    "spacing",
    "typography",
  ].map((section) => `/utilities/${section}`);
  const allRoutes = [...new Set([...staticRoutes, ...utilityRoutes])];

  const auditUrl = page.url();
  const routeOffset = Number(auditUrl.match(/[?&]auditStart=(\d+)/)?.[1] || 0);
  const routeEnd = Number(auditUrl.match(/[?&]auditEnd=(\d+)/)?.[1] || allRoutes.length);
  const routes = allRoutes.slice(routeOffset, routeEnd);

  const fs = (await import("node:fs").catch(() => null)) || null;

  const readState = () =>
    page.evaluate(() => {
      const deepQueryAll = (root, selector) => {
        const found = Array.from(root.querySelectorAll(selector));
        for (const element of Array.from(root.querySelectorAll("*"))) {
          if (element.shadowRoot) found.push(...deepQueryAll(element.shadowRoot, selector));
        }
        return found;
      };
      const theme = document.documentElement.getAttribute("data-theme") || "";
      const skin = document.documentElement.getAttribute("data-skin") || "";
      const main = document.querySelector("main");
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      const mainBg = main ? getComputedStyle(main).backgroundColor : "";
      const h1 = deepQueryAll(document, "h1").some((el) => el.getClientRects().length > 0);
      const customElements = new Set();
      const collectCustom = (root) => {
        for (const element of Array.from(root.querySelectorAll("*"))) {
          if (element.localName.startsWith("elf-")) customElements.add(element.localName);
          if (element.shadowRoot) collectCustom(element.shadowRoot);
        }
      };
      collectCustom(document);
      return { theme, skin, bodyBg, mainBg, h1, customElementKinds: customElements.size };
    });

  const waitForStableState = async (expectedSkin) => {
    try {
      await page.waitForFunction(
        (skin) => {
          const deepQueryAll = (root, selector) => {
            const found = Array.from(root.querySelectorAll(selector));
            for (const element of Array.from(root.querySelectorAll("*"))) {
              if (element.shadowRoot) found.push(...deepQueryAll(element.shadowRoot, selector));
            }
            return found;
          };
          if (document.documentElement.getAttribute("data-skin") !== skin) return false;
          const h1 = deepQueryAll(document, "h1").some((el) => el.getClientRects().length > 0);
          const custom = Array.from(document.querySelectorAll("*")).filter((el) =>
            el.localName.startsWith("elf-"),
          ).length;
          return h1 || custom > 20;
        },
        expectedSkin,
        { timeout: 12000 },
      );
    } catch {
      // Fall through and read whatever is present; anomalies get flagged in results.
    }
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined))),
        ),
    );
  };

  const results = [];
  let currentRoute = "";
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push({ route: currentRoute, message: error.message }));
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push({ route: currentRoute, message: message.text().slice(0, 300) });
    }
  });

  const findAndClickSkinAction = () =>
    page.evaluate(() => {
      const deepQueryAll = (root, selector) => {
        const found = Array.from(root.querySelectorAll(selector));
        for (const element of Array.from(root.querySelectorAll("*"))) {
          if (element.shadowRoot) found.push(...deepQueryAll(element.shadowRoot, selector));
        }
        return found;
      };
      const button = deepQueryAll(document, ".skin-action")[0];
      if (button) {
        button.click();
        return true;
      }
      return false;
    });

  for (let index = 0; index < routes.length; index += 1) {
    currentRoute = routes[index];
    pageErrors.length = 0;
    consoleErrors.length = 0;
    const routeResults = { route: currentRoute, errors: [], consoleErrors: [] };
    try {
      // Force a known light skin.
      await page.goto(`${baseUrl}/#${currentRoute}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        localStorage.setItem("elfui-ui-skin", "material");
      });
      await page.reload({ waitUntil: "domcontentloaded" });
      await waitForStableState("material");
      const light = await readState();
      routeResults.light = light;

      // Force a known dark skin.
      await page.evaluate(() => {
        localStorage.setItem("elfui-ui-skin", "midnight");
      });
      await page.reload({ waitUntil: "domcontentloaded" });
      await waitForStableState("midnight");
      const dark = await readState();
      routeResults.dark = dark;

      // The real toggle must change the skin/theme.
      const beforeToggle = await page.evaluate(() => ({
        skin: document.documentElement.getAttribute("data-skin") || "",
        theme: document.documentElement.getAttribute("data-theme") || "",
      }));
      routeResults.toggleFound = await findAndClickSkinAction();
      await page.waitForFunction(
        (skin) => document.documentElement.getAttribute("data-skin") !== skin,
        beforeToggle.skin,
        { timeout: 12000 },
      );
      const afterToggle = await page.evaluate(() => ({
        skin: document.documentElement.getAttribute("data-skin") || "",
        theme: document.documentElement.getAttribute("data-theme") || "",
      }));
      routeResults.toggle = { before: beforeToggle, after: afterToggle };
      routeResults.toggleChanged = beforeToggle.skin !== afterToggle.skin;
      routeResults.bgChanged =
        dark.bodyBg !== "" && light.bodyBg !== "" && dark.bodyBg !== light.bodyBg;
      routeResults.darkThemeApplied = dark.theme === "dark";
    } catch (error) {
      routeResults.errors.push(String(error?.message || error).slice(0, 300));
    }

    routeResults.pageErrors = pageErrors.map((entry) => entry.message);
    routeResults.consoleErrors = consoleErrors.map((entry) => entry.message).slice(0, 5);
    results.push(routeResults);
  }

  const summary = {
    chunk: {
      start: routeOffset,
      end: Math.min(routeEnd, allRoutes.length),
      total: allRoutes.length,
    },
    passed: results.filter(
      (r) =>
        r.darkThemeApplied &&
        r.bgChanged &&
        r.toggleFound &&
        r.toggleChanged &&
        r.pageErrors?.length === 0 &&
        r.errors.length === 0,
    ).length,
    failed: results.filter(
      (r) =>
        !r.darkThemeApplied ||
        !r.bgChanged ||
        !r.toggleFound ||
        !r.toggleChanged ||
        r.pageErrors?.length > 0 ||
        r.errors.length > 0,
    ).length,
    results,
  };

  if (fs) {
    fs.mkdirSync("output/playwright", { recursive: true });
    fs.writeFileSync(
      `output/playwright/theme-light-dark-audit-${routeOffset}-${Math.min(routeEnd, allRoutes.length)}.json`,
      JSON.stringify(summary, null, 2),
    );
  }
  return summary;
};
