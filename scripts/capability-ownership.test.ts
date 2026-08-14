import { readFileSync, readdirSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(".");
const kitSourceRoot = join(repositoryRoot, "packages", "kit", "src");
const inventoryPath = join(
  repositoryRoot,
  "docs",
  "architecture",
  "2026-07-31-capability-ownership-and-reuse-inventory.md",
);
const inventory = readFileSync(inventoryPath, "utf8");

/** Recursively returns source files beneath a repository directory. */
const collectFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });

/** Converts a filesystem path into the stable repository path used by the inventory. */
const toRepositoryPath = (path: string): string =>
  relative(repositoryRoot, path)
    .replaceAll("\\", "/")
    .replace(/^packages\/kit\//, "");

const isNonTestTypeScript = (path: string): boolean =>
  path.endsWith(".ts") && !basename(path).includes(".test");

const componentSources = collectFiles(join(kitSourceRoot, "components"));
const macroComponents = componentSources
  .filter(isNonTestTypeScript)
  .filter((path) => {
    const source = readFileSync(path, "utf8");
    return /from\s+["']@elfui\/core["']/.test(source) && /\bdefineHtml\b/.test(source);
  })
  .map(toRepositoryPath)
  .sort();

const composableSources = collectFiles(join(kitSourceRoot, "composables"))
  .filter(
    (path) => isNonTestTypeScript(path) && !path.includes(`${join("composables", "__tests__")}`),
  )
  .map(toRepositoryPath);
const directiveSources = [
  ...collectFiles(join(kitSourceRoot, "directives")).filter(isNonTestTypeScript),
  join(kitSourceRoot, "components", "Data", "InfiniteScroll", "directive.ts"),
  join(kitSourceRoot, "components", "Feedback", "Loading", "directive.ts"),
].map(toRepositoryPath);
const commonControllers = [
  ...collectFiles(join(kitSourceRoot, "components", "Common", "focus")),
  ...collectFiles(join(kitSourceRoot, "components", "Common", "overlay")),
  join(kitSourceRoot, "components", "Common", "index.ts"),
]
  .filter(isNonTestTypeScript)
  .map(toRepositoryPath);
const providerSources = collectFiles(join(kitSourceRoot, "components", "Providers"))
  .filter(isNonTestTypeScript)
  .filter((path) => !basename(path).startsWith("probe."))
  .map(toRepositoryPath);
const macroInventoryBlock = inventory.match(
  /## Macro Component Inventory[^\n]*[\s\S]*?```text\r?\n([\s\S]*?)\r?\n```/,
)?.[1];
const documentedMacroComponents = (macroInventoryBlock ?? "")
  .split(/\r?\n/)
  .map((path) => path.trim())
  .filter(Boolean)
  .sort();

const coreApis = [
  "defineHtml",
  "defineProps",
  "defineEmits",
  "defineModel",
  "defineSlots",
  "defineStyle",
  "defineOptions",
  "defineDirective",
  "defineName",
  "useComponents",
  "useRef",
  "useReactive",
  "useShallowRef",
  "useShallowReactive",
  "useComputed",
  "useEffect",
  "watch",
  "onWatcherCleanup",
  "batch",
  "nextTick",
  "onBeforeMount",
  "onMounted",
  "onBeforeUpdate",
  "onUpdated",
  "onBeforeUnmount",
  "onUnmounted",
  "onActivated",
  "onDeactivated",
  "onAttributeChanged",
  "onErrorCaptured",
  "createApp",
  "registerComponents",
  "resolveComponentTag",
  "defineComponent",
  "defineCustomElement",
  "ensureCustomElement",
  "useModel",
  "configure",
  "getConfig",
  "usePlugin",
  "provide",
  "inject",
  "hasInjectionContext",
  "createInjectionKey",
  "useScopedSlot",
  "useAppConfig",
  "useTemplateRef",
  "defineExpose",
  "useId",
  "useHost",
  "useRenderRoot",
  "useShadowRoot",
  "useAttrs",
  "useHostAttr",
  "useHostFlag",
  "useHostCssVar",
  "useHostStyle",
  "useHostClass",
  "useEventListener",
  "useClickOutside",
  "useEscapeKey",
  "useScrollLock",
  "useFocusTrap",
  "useResizeObserver",
  "useIntersectionObserver",
  "useFormControlContext",
  "createFormControlContext",
  "teleport",
  "transition",
  "transitionGroup",
  "keepAlive",
  "suspense",
  "dynamicComponent",
  "projectLightDom",
] as const;

describe("capability ownership inventory", () => {
  it("tracks every current component and shared capability source", () => {
    const sharedSources = [
      ...composableSources,
      ...directiveSources,
      ...commonControllers,
      ...providerSources,
    ];
    const missingSharedSources = [...new Set(sharedSources)].filter(
      (path) => !inventory.includes(path),
    );
    const macroComponentSet = new Set(macroComponents);
    const documentedMacroComponentSet = new Set(documentedMacroComponents);
    const missingMacroComponents = macroComponents.filter(
      (path) => !documentedMacroComponentSet.has(path),
    );
    const staleMacroComponents = documentedMacroComponents.filter(
      (path) => !macroComponentSet.has(path),
    );

    expect(macroComponents.length, "source scan must discover macro components").toBeGreaterThan(0);
    expect(
      documentedMacroComponents.length,
      "macro inventory code block must be readable",
    ).toBeGreaterThan(0);
    expect(
      { missingMacroComponents, staleMacroComponents, missingSharedSources },
      [
        "Capability inventory drifted from source owners.",
        `Missing macro owners:\n${missingMacroComponents.join("\n")}`,
        `Stale macro owners:\n${staleMacroComponents.join("\n")}`,
        `Missing shared owners:\n${missingSharedSources.join("\n")}`,
      ].join("\n\n"),
    ).toEqual({
      missingMacroComponents: [],
      staleMacroComponents: [],
      missingSharedSources: [],
    });
  });

  it("tracks the current public Core authoring surface", () => {
    const missing = coreApis.filter((api) => !inventory.includes(`\`${api}\``));

    expect(inventory).toContain("0.1.0-beta.20");
    expect(missing).toEqual([]);
  });

  it("states the owner, consumers and prohibited duplication for shared capabilities", () => {
    expect(inventory).toContain("Authoritative owner");
    expect(inventory).toContain("Current consumers");
    expect(inventory).toContain("Prohibited duplication");
    expect(inventory).toContain("No shared owner yet");
  });
});
