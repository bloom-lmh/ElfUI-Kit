import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { mdiFacebook, mdiInstagram, mdiLinkedin, mdiTwitter } from "@mdi/js";

import { createSvgIconSet } from "@elfui/kit-src/components/Basic/Icon";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "导航组件", en: "Navigation" },
  title: { zh: "页脚", en: "Footer" },
  description: {
    zh: "组织站点级导航、品牌说明、社交入口与版权信息，支持多行内容和定位布局。",
    en: "Organize site navigation, brand context, social entry points, and copyright information with multi-row and positioned layouts.",
  },
  company: { zh: "公司页脚", en: "Company footer" },
  indigoFooter: { zh: "靛蓝页脚", en: "Indigo footer" },
  tealFooter: { zh: "青绿页脚", en: "Teal footer" },
  home: { zh: "首页", en: "Home" },
  about: { zh: "关于我们", en: "About us" },
  team: { zh: "团队", en: "Team" },
  services: { zh: "服务", en: "Services" },
  journal: { zh: "日志", en: "Journal" },
  contact: { zh: "联系我们", en: "Contact us" },
  social: { zh: "在社交网络上与我们保持联系！", en: "Get connected with us on social networks!" },
  body: {
    zh: "ElfUI 提供跨框架的 Web Components、设计令牌和可组合交互能力。从常用组件到复杂布局，每个界面都能保持统一、清晰且易于维护。组件状态与主题令牌保持同步，让桌面端和移动端都拥有可靠的响应式体验。",
    en: "ElfUI provides cross-framework Web Components, design tokens, and composable interactions. Build consistent, accessible interfaces from everyday controls to complete application layouts, with responsive behavior that stays reliable across desktop and mobile.",
  },
  companyName: { zh: "ElfUI 组件库", en: "ElfUI Kit" },
  products: { zh: "产品", en: "Products" },
  usefulLinks: { zh: "常用链接", en: "Useful links" },
  resources: { zh: "资源", en: "Resources" },
  help: { zh: "帮助", en: "Help" },
  pricing: { zh: "定价", en: "Pricing" },
  settings: { zh: "设置", en: "Settings" },
  orders: { zh: "订单", en: "Orders" },
  docs: { zh: "文档", en: "Documentation" },
  examples: { zh: "案例", en: "Examples" },
  themes: { zh: "主题", en: "Themes" },
  support: { zh: "支持", en: "Support" },
  status: { zh: "最近操作", en: "Last action" },
  none: { zh: "尚未操作", en: "No action yet" },
  api: { zh: "API", en: "API" },
  slots: { zh: "插槽", en: "Slots" },
});
const pick = createDocsPicker();

const lastAction = useRef("");
const footerIconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      facebook: mdiFacebook,
      twitter: mdiTwitter,
      linkedin: mdiLinkedin,
      instagram: mdiInstagram,
    }),
  },
};
const links = () => [t("home"), t("about"), t("team"), t("services"), t("journal"), t("contact")];
const onLink = (event: MouseEvent): void => {
  event.preventDefault();
  lastAction.set((event.currentTarget as HTMLElement).textContent?.trim() || "");
};
const onSocial = (event: MouseEvent): void =>
  lastAction.set((event.currentTarget as HTMLElement).getAttribute("aria-label") || "");

