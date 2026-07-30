import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "导航组件", en: "Navigation" },
  title: { zh: "页脚", en: "Footer" },
  description: { zh: "组织站点级导航、品牌说明、社交入口与版权信息，支持多行内容和定位布局。", en: "Organize site navigation, brand context, social entry points, and copyright information with multi-row and positioned layouts." },
  company: { zh: "公司页脚", en: "Company footer" },
  socialFooter: { zh: "品牌社交页脚", en: "Brand social footer" },
  connected: { zh: "连接型页脚", en: "Connected footer" },
  home: { zh: "首页", en: "Home" },
  about: { zh: "关于我们", en: "About us" },
  team: { zh: "团队", en: "Team" },
  services: { zh: "服务", en: "Services" },
  journal: { zh: "日志", en: "Journal" },
  contact: { zh: "联系我们", en: "Contact us" },
  social: { zh: "在社交网络上与 ElfUI 保持联系", en: "Stay connected with ElfUI across social channels" },
  body: { zh: "组件、设计令牌和工程实践集中在一个清晰的界面体系中。", en: "Components, design tokens, and engineering practices in one coherent interface system." },
  newsletter: { zh: "产品更新", en: "Product updates" },
  newsletterDesc: { zh: "每月一封，包含新组件、迁移说明和案例。", en: "A monthly note with components, migration guidance, and examples." },
  subscribe: { zh: "订阅", en: "Subscribe" },
  status: { zh: "最近操作", en: "Last action" },
  none: { zh: "尚未操作", en: "No action yet" },
  toggleTheme: { zh: "切换预览明暗", en: "Toggle preview theme" },
  api: { zh: "API", en: "API" },
  slots: { zh: "插槽", en: "Slots" }
});
const pick = createDocsPicker();

const dark = useRef(false);
const lastAction = useRef("");
const demoTheme = (): string => dark.value ? "dark" : "light";
const toggleTheme = (): void => dark.set(!dark.value);
const links = () => [t("home"), t("about"), t("team"), t("services"), t("journal"), t("contact")];
const onLink = (event: MouseEvent): void => {
  event.preventDefault();
  lastAction.set((event.currentTarget as HTMLElement).textContent?.trim() || "");
};
const onSocial = (event: MouseEvent): void => lastAction.set((event.currentTarget as HTMLElement).getAttribute("aria-label") || "");
const onSubscribe = (): void => lastAction.set(t("subscribe"));

const propsRows = () => [
  { name: "height / width / maxWidth", type: "string | number", default: "60px / 100% / auto", desc: pick("兼容布局高度并约束页脚宽度", "Layout-compatible height and footer width constraints.") },
  { name: "ariaLabel", type: "string", default: "''", desc: pick("页脚地标的无障碍名称", "Accessible name for the footer landmark.") },
  { name: "color / elevation", type: "string / number", default: "surface / 0", desc: pick("自动对比前景色和阴影层级", "Automatic foreground contrast and elevation.") },
  { name: "border / rounded / padless", type: "boolean", default: "false", desc: pick("边框、圆角与无内边距表面", "Bordered, rounded, and padless surfaces.") },
  { name: "fixed / absolute / inset", type: "boolean", default: "false", desc: pick("底部定位和内嵌边距", "Bottom positioning and inset spacing.") }
];
const slotRows = () => ["top", "default", "bottom"].map((name) => ({ name, desc: pick(`${name} 内容区域`, `${name} content region.`) }));
const companyCode = `<elf-footer height="auto" border rounded>
  <nav>Home About Team Services Journal Contact</nav>
  <span>2026 / ElfUI</span>
</elf-footer>`;
const socialCode = `<elf-footer height="auto" color="#365c88" rounded>...</elf-footer>`;
const connectedCode = `<elf-footer height="auto" color="#087f72" rounded padless>...</elf-footer>`;

