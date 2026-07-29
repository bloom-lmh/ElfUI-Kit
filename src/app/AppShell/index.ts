import {
  getActiveRouter } from "@elfui/router";
import {
  defineHtml,
  defineStyle,
  onMounted,
  onUnmounted,
  useComputed,
  useEffect,
  useRef
} from "@elfui/core";

import type { LocaleMessages } from "../../components/Providers/context";
import type { ElfUIConfig } from "../../components/Providers/config";
import { navItems } from "../../routes";
import { APP_SKINS, type AppSkin } from "../skins";
import styles from "./style.scss?inline";

const SKIN_KEY = "elfui-ui-skin";
const LEGACY_THEME_KEY = "elfui-ui-theme";
const LOCALE_KEY = "elfui-ui-locale";

interface AppMenuItem {
  index: string;
  label: string;
  icon: string;
  children?: AppMenuItem[];
}

const ICONS: Record<string, string> = {
  "Guide 指南": "G",
  "Layout 布局": "L",
  "Basic 基础": "B",
  "Form 表单": "F",
  "Feedback 反馈": "M",
  "Data 数据展示": "D",
  "Navigation 导航": "N",
  "Picker 选择器": "P"
};

const APP_MESSAGES: Record<string, LocaleMessages> = {
  "zh-CN": {
    app: { search: "搜索组件…", collapse: "切换侧栏", language: "切换为英文", skin: "切换主题皮肤", footer: "组件库与设计系统", home: "返回首页", closeNavigation: "关闭导航" },
    home: {
      eyebrow: "面向产品团队的 Web Components",
      titleLead: "构建精致界面，",
      titleAccent: "不再绑定框架。",
      description: "ElfUI 将稳定的组件契约、Material 设计语言与原生 Web 标准组合在一起，让设计系统真正跨项目复用。",
      primaryAction: "浏览组件", secondaryAction: "查看 Provider", proofLabel: "项目指标",
      proofComponents: "组件与模式", proofTests: "自动化测试", proofRuntime: "框架依赖",
      visualLabel: "ElfUI 仪表盘界面预览", live: "实时", visualEyebrow: "工作空间", visualTitle: "运营概览",
      metricRevenue: "本月收入", metricUsers: "活跃用户", metricActivity: "项目活跃度", metricWeek: "最近 7 天", visualReady: "系统运行正常",
      principlesEyebrow: "为长期维护而设计", principlesTitle: "一套组件系统，三个清晰原则。",
      principlesDescription: "从组件边界到主题与无障碍，每层都保持可预测、可测试，也方便团队继续扩展。",
      principleOneTitle: "原生且可组合", principleOneDescription: "基于 Custom Elements 与 Shadow DOM，适配任何框架，也能直接在浏览器中使用。",
      principleTwoTitle: "设计语言集中管理", principleTwoDescription: "主题、语言、默认值和图标通过 Provider 统一下发，业务组件只关心自己的内容。",
      principleThreeTitle: "交互质量可验证", principleThreeDescription: "键盘、焦点、表单语义与边界状态进入组件契约，并由严格测试持续保护。",
      starterEyebrow: "从真实场景开始", starterTitle: "选择一种模式，快速建立第一块界面。",
      starterDescription: "每个组件页面都包含交互案例、源码、API 表格和边界行为说明。",
      starterForm: "搭建表单流程", starterData: "构建数据工作台", starterLayout: "规划响应式布局",
      codeTitle: "Provider 驱动配置", codeComment: "在应用入口集中配置"
    }
  },
  "en-US": {
    app: { search: "Search components…", collapse: "Toggle sidebar", language: "Switch to Chinese", skin: "Switch theme skin", footer: "Component library and design system", home: "Back to home", closeNavigation: "Close navigation" },
    home: {
      eyebrow: "Web Components for product teams",
      titleLead: "Ship polished interfaces,",
      titleAccent: "without framework lock-in.",
      description: "ElfUI combines stable component contracts, Material design language, and native web standards so your design system can travel across products.",
      primaryAction: "Explore components", secondaryAction: "View Providers", proofLabel: "Project metrics",
      proofComponents: "components & patterns", proofTests: "automated tests", proofRuntime: "framework dependencies",
      visualLabel: "ElfUI dashboard interface preview", live: "Live", visualEyebrow: "Workspace", visualTitle: "Operations overview",
      metricRevenue: "Monthly revenue", metricUsers: "Active users", metricActivity: "Project activity", metricWeek: "Last 7 days", visualReady: "All systems operational",
      principlesEyebrow: "Built for the long run", principlesTitle: "One component system. Three clear principles.",
      principlesDescription: "From component boundaries to themes and accessibility, every layer stays predictable, testable, and ready for teams to extend.",
      principleOneTitle: "Native and composable", principleOneDescription: "Built on Custom Elements and Shadow DOM, it works across frameworks or directly in the browser.",
      principleTwoTitle: "Design language, centralized", principleTwoDescription: "Themes, locale, defaults, and icons flow through Providers while product components stay focused on content.",
      principleThreeTitle: "Interaction quality, verified", principleThreeDescription: "Keyboard, focus, form semantics, and boundary states are part of the contract and protected by strict tests.",
      starterEyebrow: "Start with a real pattern", starterTitle: "Choose a path and assemble your first interface.",
      starterDescription: "Every component page includes interactive examples, source, API tables, and boundary behavior.",
      starterForm: "Build a form flow", starterData: "Create a data workspace", starterLayout: "Plan a responsive layout",
      codeTitle: "Provider-driven setup", codeComment: "Configure once at the application root"
    }
  }
};

