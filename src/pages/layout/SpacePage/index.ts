import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "Space 间距", en: "Space" },
  description: { zh: "为一组元素提供统一间距、方向、换行、填充和字符分隔。", en: "Apply consistent spacing, direction, wrapping, filling, and text separators to sibling items." },
  basic: { zh: "水平、垂直与换行", en: "Horizontal, vertical, and wrapping" },
  size: { zh: "间距尺寸", en: "Spacing sizes" },
  spacer: { zh: "字符分隔与填充", en: "Text spacer and fill" },
  item: { zh: "项目", en: "Item" },
  staticScript: { zh: "静态布局案例无需额外状态。", en: "The static layout examples require no additional state." },
  defaultSlot: { zh: "参与间距布局的元素", en: "Elements participating in the spacing layout" }
});

const basicCode = (): string => `<elf-space size="default">
  <span>${t("item")} 1</span><span>${t("item")} 2</span><span>${t("item")} 3</span>
</elf-space>
<elf-space direction="vertical" size="small">
  <span>${t("item")} 1</span><span>${t("item")} 2</span>
</elf-space>`;

const sizeCode = `<elf-space size="small">...</elf-space>
<elf-space size="default">...</elf-space>
<elf-space size="large">...</elf-space>`;

const spacerCode = `<elf-space spacer="|" size="default">...</elf-space>
<elf-space fill fill-ratio="30" wrap size="default">...</elf-space>`;

const script = (): string => `// ${t("staticScript")}`;

const box = (value: number): string => `${t("item")} ${value}`;

defineStyle(`
  :host { display:block; }
  * { box-sizing:border-box; }
  .space-stage { width:100%; padding:16px; border:1px dashed var(--elf-border-strong); border-radius:4px; }
  .space-stage + .space-stage { margin-top:12px; }
  .space-box { display:grid; min-width:72px; min-height:44px; place-items:center; padding:10px 14px; border:1px dashed var(--elf-primary); border-radius:4px; color:var(--elf-text-primary); background:transparent; }
  .space-stage.vertical { max-width:260px; }
  @media (max-width:600px) { .space-box { min-width:60px; padding:8px 10px; } }
`);

const propsRows = () => [
  { name: "direction", type: "horizontal | vertical", default: "horizontal", desc: t("description") },
  { name: "alignment", type: "CSS align-items", default: "center" },
  { name: "size", type: "small | default | large | number | [number, number]", default: "small" },
  { name: "spacer", type: "string | number", default: "''" },
  { name: "wrap", type: "boolean", default: "false" },
  { name: "fill", type: "boolean", default: "false" },
  { name: "fill-ratio", type: "number", default: "100" }
];

const PageSpace = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>

    <h2>${t("basic")}</h2>
    <elf-playground :title=${t("basic")} :code=${basicCode()} :script=${script()}>
      <div class="space-stage"><elf-space size="default"><span class="space-box">${box(1)}</span><span class="space-box">${box(2)}</span><span class="space-box">${box(3)}</span></elf-space></div>
      <div class="space-stage vertical"><elf-space direction="vertical" size="small"><span class="space-box">${box(1)}</span><span class="space-box">${box(2)}</span></elf-space></div>
    </elf-playground>

    <h2>${t("size")}</h2>
    <elf-playground :title=${t("size")} :code=${sizeCode} :script=${script()}>
      <div class="space-stage"><elf-space size="small"><span class="space-box">small</span><span class="space-box">8px</span></elf-space></div>
      <div class="space-stage"><elf-space size="default"><span class="space-box">default</span><span class="space-box">12px</span></elf-space></div>
      <div class="space-stage"><elf-space size="large"><span class="space-box">large</span><span class="space-box">16px</span></elf-space></div>
    </elf-playground>

    <h2>${t("spacer")}</h2>
    <elf-playground :title=${t("spacer")} :code=${spacerCode} :script=${script()}>
      <div class="space-stage"><elf-space spacer="|" size="default"><span class="space-box">A</span><span class="space-box">B</span><span class="space-box">C</span></elf-space></div>
      <div class="space-stage"><elf-space fill fill-ratio="30" wrap size="default"><span class="space-box">30%</span><span class="space-box">30%</span><span class="space-box">30%</span></elf-space></div>
    </elf-playground>

    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows()} />
    <elf-props-table title="Slots" :rows=${[{ name: "default", type: "-", default: "-", desc: t("defaultSlot") }]} />
  </elf-container>
`);

export { PageSpace };