defineStyle(articleStyles, `
  .demo-toolbar { display: flex; flex-wrap: wrap; gap: 8px; }
  .demo-stack { display: grid; width: 100%; gap: 12px; }
  .footer-stage { width: min(900px, 100%); padding: 12px; background: var(--elf-bg-default); }
  .company-footer { display: grid; width: 100%; gap: 22px; padding: 26px 22px; text-align: center; }
  .footer-links { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px 28px; }
  .footer-links a { position: relative; color: inherit; font-size: 13px; font-weight: 700; text-decoration: none; }
  .footer-links a::after { position: absolute; right: 0; bottom: -5px; left: 0; height: 2px; background: currentColor; content: ""; opacity: 0; transform: scaleX(.4); transition: opacity var(--elf-transition-fast), transform var(--elf-transition-fast); }
  .footer-links a:hover::after, .footer-links a:focus-visible::after { opacity: 1; transform: scaleX(1); }
  .footer-links a:focus-visible { outline: 2px solid currentColor; outline-offset: 5px; }
  .brand-footer { display: grid; width: 100%; gap: 22px; padding: 30px; text-align: center; }
  .social-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; }
  .social-actions button { display: inline-grid; width: 38px; height: 38px; place-items: center; border: 1px solid rgb(255 255 255 / 28%); border-radius: 50%; background: rgb(255 255 255 / 10%); color: inherit; cursor: pointer; font: inherit; font-size: 12px; font-weight: 800; transition: background-color var(--elf-transition-fast), transform var(--elf-transition-fast); }
  .social-actions button:hover { background: rgb(255 255 255 / 20%); }
  .social-actions button:active { transform: scale(.92); }
  .social-actions button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
  .brand-copy { max-width: 620px; margin: 0 auto; opacity: .82; line-height: 1.65; }
  .connected-top { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 18px; padding: 22px 26px; }
  .connected-top strong, .connected-top span { display: block; }
  .connected-top span { margin-top: 5px; opacity: .78; font-size: 12px; }
  .connected-bottom { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 20px; background: rgb(12 32 36 / 54%); }
  .status-line { margin: 10px 0 0; color: var(--elf-text-secondary); font-size: 12px; text-align: right; }
  @media (max-width: 620px) {
    .connected-top { grid-template-columns: 1fr; }
    .connected-top .social-actions { justify-content: flex-start; }
    .connected-bottom { align-items: flex-start; flex-direction: column; }
    .brand-footer { padding: 24px 18px; }
  }
`);

const PageFooter = defineHtml(`
  <elf-container class="docs-article">
    <span class="docs-kicker">${t("kicker")}</span>
    <h1>${t("title")}</h1>
    <p class="page-lead">${t("description")}</p>

    <elf-playground :title=${t("company")} :code=${companyCode}>
      <elf-theme-provider :theme=${demoTheme()}>
        <div class="demo-stack"><div class="demo-toolbar"><elf-button size="sm" variant="outlined" @click=${toggleTheme}>${t("toggleTheme")}</elf-button></div><div class="footer-stage"><elf-footer height="auto" border rounded aria-label="ElfUI"><div class="company-footer"><nav class="footer-links"><a v-for="link in links()" :key="link" href="#" @click=${onLink}>{{ link }}</a></nav><span>2026 / <strong>ElfUI</strong></span></div></elf-footer><p class="status-line">${t("status")}: ${lastAction.value || t("none")}</p></div></div>
      </elf-theme-provider>
    </elf-playground>

    <elf-playground :title=${t("socialFooter")} :code=${socialCode}>
      <div class="footer-stage"><elf-footer height="auto" color="#365c88" rounded elevation="2"><div class="brand-footer"><div class="social-actions"><button aria-label="GitHub" @click=${onSocial}>GH</button><button aria-label="X" @click=${onSocial}>X</button><button aria-label="LinkedIn" @click=${onSocial}>IN</button><button aria-label="YouTube" @click=${onSocial}>YT</button></div><p class="brand-copy">${t("body")}</p><span>2026 / <strong>ElfUI</strong></span></div></elf-footer></div>
    </elf-playground>

    <elf-playground :title=${t("connected")} :code=${connectedCode}>
      <div class="footer-stage"><elf-footer height="auto" color="#087f72" rounded padless><div class="connected-top"><div><strong>${t("social")}</strong><span>${t("newsletterDesc")}</span></div><div class="social-actions"><button aria-label="GitHub" @click=${onSocial}>GH</button><button aria-label="X" @click=${onSocial}>X</button><button aria-label="LinkedIn" @click=${onSocial}>IN</button><button aria-label="Instagram" @click=${onSocial}>IG</button></div></div><div class="connected-bottom"><span>2026 / <strong>ElfUI</strong></span><elf-button size="sm" variant="outlined" dark @click=${onSubscribe}>${t("subscribe")}</elf-button></div></elf-footer></div>
    </elf-playground>

    <section class="docs-section"><h2>${t("api")}</h2><elf-props-table title="Props" :rows=${propsRows()} /><elf-props-table :title=${t("slots")} :rows=${slotRows()} /></section>
  </elf-container>
`);

export { PageFooter };