const propsRows = () => [
  {
    name: "height",
    type: "string | number",
    default: "60px",
    desc: pick(
      "兼容布局高度并约束页脚宽度",
      "Layout-compatible height and footer width constraints.",
    ),
  },
  {
    name: "width",
    type: "string | number",
    default: "100%",
    desc: pick(
      "兼容布局高度并约束页脚宽度",
      "Layout-compatible height and footer width constraints.",
    ),
  },
  {
    name: "maxWidth",
    type: "string | number",
    default: "auto",
    desc: pick(
      "兼容布局高度并约束页脚宽度",
      "Layout-compatible height and footer width constraints.",
    ),
  },
  {
    name: "ariaLabel",
    type: "string",
    default: "''",
    desc: pick("页脚地标的无障碍名称", "Accessible name for the footer landmark."),
  },
  {
    name: "color",
    type: "string",
    default: "surface",
    desc: pick("自动对比前景色和阴影层级", "Automatic foreground contrast and elevation."),
  },
  {
    name: "elevation",
    type: "number",
    default: "0",
    desc: pick("自动对比前景色和阴影层级", "Automatic foreground contrast and elevation."),
  },
  {
    name: "border",
    type: "boolean",
    default: "false",
    desc: pick("边框、圆角与无内边距表面", "Bordered, rounded, and padless surfaces."),
  },
  {
    name: "rounded",
    type: "boolean",
    default: "false",
    desc: pick("边框、圆角与无内边距表面", "Bordered, rounded, and padless surfaces."),
  },
  {
    name: "padless",
    type: "boolean",
    default: "false",
    desc: pick("边框、圆角与无内边距表面", "Bordered, rounded, and padless surfaces."),
  },
  {
    name: "fixed",
    type: "boolean",
    default: "false",
    desc: pick("底部定位和内嵌边距", "Bottom positioning and inset spacing."),
  },
  {
    name: "absolute",
    type: "boolean",
    default: "false",
    desc: pick("底部定位和内嵌边距", "Bottom positioning and inset spacing."),
  },
  {
    name: "inset",
    type: "boolean",
    default: "false",
    desc: pick("底部定位和内嵌边距", "Bottom positioning and inset spacing."),
  },
];
const slotRows = () =>
  ["top", "default", "bottom"].map((name) => ({
    name,
    desc: pick(`${name} 内容区域`, `${name} content region.`),
  }));
const companyCode = `<elf-footer height="auto" border rounded>
  <nav>Home About Team Services Journal Contact</nav>
  <span>2026 / ElfUI</span>
</elf-footer>`;
const indigoCode = `<elf-footer height="auto" color="primary" padless>
  <nav>Facebook · X · LinkedIn · Instagram</nav>
  <p>Company summary</p>
  <small>2026 — ElfUI</small>
</elf-footer>`;
const tealCode = `<elf-footer height="auto" color="secondary" padless>
  <section>Get connected with us on social networks!</section>
  <small>2026 — ElfUI</small>
</elf-footer>`;

defineStyle(
  articleStyles,
  `
  .demo-toolbar { display: flex; flex-wrap: wrap; gap: 8px; }
  .demo-stack { display: grid; width: 100%; gap: 12px; }
  .footer-stage { display: grid; place-items: center; width: min(900px, 100%); padding: 8px; background: var(--elf-bg-default); }
  .company-footer { display: grid; width: 100%; gap: 22px; padding: 26px 22px; text-align: center; }
  .footer-links { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px 28px; }
  .footer-links a { position: relative; color: inherit; font-size: 13px; font-weight: 700; text-decoration: none; }
  .footer-links a::after { position: absolute; right: 0; bottom: -5px; left: 0; height: 2px; background: currentColor; content: ""; opacity: 0; transform: scaleX(.4); transition: opacity var(--elf-transition-fast), transform var(--elf-transition-fast); }
  .footer-links a:hover::after, .footer-links a:focus-visible::after { opacity: 1; transform: scaleX(1); }
  .footer-links a:focus-visible { outline: 2px solid currentColor; outline-offset: 5px; }
  .social-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; }
  .social-actions elf-button { --elf-button-size: 38px; --_color: #fff; --_hover: #fff; --_active: #fff; --_overlay: rgb(255 255 255 / 10%); color: inherit; opacity: .86; }
  .social-actions elf-icon { color: #fff; }
  .reference-footer { display: grid; width: 100%; }
  .indigo-footer { min-height: 208px; justify-items: center; align-content: center; padding: 18px; text-align: center; box-sizing: border-box; }
  .indigo-footer .social-actions { gap: 4px; }
  .indigo-divider { width: 50px; height: 2px; margin: 4px 0 16px; background: rgb(255 255 255 / 16%); }
  .indigo-summary { max-width: 840px; margin: 0; opacity: .72; font-size: 12px; line-height: 1.4; }
  .indigo-copyright { margin-top: 16px; font-size: 14px; }
  .teal-footer { padding: 0 16px 8px; box-sizing: border-box; }
  .teal-social-band { display: flex; min-height: 64px; align-items: center; justify-content: space-between; gap: 20px; padding: 8px 16px; box-sizing: border-box; }
  .teal-copyright { display: flex; min-height: 40px; align-items: center; justify-content: center; padding: 8px 20px; border-radius: 8px; background: #424242; color: #fff; font-size: 14px; box-sizing: border-box; }
  .status-line { margin: 0; color: var(--elf-text-secondary); font-size: 12px; text-align: right; }
  @media (max-width: 620px) {
    .teal-social-band { align-items: flex-start; flex-direction: column; padding-block: 16px; }
  }
  @media (max-width: 480px) {
    .footer-stage { padding: 4px; }
    .indigo-footer { padding-inline: 14px; }
    .teal-footer { padding-inline: 8px; }
  }
`,
);

