import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "Quote 引用", en: "Quote" },
  description: {
    zh: "用于持续展示文档说明、设计注释和来源引用；它属于内容本身，不表达需要立即处理的运行时状态。",
    en: "Present persistent documentation notes, design context, and citations as part of the content rather than a runtime status that requires immediate attention.",
  },
  appearance: { zh: "语义与外观", en: "Semantics and appearance" },
  appearanceStatus: {
    zh: "六种语义色 · 三种强调层级",
    en: "Six semantic tones · three emphasis levels",
  },
  defaultNote: { zh: "这是一条普通的补充说明。", en: "This is a general supporting note." },
  designNote: { zh: "设计说明", en: "Design note" },
  designBody: {
    zh: "主要操作应保持清晰，次要说明不要抢占用户注意力。",
    en: "Keep the primary action clear without letting supporting guidance compete for attention.",
  },
  source: { zh: "ElfUI 设计规范", en: "ElfUI design guidelines" },
  successTitle: { zh: "推荐做法", en: "Recommended practice" },
  successBody: {
    zh: "将长期有效的上下文放在 Quote 中。",
    en: "Use Quote for context that remains valid with the surrounding content.",
  },
  warningTitle: { zh: "注意", en: "Note" },
  warningBody: {
    zh: "填充样式适合需要更强视觉强调的短说明。",
    en: "Use the filled variant sparingly for short guidance that needs stronger emphasis.",
  },
  compare: { zh: "Quote 与 Alert", en: "Quote and Alert" },
  compareStatus: {
    zh: "内容说明与运行时反馈职责分离",
    en: "Separate editorial context from runtime feedback",
  },
  quoteTitle: { zh: "文档说明", en: "Documentation note" },
  quoteBody: {
    zh: "这段信息会随页面内容长期保留，不需要用户处理。",
    en: "This information remains with the page and does not require user action.",
  },
  alertTitle: { zh: "保存失败", en: "Save failed" },
  alertBody: {
    zh: "这是运行时状态，用户需要检查网络并重试。",
    en: "This is a runtime state that requires the user to check the connection and retry.",
  },
  quoteUse: {
    zh: "静态内容 · 不可关闭 · 可标注来源",
    en: "Persistent content · not dismissible · supports citations",
  },
  alertUse: {
    zh: "状态反馈 · 可关闭 · 可承载操作",
    en: "Status feedback · dismissible · supports actions",
  },
  props: { zh: "引用属性", en: "Quote props" },
  slots: { zh: "引用插槽", en: "Quote slots" },
  typeDesc: { zh: "语义色调", en: "Semantic tone" },
  variantDesc: { zh: "视觉强调层级", en: "Visual emphasis level" },
  titleDesc: { zh: "引用标题", en: "Quote title" },
  citeDesc: { zh: "来源或署名", en: "Citation or attribution" },
  compactDesc: { zh: "使用紧凑间距", en: "Uses compact spacing" },
  defaultSlot: { zh: "引用正文", en: "Quote body" },
  titleSlot: { zh: "自定义标题", en: "Custom title" },
  citeSlot: { zh: "自定义来源", en: "Custom citation" },
  iconSlot: { zh: "可选图标", en: "Optional icon" },
});

const appearanceCode = `<elf-quote>${t("defaultNote")}</elf-quote>
<elf-quote type="primary" title="${t("designNote")}" cite="${t("source")}">
  ${t("designBody")}
</elf-quote>
<elf-quote type="success" variant="outlined" title="${t("successTitle")}">
  ${t("successBody")}
</elf-quote>
<elf-quote type="warning" variant="filled" title="${t("warningTitle")}" compact>
  ${t("warningBody")}
</elf-quote>`;

const compareCode = `<elf-quote type="info" title="${t("quoteTitle")}">${t("quoteBody")}</elf-quote>
<elf-alert type="danger" closable title="${t("alertTitle")}" description="${t("alertBody")}"></elf-alert>`;

const propsRows = () => [
  {
    name: "type",
    type: "default | primary | success | warning | danger | info",
    default: "default",
    desc: t("typeDesc"),
  },
  {
    name: "variant",
    type: "soft | outlined | filled",
    default: "soft",
    desc: t("variantDesc"),
  },
  { name: "title", type: "string", default: "''", desc: t("titleDesc") },
  { name: "cite", type: "string", default: "''", desc: t("citeDesc") },
  { name: "compact", type: "boolean", default: "false", desc: t("compactDesc") },
];

const slotsRows = () => [
  { name: "default", desc: t("defaultSlot") },
  { name: "title", desc: t("titleSlot") },
  { name: "cite", desc: t("citeSlot") },
  { name: "icon", desc: t("iconSlot") },
];

defineStyle(`
  .quote-demo-stack {
    display: grid;
    width: max(85%, min(100%, 900px));
    gap: 14px;
  }

  .quote-comparison {
    display: grid;
    width: max(85%, min(100%, 900px));
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .quote-comparison-item {
    display: grid;
    min-width: 0;
    align-content: start;
    gap: 10px;
  }

  .quote-comparison-item > small {
    color: var(--elf-text-secondary);
    font-size: var(--elf-font-size-xs);
    line-height: 1.6;
  }

  @media (max-width: 680px) {
    .quote-comparison {
      grid-template-columns: 1fr;
    }
  }
`);

const PageQuote = defineHtml(`
  <elf-container>
    <elf-docs-hero category="basic" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <h2>${t("appearance")}</h2>
    <elf-playground :title=${t("appearance")} :code=${appearanceCode}>
      <span slot="status">${t("appearanceStatus")}</span>
      <div class="quote-demo-stack">
        <elf-quote>${t("defaultNote")}</elf-quote>
        <elf-quote type="primary" :title=${t("designNote")} :cite=${t("source")}>
          ${t("designBody")}
        </elf-quote>
        <elf-quote type="success" variant="outlined" :title=${t("successTitle")}>
          ${t("successBody")}
        </elf-quote>
        <elf-quote type="warning" variant="filled" :title=${t("warningTitle")} compact>
          ${t("warningBody")}
        </elf-quote>
      </div>
    </elf-playground>

    <h2>${t("compare")}</h2>
    <elf-playground :title=${t("compare")} :code=${compareCode}>
      <span slot="status">${t("compareStatus")}</span>
      <div class="quote-comparison">
        <section class="quote-comparison-item">
          <elf-quote type="info" :title=${t("quoteTitle")}>${t("quoteBody")}</elf-quote>
          <small>${t("quoteUse")}</small>
        </section>
        <section class="quote-comparison-item">
          <elf-alert
            type="danger"
            closable
            :title=${t("alertTitle")}
            :description=${t("alertBody")}
          ></elf-alert>
          <small>${t("alertUse")}</small>
        </section>
      </div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table :title=${t("props")} :rows=${propsRows()} />
    <elf-props-table :title=${t("slots")} :rows=${slotsRows()} />
  </elf-container>
`);

export { PageQuote };
