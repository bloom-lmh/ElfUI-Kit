import { defineHtml, defineStyle } from "@elfui/core";
import {
  mdiAccountGroupOutline,
  mdiCogOutline,
  mdiContentCopy,
  mdiLockOutline,
  mdiStarOutline,
} from "@mdi/js";

import { createSvgIconSet } from "../../../components/Basic/Icon";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./hero.scss?inline";

const t = createDocsTranslator({
  illustration: { zh: "数据洞察卡片", en: "Analytics card" },
  iconCard: { zh: "团队空间卡片", en: "Workspace card" },
  brandBanner: { zh: "发布中心卡片", en: "Release card" },
  centered: { zh: "设计系统卡片", en: "Design system card" },
  dark: { zh: "安全中心卡片", en: "Security card" },

  analyticsEyebrow: { zh: "数据产品 / 经营看板", en: "Data products / Overview" },
  analyticsTitle: { zh: "数据洞察", en: "Analytics overview" },
  analyticsDesc: {
    zh: "汇总核心指标、实时趋势与异常提醒。",
    en: "Bring core metrics, live trends, and anomaly alerts together.",
  },
  analyticsCategory: { zh: "数据展示", en: "Data display" },

  workspaceEyebrow: { zh: "协作中心 / 团队", en: "Collaboration / Teams" },
  workspaceTitle: { zh: "团队空间", en: "Team workspace" },
  workspaceDesc: {
    zh: "集中管理成员、项目和共享资源。",
    en: "Manage members, projects, and shared resources.",
  },
  workspaceCategory: { zh: "团队协作", en: "Collaboration" },

  releaseEyebrow: { zh: "开发工具 / 发布", en: "Developer tools / Releases" },
  releaseTitle: { zh: "发布中心", en: "Release center" },
  releaseDesc: {
    zh: "查看构建、版本和环境发布进度。",
    en: "Review build, version, and environment progress.",
  },
  releaseCategory: { zh: "开发工具", en: "Developer tools" },

  designEyebrow: { zh: "设计资源 / 规范", en: "Design resources / Guidelines" },
  designTitle: { zh: "设计系统", en: "Design system" },
  designDesc: {
    zh: "统一组件、设计令牌与体验规范。",
    en: "Unify components, design tokens, and experience guidelines.",
  },
  designCategory: { zh: "设计资源", en: "Design resources" },

  securityEyebrow: { zh: "平台能力 / 安全", en: "Platform / Security" },
  securityTitle: { zh: "安全中心", en: "Security center" },
  securityDesc: {
    zh: "查看访问策略、风险事件和审计记录。",
    en: "Review access policies, risk events, and audit trails.",
  },
  securityCategory: { zh: "平台服务", en: "Platform services" },

  favorite: { zh: "收藏", en: "Favorite" },
  copy: { zh: "复制", en: "Copy" },
  settings: { zh: "设置", en: "Settings" },
});

const pageHeaderIconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      workspace: mdiAccountGroupOutline,
      lock: mdiLockOutline,
      favorite: mdiStarOutline,
      copy: mdiContentCopy,
      settings: mdiCogOutline,
    }),
  },
};

type ExampleCopy = {
  eyebrow: string;
  title: string;
  tag: string;
  description: string;
  category: string;
};

const source = (
  copy: ExampleCopy,
  variant: "banner" | "card",
  extras = "",
): string => `<elf-page-header
  mode="hero"
  variant="${variant}"
  eyebrow="${copy.eyebrow}"
  title="${copy.title}"
  tag="${copy.tag}"
  description="${copy.description}"
  ${extras}
>
  <div slot="meta">${copy.category} · v1.0.0</div>
</elf-page-header>`;

defineStyle(styles);

const analytics = (): ExampleCopy => ({
  eyebrow: t("analyticsEyebrow"),
  title: t("analyticsTitle"),
  tag: "Analytics",
  description: t("analyticsDesc"),
  category: t("analyticsCategory"),
});
const workspace = (): ExampleCopy => ({
  eyebrow: t("workspaceEyebrow"),
  title: t("workspaceTitle"),
  tag: "Workspace",
  description: t("workspaceDesc"),
  category: t("workspaceCategory"),
});
const release = (): ExampleCopy => ({
  eyebrow: t("releaseEyebrow"),
  title: t("releaseTitle"),
  tag: "Releases",
  description: t("releaseDesc"),
  category: t("releaseCategory"),
});
const design = (): ExampleCopy => ({
  eyebrow: t("designEyebrow"),
  title: t("designTitle"),
  tag: "Design",
  description: t("designDesc"),
  category: t("designCategory"),
});
const security = (): ExampleCopy => ({
  eyebrow: t("securityEyebrow"),
  title: t("securityTitle"),
  tag: "Security",
  description: t("securityDesc"),
  category: t("securityCategory"),
});