const PageFooter = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="navigation" tag="Footer" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <elf-playground :title=${t("company")} :code=${companyCode}>
      <span slot="status" role="status" aria-live="polite">${t("status")}: ${lastAction.value || t("none")}</span>
      <div class="footer-stage"><elf-footer height="auto" border rounded aria-label="ElfUI"><div class="company-footer"><nav class="footer-links"><a v-for="link in links()" :key="link" href="#" @click=${onLink}>{{ link }}</a></nav><span>2026 / <strong>ElfUI</strong></span></div></elf-footer></div>
    </elf-playground>

    <elf-playground :title=${t("indigoFooter")} :code=${indigoCode}>
      <span slot="status" role="status" aria-live="polite">${t("status")}: ${lastAction.value || t("none")}</span><elf-icon-provider :options.prop=${footerIconOptions}><div class="footer-stage"><elf-footer height="auto" color="#5c6bc0" padless><div class="reference-footer indigo-footer"><div class="social-actions"><elf-button circle variant="text" aria-label="Facebook" @click=${onSocial}><elf-icon name="facebook" size="20"></elf-icon></elf-button><elf-button circle variant="text" aria-label="X" @click=${onSocial}><elf-icon name="twitter" size="20"></elf-icon></elf-button><elf-button circle variant="text" aria-label="LinkedIn" @click=${onSocial}><elf-icon name="linkedin" size="20"></elf-icon></elf-button><elf-button circle variant="text" aria-label="Instagram" @click=${onSocial}><elf-icon name="instagram" size="20"></elf-icon></elf-button></div><span class="indigo-divider" aria-hidden="true"></span><p class="indigo-summary">${t("body")}</p><span class="indigo-copyright">2026 — <strong>ElfUI</strong></span></div></elf-footer></div></elf-icon-provider>
    </elf-playground>

    <elf-playground :title=${t("tealFooter")} :code=${tealCode}>
      <span slot="status" role="status" aria-live="polite">${t("status")}: ${lastAction.value || t("none")}</span><elf-icon-provider :options.prop=${footerIconOptions}><div class="footer-stage"><elf-footer height="auto" color="#009688" rounded padless><div class="reference-footer teal-footer"><div class="teal-social-band"><strong>${t("social")}</strong><div class="social-actions"><elf-button circle variant="text" aria-label="Facebook" @click=${onSocial}><elf-icon name="facebook" size="18"></elf-icon></elf-button><elf-button circle variant="text" aria-label="X" @click=${onSocial}><elf-icon name="twitter" size="18"></elf-icon></elf-button><elf-button circle variant="text" aria-label="LinkedIn" @click=${onSocial}><elf-icon name="linkedin" size="18"></elf-icon></elf-button><elf-button circle variant="text" aria-label="Instagram" @click=${onSocial}><elf-icon name="instagram" size="18"></elf-icon></elf-button></div></div><div class="teal-copyright"><span>2026 — <strong>ElfUI</strong></span></div></div></elf-footer></div></elf-icon-provider>
    </elf-playground>

    <section class="docs-section"><elf-api-builder component="elf-footer" title="API"><elf-props-table role="props" title="Props" :rows=${propsRows()} /><elf-props-table role="slots" :title=${t("slots")} :rows=${slotRows()} />
  </elf-api-builder></section>
  </elf-container>
`);

export { PageFooter };
