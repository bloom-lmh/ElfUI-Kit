async (page) => {
  const baseUrl = "http://localhost:5174";
  const response = await page.request.get(`${baseUrl}/src/routes/index.ts`);
  const routeSource = await response.text();
  const staticRoutes = Array.from(
    routeSource.matchAll(/path:\s*"([^"]+)"/g),
    (match) => match[1]
  ).filter((path) => path !== "/" && path !== "/form/debug");
  const utilityRoutes = [
    "borders", "border-radius", "content", "cursor", "display", "elevation", "flex",
    "float", "opacity", "overflow", "position", "sizing", "spacing", "typography"
  ].map((section) => `/utilities/${section}`);
  const allRoutes = [...new Set([...staticRoutes, ...utilityRoutes])];
  const auditUrl = page.url();
  const routeOffset = Number(auditUrl.match(/[?&]auditStart=(\d+)/)?.[1] || 0);
  const routeEnd = Number(auditUrl.match(/[?&]auditEnd=(\d+)/)?.[1] || allRoutes.length);
  const routes = allRoutes.slice(routeOffset, routeEnd);
  const pageErrors = [];
  let currentRoute = "";
  page.on("pageerror", (error) => pageErrors.push({ route: currentRoute, message: error.message }));

  const results = [];
  for (let index = 0; index < routes.length; index += 1) {
    currentRoute = routes[index];
    await page.goto(`${baseUrl}/#${currentRoute}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(index === 0 ? 800 : 350);

    const audit = await page.evaluate(async () => {
      const deepQueryAll = (root, selector) => {
        const found = Array.from(root.querySelectorAll(selector));
        for (const element of Array.from(root.querySelectorAll("*"))) {
          if (element.shadowRoot) found.push(...deepQueryAll(element.shadowRoot, selector));
        }
        return found;
      };
      const h1 = deepQueryAll(document, "h1");
      const playgrounds = deepQueryAll(document, "elf-playground");
      const toc = deepQueryAll(document, "elf-docs-toc")[0];
      const buttons = toc?.shadowRoot
        ? Array.from(toc.shadowRoot.querySelectorAll("button[data-toc-id]"))
        : [];
      const targetMap = new Map();
      for (const target of deepQueryAll(document, "[data-docs-toc-id]")) {
        const id = target.getAttribute("data-docs-toc-id") || "";
        const targets = targetMap.get(id) || [];
        targets.push(target);
        targetMap.set(id, targets);
      }
      const items = [];
      const nativeScrollIntoView = Element.prototype.scrollIntoView;
      const nativeScrollTo = HTMLElement.prototype.scrollTo;
      let lastScrollTarget = null;
      let scrollMethodCalled = false;
      Element.prototype.scrollIntoView = function scrollIntoViewImmediately(options) {
        lastScrollTarget = this;
        scrollMethodCalled = true;
        const normalized = typeof options === "object"
          ? { ...options, behavior: "auto" }
          : { block: "start", behavior: "auto" };
        nativeScrollIntoView.call(this, normalized);
      };
      HTMLElement.prototype.scrollTo = function scrollToImmediately(optionsOrX, y) {
        scrollMethodCalled = true;
        if (typeof optionsOrX === "object") {
          nativeScrollTo.call(this, { ...optionsOrX, behavior: "auto" });
          return;
        }
        nativeScrollTo.call(this, optionsOrX, y);
      };

      for (const button of buttons) {
        const id = button.dataset.tocId || "";
        const targets = targetMap.get(id) || [];
        const target = targets[0];
        const rendered = Boolean(target && target.getClientRects().length > 0);
        lastScrollTarget = null;
        scrollMethodCalled = false;
        button.click();
        items.push({
          label: button.textContent?.trim() || "",
          id,
          targetCount: targets.length,
          rendered,
          active: button.classList.contains("active") || button.getAttribute("aria-current") === "location",
          navigationCalled: scrollMethodCalled,
          scrolledToTarget: lastScrollTarget === target
        });
      }
      Element.prototype.scrollIntoView = nativeScrollIntoView;
      HTMLElement.prototype.scrollTo = nativeScrollTo;

      return {
        h1: h1[0]?.textContent?.replace(/\s+/g, " ").trim() || "",
        h1Count: h1.length,
        playgrounds: playgrounds.length,
        tocItems: items
      };
    });

    results.push({ route: currentRoute, ...audit });
  }

  const failures = results.flatMap((result) => {
    const issues = [];
    if (!result.h1) issues.push("missing-h1");
    if (result.tocItems.length === 0) issues.push("missing-toc");
    for (const item of result.tocItems) {
      if (item.targetCount !== 1) issues.push(`target-count:${item.label}:${item.targetCount}`);
      if (!item.rendered) issues.push(`hidden-target:${item.label}`);
      if (!item.active) issues.push(`inactive-after-click:${item.label}`);
      if (!item.navigationCalled) issues.push(`navigation-not-called:${item.label}`);
    }
    return issues.length > 0 ? [{ route: result.route, issues }] : [];
  });

  return {
    totals: {
      routeOffset,
      routeEnd: Math.min(routeEnd, allRoutes.length),
      availableRoutes: allRoutes.length,
      routes: results.length,
      playgrounds: results.reduce((sum, result) => sum + result.playgrounds, 0),
      tocItems: results.reduce((sum, result) => sum + result.tocItems.length, 0),
      failures: failures.length,
      pageErrors: pageErrors.length
    },
    failures,
    pageErrors
  };
}