const PagePageHeaderEx3 = defineHtml(`
  <elf-icon-provider :options.prop=${pageHeaderIconOptions}>
    <elf-playground :title=${t("illustration")} :code=${source(analytics(), "banner")}>
      <div class="page-header-gallery">
        <elf-page-header mode="hero" variant="banner" :eyebrow=${analytics().eyebrow} :title=${analytics().title} :tag=${analytics().tag} :description=${analytics().description}>
          <div slot="meta" class="hero-meta-line">
            <elf-icon name="lock" size="15"></elf-icon><span>${analytics().category}</span><span class="meta-separator" aria-hidden="true"></span><span>v1.0.0</span>
          </div>
          <div slot="extra" class="hero-actions">
            <elf-button class="hero-favorite" size="sm" variant="outlined" :aria-label=${t("favorite")}><elf-icon name="favorite" size="18"></elf-icon><span>28</span></elf-button>
            <elf-button class="hero-icon-action" circle size="sm" variant="text" bg :aria-label=${t("copy")}><elf-icon name="copy" size="18"></elf-icon></elf-button>
            <elf-button class="hero-icon-action" circle size="sm" variant="text" bg :aria-label=${t("settings")}><elf-icon name="settings" size="18"></elf-icon></elf-button>
          </div>
        </elf-page-header>
      </div>
    </elf-playground>

    <elf-playground :title=${t("iconCard")} :code=${source(workspace(), "card")}>
      <div class="page-header-gallery">
        <elf-page-header mode="hero" variant="card" :eyebrow=${workspace().eyebrow} :title=${workspace().title} :tag=${workspace().tag} :description=${workspace().description}>
          <elf-icon slot="icon" name="workspace" size="30"></elf-icon>
          <div slot="meta" class="hero-meta-line">
            <elf-icon name="lock" size="15"></elf-icon><span>${workspace().category}</span><span class="meta-separator" aria-hidden="true"></span><span>v1.0.0</span>
          </div>
          <div slot="extra" class="hero-actions">
            <elf-button class="hero-favorite" size="sm" variant="outlined" :aria-label=${t("favorite")}><elf-icon name="favorite" size="18"></elf-icon><span>28</span></elf-button>
            <elf-button class="hero-icon-action" circle size="sm" variant="text" bg :aria-label=${t("copy")}><elf-icon name="copy" size="18"></elf-icon></elf-button>
            <elf-button class="hero-icon-action" circle size="sm" variant="text" bg :aria-label=${t("settings")}><elf-icon name="settings" size="18"></elf-icon></elf-button>
          </div>
        </elf-page-header>
      </div>
    </elf-playground>

    <elf-playground :title=${t("brandBanner")} :code=${source(release(), "banner", 'tone="primary"')}>
      <div class="page-header-gallery">
        <elf-page-header mode="hero" variant="banner" tone="primary" :eyebrow=${release().eyebrow} :title=${release().title} :tag=${release().tag} :description=${release().description}>
          <div slot="meta" class="hero-meta-line">
            <elf-icon name="lock" size="15"></elf-icon><span>${release().category}</span><span class="meta-separator" aria-hidden="true"></span><span>v1.0.0</span>
          </div>
          <div slot="extra" class="hero-actions">
            <elf-button class="hero-favorite" size="sm" variant="outlined" :aria-label=${t("favorite")}><elf-icon name="favorite" size="18"></elf-icon><span>28</span></elf-button>
            <elf-button class="hero-icon-action" circle size="sm" variant="text" bg :aria-label=${t("copy")}><elf-icon name="copy" size="18"></elf-icon></elf-button>
            <elf-button class="hero-icon-action" circle size="sm" variant="text" bg :aria-label=${t("settings")}><elf-icon name="settings" size="18"></elf-icon></elf-button>
          </div>
        </elf-page-header>
      </div>
    </elf-playground>

    <elf-playground :title=${t("centered")} :code=${source(design(), "banner", 'align="center"')}>
      <div class="page-header-gallery">
        <elf-page-header mode="hero" variant="banner" align="center" :eyebrow=${design().eyebrow} :title=${design().title} :tag=${design().tag} :description=${design().description}>
          <div slot="meta" class="hero-meta-line">
            <elf-icon name="lock" size="15"></elf-icon><span>${design().category}</span><span class="meta-separator" aria-hidden="true"></span><span>v1.0.0</span>
          </div>
        </elf-page-header>
      </div>
    </elf-playground>

    <elf-playground :title=${t("dark")} :code=${source(security(), "banner", 'tone="dark"')}>
      <div class="page-header-gallery">
        <elf-page-header mode="hero" variant="banner" tone="dark" :eyebrow=${security().eyebrow} :title=${security().title} :tag=${security().tag} :description=${security().description}>
          <div slot="meta" class="hero-meta-line">
            <elf-icon name="lock" size="15"></elf-icon><span>${security().category}</span><span class="meta-separator" aria-hidden="true"></span><span>v1.0.0</span>
          </div>
          <div slot="extra" class="hero-actions">
            <elf-button class="hero-favorite" size="sm" variant="outlined" :aria-label=${t("favorite")}><elf-icon name="favorite" size="18"></elf-icon><span>28</span></elf-button>
            <elf-button class="hero-icon-action" circle size="sm" variant="text" bg dark :aria-label=${t("copy")}><elf-icon name="copy" size="18"></elf-icon></elf-button>
            <elf-button class="hero-icon-action" circle size="sm" variant="text" bg dark :aria-label=${t("settings")}><elf-icon name="settings" size="18"></elf-icon></elf-button>
          </div>
        </elf-page-header>
      </div>
    </elf-playground>
  </elf-icon-provider>
`);

export { PagePageHeaderEx3 };
