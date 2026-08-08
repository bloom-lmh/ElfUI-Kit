import { defineHtml, defineStyle, useComponents } from "@elfui/core";

import { Link } from "@elfui/kit-src/components/Basic/Link";
import { useLocaleProvider } from "@elfui/kit-src/components/Providers/context";
import { createDocsPicker, createDocsTranslator } from "../docsLocale";
import styles from "./style.scss?inline";

const HOME_MESSAGES = {
  eyebrow: { zh: "面向产品团队的 Web Components", en: "Web Components for product teams" },
  titleLead: { zh: "构建精致界面，", en: "Ship polished interfaces," },
  titleAccent: {
    zh: "原生 Web Components 组件库。",
    en: "a native Web Components library.",
  },
  description: {
    zh: "ElfUI 将稳定的组件契约、Material 设计语言与原生 Web 标准组合在一起，让设计系统真正跨项目复用。",
    en: "ElfUI combines stable component contracts, Material design language, and native web standards so your design system can travel across products.",
  },
  primaryAction: { zh: "浏览组件", en: "Explore components" },
  secondaryAction: { zh: "查看 Provider", en: "View Providers" },
  proofLabel: { zh: "项目指标", en: "Project metrics" },
  proofComponents: { zh: "组件与模式", en: "components & patterns" },
  proofTests: { zh: "自动化测试", en: "automated tests" },
  proofRuntime: { zh: "框架依赖", en: "framework dependencies" },
  visualLabel: { zh: "ElfUI 仪表盘界面预览", en: "ElfUI dashboard interface preview" },
  live: { zh: "实时", en: "Live" },
  visualEyebrow: { zh: "工作空间", en: "Workspace" },
  visualTitle: { zh: "运营概览", en: "Operations overview" },
  metricRevenue: { zh: "本月收入", en: "Monthly revenue" },
  metricUsers: { zh: "活跃用户", en: "Active users" },
  metricActivity: { zh: "项目活跃度", en: "Project activity" },
  metricWeek: { zh: "最近 7 天", en: "Last 7 days" },
  visualReady: { zh: "系统运行正常", en: "All systems operational" },
} as const;

// Injected context
const locale = useLocaleProvider();

// Derived content
const fallbackT = createDocsTranslator(HOME_MESSAGES);
const t = (key: keyof typeof HOME_MESSAGES): string => {
  const path = `home.${key}`;
  const translated = locale.t(path);
  return translated === path ? fallbackT(key) : translated;
};
const pick = createDocsPicker();

useComponents({ "elf-link": Link });
defineStyle(styles);

const PageHome = defineHtml(`
  <main class="home">
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-dot"></span>${t("eyebrow")}</div>
        <h1 id="home-title">ELFUI-KIT</h1>
        <p class="hero-tagline">${t("titleLead")} <span>${t("titleAccent")}</span></p>
        <p class="hero-description">${t("description")}</p>

        <div class="hero-actions">
          <elf-link class="action action-primary" to="/overview" .underline=${false}>
            ${t("primaryAction")}<span aria-hidden="true">→</span>
          </elf-link>
          <elf-link class="action action-secondary" to="/providers/theme" .underline=${false}>
            ${t("secondaryAction")}<span aria-hidden="true">↗</span>
          </elf-link>
        </div>

        <div class="proof" :aria-label=${t("proofLabel")}>
          <span><b>90+</b>${t("proofComponents")}</span>
          <span><b>900+</b>${t("proofTests")}</span>
          <span><b>0</b>${t("proofRuntime")}</span>
        </div>
      </div>

      <div class="hero-visual" :aria-label=${t("visualLabel")}>
        <div class="visual-glow"></div>
        <div class="window">
          <div class="window-bar">
            <span class="window-dots"><i></i><i></i><i></i></span>
            <span>dashboard.ts</span>
            <span class="window-status">${t("live")}</span>
          </div>
          <div class="window-body">
            <div class="mini-nav">
              <span class="mini-brand">E</span>
              <span class="mini-line is-active"></span>
              <span class="mini-line"></span>
              <span class="mini-line is-short"></span>
            </div>
            <div class="mini-content">
              <div class="mini-heading">
                <span><small>${t("visualEyebrow")}</small>${t("visualTitle")}</span>
                <i></i>
              </div>
              <div class="metric-grid">
                <article><small>${t("metricRevenue")}</small><b>${pick("¥ 86,420", "$86,420")}</b><em>+18.4%</em></article>
                <article><small>${t("metricUsers")}</small><b>12,860</b><em>+9.2%</em></article>
              </div>
              <div class="chart-card">
                <div class="chart-title"><span>${t("metricActivity")}</span><small>${t("metricWeek")}</small></div>
                <div class="chart" aria-hidden="true">
                  <i style="--h:34%"></i><i style="--h:52%"></i><i style="--h:44%"></i>
                  <i style="--h:72%"></i><i style="--h:62%"></i><i style="--h:88%"></i><i style="--h:76%"></i>
                </div>
              </div>
              <div class="floating-chip"><span>✓</span>${t("visualReady")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
`);

export { PageHome };
