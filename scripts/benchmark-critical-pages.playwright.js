async (page) => {
  const runCount = 5;
  const scenarios = [
    {
      key: "table-v2",
      route: "/data/virtual-table",
      tag: "elf-table-v2",
      minimumItems: 5000,
      action: "scroll-row",
    },
    {
      key: "virtual-list",
      route: "/data/virtual-list",
      tag: "elf-virtual-list",
      minimumItems: 10000,
      action: "scroll-viewport",
    },
    {
      key: "tree",
      route: "/data/tree",
      tag: "elf-tree",
      minimumItems: 2000,
      action: "scroll-node",
    },
    {
      key: "select",
      route: "/form/select",
      tag: "elf-select",
      minimumItems: 10000,
      action: "open-and-scroll-option",
    },
    {
      key: "cascader",
      route: "/form/cascader",
      tag: "elf-cascader",
      minimumItems: 1,
      action: "open",
    },
    {
      key: "dropdown",
      route: "/navigation/dropdown",
      tag: "elf-dropdown",
      minimumItems: 1,
      action: "open",
    },
  ];

  const median = (values) => {
    const sorted = [...values].sort((left, right) => left - right);
    return sorted[Math.floor(sorted.length / 2)] ?? 0;
  };
  const round = (value) => Math.round(value * 100) / 100;

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.addInitScript(() => {
    if (window.__elfuiBaselineObserverInstalled) return;
    window.__elfuiBaselineObserverInstalled = true;
    window.__elfuiBaselineLongTasks = [];
    if (typeof PerformanceObserver !== "function") return;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__elfuiBaselineLongTasks.push(entry.duration);
        }
      });
      observer.observe({ entryTypes: ["longtask"] });
    } catch {
      // Long Task timing is optional; unsupported browsers report an empty list.
    }
  });

  const origin = page.url().match(/^https?:\/\/[^/]+/)?.[0];
  if (!origin) throw new Error(`Expected an HTTP page URL, received: ${page.url()}`);
  const raw = {};

  for (const scenario of scenarios) {
    raw[scenario.key] = [];
    for (let run = 0; run < runCount; run += 1) {
      const startedAt = Date.now();
      const url = `${origin}/?elfuiBaseline=${scenario.key}-${run}#${scenario.route}`;
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => {
        const deepFind = (root, selector) => {
          const direct = root.querySelector(selector);
          if (direct) return direct;
          for (const element of root.querySelectorAll("*")) {
            if (!element.shadowRoot) continue;
            const nested = deepFind(element.shadowRoot, selector);
            if (nested) return nested;
          }
          return null;
        };
        return Boolean(deepFind(document, "h1"));
      });
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
          }),
      );
      const renderMs = Date.now() - startedAt;
      const renderLongTasks = await page.evaluate(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        const tasks = [...(window.__elfuiBaselineLongTasks ?? [])];
        window.__elfuiBaselineLongTasks = [];
        return tasks;
      });

      const metrics = await page.evaluate(async (input) => {
        const deepElements = (root) => {
          const result = [];
          for (const element of root.querySelectorAll("*")) {
            result.push(element);
            if (element.shadowRoot) result.push(...deepElements(element.shadowRoot));
          }
          return result;
        };
        const all = deepElements(document);
        const candidates = all.filter((element) => element.localName === input.tag);
        const nestedItemCount = (source) =>
          Array.isArray(source)
            ? source.reduce((sum, item) => sum + 1 + nestedItemCount(item?.children), 0)
            : 0;
        const itemCount = (element) => {
          const sources = [element.data, element.items, element.options];
          return Math.max(0, ...sources.map((source) => nestedItemCount(source)));
        };
        const target =
          candidates
            .map((element) => ({ element, count: itemCount(element) }))
            .sort((left, right) => right.count - left.count)[0]?.element ?? null;
        if (!target) {
          return {
            targetFound: false,
            pageElements: all.length,
            shadowRoots: all.filter((element) => element.shadowRoot).length,
          };
        }

        const targetElementCount = () => 1 + deepElements(target.shadowRoot ?? target).length;
        const renderedItemCount = () => {
          const selectors = ["tbody tr", ".item", ".tree-node", ".option", "[role='menuitem']"];
          const targetElements = deepElements(target.shadowRoot ?? target);
          return Math.max(
            0,
            ...selectors.map(
              (selector) => targetElements.filter((element) => element.matches(selector)).length,
            ),
          );
        };
        const twoFrames = () =>
          new Promise((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
          });

        const targetNodesBefore = targetElementCount();
        const actionStartedAt = performance.now();
        if (input.action === "scroll-row") {
          target.scrollToRow?.(4500, "center");
        } else if (input.action === "scroll-viewport") {
          const viewport = target.shadowRoot?.querySelector(".viewport");
          if (viewport) {
            viewport.scrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
            viewport.dispatchEvent(new Event("scroll"));
          }
        } else if (input.action === "scroll-node") {
          target.scrollToNode?.("asset-1500");
        } else if (input.action === "open-and-scroll-option") {
          target.shadowRoot?.querySelector(".trigger")?.click();
          await twoFrames();
          target.scrollToOption?.(9000);
        } else if (input.action === "open") {
          if (typeof target.openMenu === "function") target.openMenu();
          else target.shadowRoot?.querySelector(".trigger")?.click();
        }
        const syncActionMs = performance.now() - actionStartedAt;
        await twoFrames();
        await new Promise((resolve) => setTimeout(resolve, 0));
        const settledActionMs = performance.now() - actionStartedAt;
        const actionLongTasks = [...(window.__elfuiBaselineLongTasks ?? [])];

        return {
          targetFound: true,
          sourceItems: itemCount(target),
          workloadSatisfied: itemCount(target) >= input.minimumItems,
          pageElements: all.length,
          shadowRoots: all.filter((element) => element.shadowRoot).length,
          targetElementsBefore: targetNodesBefore,
          targetElementsAfter: targetElementCount(),
          renderedItemsAfter: renderedItemCount(),
          syncActionMs,
          settledActionMs,
          actionLongTaskCount: actionLongTasks.length,
          actionLongTaskTotalMs: actionLongTasks.reduce((sum, value) => sum + value, 0),
          actionLongTaskMaxMs: Math.max(0, ...actionLongTasks),
        };
      }, scenario);

      raw[scenario.key].push({
        renderMs,
        renderLongTaskCount: renderLongTasks.length,
        renderLongTaskTotalMs: renderLongTasks.reduce((sum, value) => sum + value, 0),
        renderLongTaskMaxMs: Math.max(0, ...renderLongTasks),
        ...metrics,
      });
    }
  }

  const summary = Object.fromEntries(
    scenarios.map((scenario) => {
      const runs = raw[scenario.key];
      const numericKeys = Object.keys(runs[0] ?? {}).filter((key) =>
        runs.every((run) => typeof run[key] === "number"),
      );
      return [
        scenario.key,
        {
          route: scenario.route,
          runs: runCount,
          targetFound: runs.every((run) => run.targetFound === true),
          workloadSatisfied: runs.every((run) => run.workloadSatisfied === true),
          ...Object.fromEntries(
            numericKeys.map((key) => [key, round(median(runs.map((run) => run[key])))]),
          ),
        },
      ];
    }),
  );

  return {
    capturedAt: new Date().toISOString(),
    browser: page.context().browser()?.version() ?? "unknown",
    viewport: { width: 1440, height: 1000 },
    statistic: "median",
    summary,
    raw,
  };
};
