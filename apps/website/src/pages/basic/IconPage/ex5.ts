import { defineHtml, defineStyle, onMounted, useRef } from "@elfui/core";
import { mdiGithub, mdiGitlab, mdiGoogle, mdiMicrosoft } from "@mdi/js";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const GOOGLE_COLOR = "#4285f4";
const MICROSOFT_COLOR = "#00a4ef";
const GITLAB_COLOR = "#fc6d26";

const documentScheme = useRef<"light" | "dark">("light");
let schemeObserver: MutationObserver | undefined;

const syncDocumentScheme = (): void => {
  const theme = document.documentElement.getAttribute("data-theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  documentScheme.set(theme === "dark" || (theme !== "light" && prefersDark) ? "dark" : "light");
};

const githubColor = (): string => (documentScheme.value === "dark" ? "#e6edf3" : "#24292e");

onMounted(() => {
  syncDocumentScheme();
  schemeObserver = new MutationObserver(syncDocumentScheme);
  schemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => {
    schemeObserver?.disconnect();
    schemeObserver = undefined;
  };
});

const t = createDocsTranslator({
  title: { zh: "第三方 SVG", en: "Third-party SVG" },
  status: {
    zh: "品牌图标经默认插槽放入，尺寸与颜色仍由 elf-icon 统一控制。",
    en: "Brand icons go through the default slot; size and color stay controlled by elf-icon.",
  },
  signInTitle: { zh: "登录 ElfUI", en: "Sign in to ElfUI" },
  or: { zh: "或使用第三方账号继续", en: "or continue with" },
  github: { zh: "使用 GitHub 继续", en: "Continue with GitHub" },
  google: { zh: "使用 Google 继续", en: "Continue with Google" },
  microsoft: { zh: "使用 Microsoft 继续", en: "Continue with Microsoft" },
  spec: { zh: "图标规格", en: "Icon spec" },
});

const brandButtons = () => [
  { label: t("github"), color: githubColor(), path: mdiGithub },
  { label: t("google"), color: GOOGLE_COLOR, path: mdiGoogle },
  { label: t("microsoft"), color: MICROSOFT_COLOR, path: mdiMicrosoft },
];

const specIcons = () => [
  { size: 16, color: githubColor(), path: mdiGithub },
  { size: 20, color: GOOGLE_COLOR, path: mdiGoogle },
  { size: 32, color: GITLAB_COLOR, path: mdiGitlab },
];

const code = `<div class="icon-brand-panel">
  <strong>Sign in to ElfUI</strong>
  <button type="button" class="icon-brand-button">
    <elf-icon size="18" :color="githubColor()">
      <svg viewBox="0 0 24 24"><path :d="githubPath"></path></svg>
    </elf-icon>
    <span>Continue with GitHub</span>
  </button>
</div>`;

const script = `// 品牌 SVG 直接放入默认插槽，尺寸与颜色仍由 elf-icon 控制。
// githubColor() 亮色返回深灰、暗色返回浅灰，避免品牌图标在暗色中不可见。
// Brand SVG goes into the default slot; elf-icon keeps size and color control.`;

defineStyle(styles);

const PageIconEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="icon-demo-status">${t("status")}</span>

    <div class="icon-brand-panel">
      <strong class="icon-brand-title">${t("signInTitle")}</strong>
      <span class="icon-brand-or">${t("or")}</span>
      <div class="icon-brand-buttons">
        <button
          v-for="button in brandButtons()"
          :key="button.label"
          type="button"
          class="icon-brand-button"
        >
          <elf-icon :size=${18} :color="button.color">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="button.path"></path></svg>
          </elf-icon>
          <span>{{ button.label }}</span>
        </button>
      </div>
      <div class="icon-brand-spec">
        <span>${t("spec")}</span>
        <span v-for="icon in specIcons()" :key="icon.size" class="icon-brand-spec-item">
          <elf-icon :size="icon.size" :color="icon.color">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="icon.path"></path></svg>
          </elf-icon>
          <small>{{ icon.size }}px</small>
        </span>
      </div>
    </div>
  </elf-playground>
`);

export { PageIconEx5 };
