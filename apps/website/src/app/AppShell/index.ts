import {
  getActiveRouter,
  isNavigationFailure,
  NavigationFailureType,
  type Router,
} from "@elfui/router";
import { mdiBackburger, mdiForwardburger, mdiThemeLightDark, mdiTranslate } from "@mdi/js";
import {
  defineHtml,
  defineStyle,
  onMounted,
  onUnmounted,
  useComputed,
  useEffect,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import type { LocaleMessages } from "@elfui/kit-src/components/Providers/context";
import type { ElfUIConfig } from "@elfui/kit-src/components/Providers/config";
import { navItems } from "../../routes";
import { resolveAppMenuIcon, resolveAppMenuIconColor } from "../menu-icons";
import { APP_SKINS, type AppSkin } from "../skins";
import styles from "./style.scss?inline";

const SKIN_KEY = "elfui-ui-skin";
const LEGACY_THEME_KEY = "elfui-ui-theme";
const LOCALE_KEY = "elfui-ui-locale";

interface AppMenuItem {
  index: string;
  label: string;
  icon: string;
  iconColor: string;
  children?: AppMenuItem[];
}

const APP_MESSAGES: Record<string, LocaleMessages> = {
  "zh-CN": {
    app: {
      search: "搜索组件…",
      collapse: "切换侧栏",
      language: "切换为英文",
      skin: "切换主题皮肤",
      footer: "组件库与设计系统",
      home: "返回首页",
      closeNavigation: "关闭导航",
    },
    home: {
      eyebrow: "面向产品团队的 Web Components",
      titleLead: "构建精致界面，",
      titleAccent: "原生 Web Components 组件库。",
      description:
        "ElfUI 将稳定的组件契约、Material 设计语言与原生 Web 标准组合在一起，让设计系统真正跨项目复用。",
      primaryAction: "浏览组件",
      secondaryAction: "查看 Provider",
      proofLabel: "项目指标",
      proofComponents: "组件与模式",
      proofTests: "自动化测试",
      proofRuntime: "框架依赖",
      visualLabel: "ElfUI 仪表盘界面预览",
      live: "实时",
      visualEyebrow: "工作空间",
      visualTitle: "运营概览",
      metricRevenue: "本月收入",
      metricUsers: "活跃用户",
      metricActivity: "项目活跃度",
      metricWeek: "最近 7 天",
      visualReady: "系统运行正常",
      principlesEyebrow: "为长期维护而设计",
      principlesTitle: "一套组件系统，三个清晰原则。",
      principlesDescription:
        "从组件边界到主题与无障碍，每层都保持可预测、可测试，也方便团队继续扩展。",
      principleOneTitle: "原生且可组合",
      principleOneDescription:
        "基于 Custom Elements 与 Shadow DOM，适配任何框架，也能直接在浏览器中使用。",
      principleTwoTitle: "设计语言集中管理",
      principleTwoDescription:
        "主题、语言、默认值和图标通过 Provider 统一下发，业务组件只关心自己的内容。",
      principleThreeTitle: "交互质量可验证",
      principleThreeDescription:
        "键盘、焦点、表单语义与边界状态进入组件契约，并由严格测试持续保护。",
      starterEyebrow: "从真实场景开始",
      starterTitle: "选择一种模式，快速建立第一块界面。",
      starterDescription: "每个组件页面都包含交互案例、源码、API 表格和边界行为说明。",
      starterForm: "搭建表单流程",
      starterData: "构建数据工作台",
      starterLayout: "规划响应式布局",
      codeTitle: "Provider 驱动配置",
      codeComment: "在应用入口集中配置",
    },
  },
  "en-US": {
    app: {
      search: "Search components…",
      collapse: "Toggle sidebar",
      language: "Switch to Chinese",
      skin: "Switch theme skin",
      footer: "Component library and design system",
      home: "Back to home",
      closeNavigation: "Close navigation",
    },
    home: {
      eyebrow: "Web Components for product teams",
      titleLead: "Ship polished interfaces,",
      titleAccent: "a native Web Components library.",
      description:
        "ElfUI combines stable component contracts, Material design language, and native web standards so your design system can travel across products.",
      primaryAction: "Explore components",
      secondaryAction: "View Providers",
      proofLabel: "Project metrics",
      proofComponents: "components & patterns",
      proofTests: "automated tests",
      proofRuntime: "framework dependencies",
      visualLabel: "ElfUI dashboard interface preview",
      live: "Live",
      visualEyebrow: "Workspace",
      visualTitle: "Operations overview",
      metricRevenue: "Monthly revenue",
      metricUsers: "Active users",
      metricActivity: "Project activity",
      metricWeek: "Last 7 days",
      visualReady: "All systems operational",
      principlesEyebrow: "Built for the long run",
      principlesTitle: "One component system. Three clear principles.",
      principlesDescription:
        "From component boundaries to themes and accessibility, every layer stays predictable, testable, and ready for teams to extend.",
      principleOneTitle: "Native and composable",
      principleOneDescription:
        "Built on Custom Elements and Shadow DOM, it works across frameworks or directly in the browser.",
      principleTwoTitle: "Design language, centralized",
      principleTwoDescription:
        "Themes, locale, defaults, and icons flow through Providers while product components stay focused on content.",
      principleThreeTitle: "Interaction quality, verified",
      principleThreeDescription:
        "Keyboard, focus, form semantics, and boundary states are part of the contract and protected by strict tests.",
      starterEyebrow: "Start with a real pattern",
      starterTitle: "Choose a path and assemble your first interface.",
      starterDescription:
        "Every component page includes interactive examples, source, API tables, and boundary behavior.",
      starterForm: "Build a form flow",
      starterData: "Create a data workspace",
      starterLayout: "Plan a responsive layout",
      codeTitle: "Provider-driven setup",
      codeComment: "Configure once at the application root",
    },
  },
};

const readStorage = (key: string, fallback: string): string => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const readHashPath = (): string => {
  if (typeof window === "undefined") return "/";
  const hash = window.location.hash || "#/";
  return hash.startsWith("#") ? hash.slice(1) || "/" : hash || "/";
};

const readCurrentPath = (): string => {
  const router = getActiveRouter();
  const currentPath = router?.current.peek().path;
  return currentPath || readHashPath();
};

const normalizeSkin = (value: string): string => {
  if (APP_SKINS.some((skin) => skin.id === value)) return value;
  return value === "dark" ? "midnight" : "material";
};

const englishLabel = (label: string): string => {
  if (label === "首页") return "Home";
  if (label === "Guide 指南") return "Guide";
  if (label === "工具类" || label === "Utilities 工具类") return "Utilities";
  const stripped = label
    .replace(/[\u3400-\u9fff\u3000-\u303f]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return stripped || label;
};

const chineseLabel = (label: string): string => {
  if (label === "AI 组件") return label;
  const firstChinese = label.search(/[\u3400-\u9fff]/u);
  return firstChinese >= 0 ? label.slice(firstChinese).trim() : label;
};

// State
const initialSkin = normalizeSkin(readStorage(SKIN_KEY, readStorage(LEGACY_THEME_KEY, "material")));
const skinName = useRef(initialSkin);
const localeName = useRef(readStorage(LOCALE_KEY, "zh-CN") === "en-US" ? "en-US" : "zh-CN");
const collapsed = useRef(false);
const compactViewport = useRef(false);
const mobileMenuOpen = useRef(false);
const active = useRef(readCurrentPath());
const routeLoading = useRef(false);
const languageTrigger = useTemplateRef<HTMLElement>("languageTrigger");
const languageDropdown = useTemplateRef<HTMLElement & { virtualRef?: HTMLElement | null }>(
  "languageDropdown",
);
let removeHashListener = (): void => {};
let removeViewportListener = (): void => {};
let routeHookRouter: Router | null = null;
let removeRouteBeforeEach = (): void => {};
let removeRouteAfterEach = (): void => {};
let removeRouteError = (): void => {};

// Derived state
const currentSkin = (): AppSkin =>
  APP_SKINS.find((skin) => skin.id === skinName.value) || APP_SKINS[0]!;
const isEnglish = (): boolean => localeName.value === "en-US";
const currentMessages = (): LocaleMessages =>
  APP_MESSAGES[localeName.value] || APP_MESSAGES["zh-CN"]!;
const providerConfig = (): ElfUIConfig => ({
  locale: { name: localeName.value, messages: currentMessages() },
  theme: {
    theme: currentSkin().providerTheme,
    tokens: currentSkin().tokens,
  },
});
const text = (zh: string, en: string): string => (isEnglish() ? en : zh);
const localizeLabel = (label: string): string =>
  isEnglish() ? englishLabel(label) : chineseLabel(label);
const tocLabel = (): string => {
  const item = navItems.find((entry) => entry.to === active.value);
  return item ? localizeLabel(item.text) : text("本页目录", "On this page");
};
const collapseIcon = (): string =>
  compactViewport.value
    ? mobileMenuOpen.value
      ? mdiBackburger
      : mdiForwardburger
    : collapsed.value
      ? mdiForwardburger
      : mdiBackburger;
const languageItems = (): Array<{ label: string; command: string }> => [
  { label: "中文", command: "zh-CN" },
  { label: "English", command: "en-US" },
];
const appMessage = (key: string): string =>
  String((currentMessages().app as Record<string, string>)[key] || key);
const isHome = (): boolean => active.value === "/" || active.value === "";

const menuItems = useComputed((): AppMenuItem[] => {
  const groups: Record<string, AppMenuItem[]> = {};
  const top: AppMenuItem[] = [];
  for (const { to, text: label, group } of navItems) {
    const item = {
      index: to,
      label: localizeLabel(label),
      icon: resolveAppMenuIcon(to),
      iconColor: resolveAppMenuIconColor(to),
    };
    if (group) (groups[group] ??= []).push(item);
    else top.push(item);
  }
  for (const [group, children] of Object.entries(groups)) {
    top.push({
      index: `group:${group}`,
      label: localizeLabel(group),
      icon: resolveAppMenuIcon(`group:${group}`),
      iconColor: resolveAppMenuIconColor(`group:${group}`),
      children,
    });
  }
  return top;
});

// Methods
const applyDocumentSkin = (): void => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", currentSkin().dark ? "dark" : "light");
  document.documentElement.setAttribute("data-skin", currentSkin().id);
  document.documentElement.lang = localeName.value;
};

const cycleSkin = (): void => {
  const index = APP_SKINS.findIndex((skin) => skin.id === skinName.value);
  skinName.set(APP_SKINS[(index + 1) % APP_SKINS.length]!.id);
  applyDocumentSkin();
  try {
    localStorage.setItem(SKIN_KEY, skinName.value);
  } catch {
    /* storage unavailable */
  }
};

const setLocale = (next: string): void => {
  const normalized = next === "en-US" ? "en-US" : "zh-CN";
  if (normalized === localeName.value) return;
  localeName.set(normalized);
  applyDocumentSkin();
  try {
    localStorage.setItem(LOCALE_KEY, normalized);
  } catch {
    /* storage unavailable */
  }

  const router = getActiveRouter();
  const current = router?.current.peek();
  if (router && current) {
    void router.replace({
      path: current.path,
      query: current.query,
      hash: current.hash,
      force: true,
    });
  }
};

const onLanguageCommand = (event: Event): void => {
  const detail = (event as CustomEvent<{ command: unknown }>).detail;
  setLocale(String(detail?.command ?? ""));
};

const toggleCollapsed = (): void => {
  if (compactViewport.value) {
    mobileMenuOpen.set(!mobileMenuOpen.value);
    return;
  }
  collapsed.set(!collapsed.value);
};

const closeMobileMenu = (): void => mobileMenuOpen.set(false);

const clearRouteLoadingHooks = (): void => {
  removeRouteBeforeEach();
  removeRouteAfterEach();
  removeRouteError();
  routeHookRouter = null;
};

const registerRouteLoadingHooks = (): void => {
  const router = getActiveRouter();
  if (!router || router === routeHookRouter) return;

  clearRouteLoadingHooks();
  routeHookRouter = router;
  removeRouteBeforeEach = router.beforeEach(() => {
    routeLoading.set(true);
  });
  removeRouteAfterEach = router.afterEach((_to, _from, failure) => {
    if (failure && isNavigationFailure(failure, NavigationFailureType.cancelled)) return;
    routeLoading.set(false);
  });
  removeRouteError = router.onError(() => routeLoading.set(false));
};

const goHome = (): void => {
  closeMobileMenu();
  active.set("/");
  registerRouteLoadingHooks();
  const router = getActiveRouter();
  if (router) void router.push("/");
  else if (typeof window !== "undefined") window.location.hash = "/";
};

const onSelect = (event: Event): void => {
  const detail = (event as CustomEvent).detail;
  const next = String((Array.isArray(detail) ? detail[0] : detail) ?? "/");
  closeMobileMenu();
  active.set(next);
  registerRouteLoadingHooks();
  const router = getActiveRouter();
  if (router) void router.push(next);
  else if (typeof window !== "undefined" && next.startsWith("/")) window.location.hash = next;
};

const onCollapseChange = (event: Event): void =>
  collapsed.set(Boolean((event as CustomEvent).detail));

// Effects and lifecycle
useEffect(() => {
  const router = getActiveRouter();
  if (router) active.set(router.current.value.path);
});

onMounted(() => {
  applyDocumentSkin();
  active.set(readCurrentPath());
  registerRouteLoadingHooks();
  if (languageDropdown.value && languageTrigger.value) {
    languageDropdown.value.virtualRef = languageTrigger.value;
  }
  if (typeof window === "undefined") return;
  const syncFromHash = () => active.set(readHashPath());
  window.addEventListener("hashchange", syncFromHash);
  removeHashListener = () => window.removeEventListener("hashchange", syncFromHash);

  if (typeof window.matchMedia !== "function") return;
  const media = window.matchMedia("(max-width: 720px)");
  const syncViewport = (): void => {
    compactViewport.set(media.matches);
    if (!media.matches) closeMobileMenu();
  };
  syncViewport();
  media.addEventListener?.("change", syncViewport);
  removeViewportListener = () => media.removeEventListener?.("change", syncViewport);
});

onUnmounted(() => {
  removeHashListener();
  removeViewportListener();
  clearRouteLoadingHooks();
});

defineStyle(styles);

const App = defineHtml(`
  <elf-config-provider :config.prop=${providerConfig()}>
    <elf-locale-provider
      :name=${localeName.value}
      :messages.prop=${currentMessages()}
    >
      <elf-progress
        v-if=${routeLoading.value}
        class="route-progress"
        indeterminate
        hide-value
        color="#1976d2"
        height="3px"
        stroke-linecap="butt"
        :duration=${1.2}
      ></elf-progress>

      <elf-layout v-if=${isHome()} class="home-shell">
        <elf-loading
          class="home-route-loading"
          :loading=${routeLoading.value}
          :text=${text("正在加载页面", "Loading page")}
          background="var(--elf-bg-page, var(--elf-bg-paper))"
        >
          <elf-router-view></elf-router-view>
        </elf-loading>
      </elf-layout>
      <elf-layout v-else>
        <elf-header height="64px">
          <button class="brand" type="button" :aria-label=${appMessage("home")} @click=${goHome}>
            <img class="brand-logo" src="/logo.png" alt="ElfUI logo" />
            <span>ElfUI</span>
          </button>
          <span class="spacer"></span>
          <elf-button
            ref="languageTrigger"
            class="header-action language-action"
            variant="text"
            size="md"
            circle
            :aria-label=${appMessage("language")}
            :title=${appMessage("language")}
          >
            <svg class="language-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d=${mdiTranslate}></path></svg>
          </elf-button>
          <elf-dropdown
            ref="languageDropdown"
            class="language-dropdown"
            virtual-triggering
            trigger="click"
            placement="bottom-end"
            :items.prop=${languageItems()}
            :showArrow.prop=${false}
            @command=${onLanguageCommand}
          ></elf-dropdown>
          <elf-button class="header-action skin-action" variant="text" size="md" circle :aria-label=${appMessage("skin")} :title=${appMessage("skin")} @click=${cycleSkin}><svg class="skin-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d=${mdiThemeLightDark}></path></svg></elf-button>
          <elf-button class="header-action icon-action" variant="text" size="md" circle :aria-label=${appMessage("collapse")} :title=${appMessage("collapse")} @click=${toggleCollapsed}><svg class="collapse-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d=${collapseIcon()}></path></svg></elf-button>
        </elf-header>

        <elf-layout direction="horizontal">
          <elf-aside :class=${{ "app-aside": true, "mobile-open": mobileMenuOpen.value }} :width=${collapsed.value ? "68px" : "264px"}>
            <elf-menu
              v-if=${isEnglish()}
              key="en-menu"
              class="app-menu"
              width="100%"
              searchable
              unique-opened
              :search-placeholder=${appMessage("search")}
              :items=${menuItems.value}
              :modelValue=${active.value}
              :collapse=${collapsed.value}
              router
              @select=${onSelect}
              @collapse-change=${onCollapseChange}
            ></elf-menu>
            <elf-menu
              v-else
              key="zh-menu"
              class="app-menu"
              width="100%"
              searchable
              unique-opened
              :search-placeholder=${appMessage("search")}
              :items=${menuItems.value}
              :modelValue=${active.value}
              :collapse=${collapsed.value}
              router
              @select=${onSelect}
              @collapse-change=${onCollapseChange}
            ></elf-menu>
          </elf-aside>

          <button
            v-if=${compactViewport.value && mobileMenuOpen.value}
            class="nav-scrim"
            type="button"
            :aria-label=${appMessage("closeNavigation")}
            @click=${closeMobileMenu}
          ></button>

          <elf-loading
            class="route-loading"
            :loading=${routeLoading.value}
            :text=${text("正在加载页面", "Loading page")}
            background="var(--elf-bg-page, var(--elf-bg-paper))"
          >
            <div class="docs-scroll">
              <div class="docs-layout">
                <elf-main>
                  <elf-router-view></elf-router-view>
                </elf-main>
                <elf-docs-toc
                  :routeKey=${active.value + ":" + localeName.value}
                  :label=${tocLabel()}
                ></elf-docs-toc>
              </div>
            </div>
          </elf-loading>
        </elf-layout>

        <elf-footer height="40px">© 2026 ElfUI · ${appMessage("footer")}</elf-footer>
      </elf-layout>
    </elf-locale-provider>
  </elf-config-provider>
`);

export { App };