const readStorage = (key: string, fallback: string): string => {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
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
  const stripped = label.replace(/[\u3400-\u9fff\u3000-\u303f]+/g, "").replace(/\s+/g, " ").trim();
  return stripped || label;
};

const chineseLabel = (label: string): string => {
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
let removeHashListener = (): void => {};
let removeViewportListener = (): void => {};

// Derived state
const currentSkin = (): AppSkin => APP_SKINS.find((skin) => skin.id === skinName.value) || APP_SKINS[0]!;
const isEnglish = (): boolean => localeName.value === "en-US";
const currentMessages = (): LocaleMessages => APP_MESSAGES[localeName.value] || APP_MESSAGES["zh-CN"]!;
const providerConfig = (): ElfUIConfig => ({
  locale: { name: localeName.value, messages: currentMessages() },
  theme: {
    theme: currentSkin().providerTheme,
    tokens: currentSkin().tokens,
  },
});
const text = (zh: string, en: string): string => isEnglish() ? en : zh;
const localizeLabel = (label: string): string =>
  isEnglish() ? englishLabel(label) : chineseLabel(label);
const collapseIcon = (): string => compactViewport.value
  ? (mobileMenuOpen.value ? "✕" : "☰")
  : (collapsed.value ? "☰" : "✕");
const languageLabel = (): string => isEnglish() ? "中文" : "English";
const skinLabel = (): string => `● ${currentSkin().label}`;
const appMessage = (key: string): string => String((currentMessages().app as Record<string, string>)[key] || key);
const isHome = (): boolean => active.value === "/" || active.value === "";

const menuItems = useComputed((): AppMenuItem[] => {
  const groups: Record<string, AppMenuItem[]> = {};
  const top: AppMenuItem[] = [];
  for (const { to, text: label, group } of navItems) {
    const item = { index: to, label: localizeLabel(label), icon: ICONS[label] || "" };
    if (group) (groups[group] ??= []).push(item);
    else top.push(item);
  }
  for (const [group, children] of Object.entries(groups)) {
    top.push({ index: `group:${group}`, label: localizeLabel(group), icon: ICONS[group] || "", children });
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
  try { localStorage.setItem(SKIN_KEY, skinName.value); } catch { /* storage unavailable */ }
};

const toggleLocale = (): void => {
  localeName.set(isEnglish() ? "zh-CN" : "en-US");
  applyDocumentSkin();
  try { localStorage.setItem(LOCALE_KEY, localeName.value); } catch { /* storage unavailable */ }

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

const toggleCollapsed = (): void => {
  if (compactViewport.value) {
    mobileMenuOpen.set(!mobileMenuOpen.value);
    return;
  }
  collapsed.set(!collapsed.value);
};

const closeMobileMenu = (): void => mobileMenuOpen.set(false);

const goHome = (): void => {
  closeMobileMenu();
  active.set("/");
  const router = getActiveRouter();
  if (router) void router.push("/");
  else if (typeof window !== "undefined") window.location.hash = "/";
};

const onSelect = (event: Event): void => {
  const next = String((event as CustomEvent).detail ?? "/");
  closeMobileMenu();
  active.set(next);
  const router = getActiveRouter();
  if (router) void router.push(next);
  else if (typeof window !== "undefined" && next.startsWith("/")) window.location.hash = next;
};

const onCollapseChange = (event: Event): void => collapsed.set(Boolean((event as CustomEvent).detail));

// Effects and lifecycle
useEffect(() => {
  const router = getActiveRouter();
  if (router) active.set(router.current.value.path);
});

onMounted(() => {
  applyDocumentSkin();
  active.set(readCurrentPath());
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
});

defineStyle(styles);

const App = defineHtml(`
  <elf-config-provider :config.prop=${providerConfig()}>
    <elf-locale-provider
      :name=${localeName.value}
      :messages.prop=${currentMessages()}
    >
      <elf-layout v-if=${isHome()} class="home-shell">
        <elf-router-view></elf-router-view>
      </elf-layout>
      <elf-layout v-else>
        <elf-header height="64px">
          <button class="brand" type="button" :aria-label=${appMessage("home")} @click=${goHome}>
            <img class="brand-logo" src="/logo.png" alt="ElfUI logo" />
            <span>ElfUI</span>
          </button>
          <span class="spacer"></span>
          <elf-button class="header-action" variant="text" size="sm" :title=${appMessage("language")} @click=${toggleLocale}>${languageLabel()}</elf-button>
          <elf-button class="header-action skin-action" variant="text" size="sm" :title=${appMessage("skin")} @click=${cycleSkin}>${skinLabel()}</elf-button>
          <elf-button class="header-action icon-action" variant="text" size="sm" :title=${appMessage("collapse")} @click=${toggleCollapsed}>${collapseIcon()}</elf-button>
        </elf-header>

        <elf-layout direction="horizontal">
          <elf-aside :class=${{ "app-aside": true, "mobile-open": mobileMenuOpen.value }} :width=${collapsed.value ? "68px" : "264px"}>
            <elf-menu
              v-if=${isEnglish()}
              key="en-menu"
              class="app-menu"
              searchable
              unique-opened
              :search-placeholder=${appMessage("search")}
              :items=${menuItems.value}
              :modelValue=${active.value}
              :collapse=${collapsed.value}
              @update:modelValue=${onSelect}
              @collapse-change=${onCollapseChange}
            ></elf-menu>
            <elf-menu
              v-else
              key="zh-menu"
              class="app-menu"
              searchable
              unique-opened
              :search-placeholder=${appMessage("search")}
              :items=${menuItems.value}
              :modelValue=${active.value}
              :collapse=${collapsed.value}
              @update:modelValue=${onSelect}
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

          <div class="docs-scroll">
            <div class="docs-layout">
              <elf-main>
                <elf-router-view></elf-router-view>
              </elf-main>
              <elf-docs-toc
                :routeKey=${active.value + ":" + localeName.value}
                :label=${text("本页目录", "On this page")}
              ></elf-docs-toc>
            </div>
          </div>
        </elf-layout>

        <elf-footer height="40px">© 2026 ElfUI · ${appMessage("footer")}</elf-footer>
      </elf-layout>
    </elf-locale-provider>
  </elf-config-provider>
`);

export { App };
