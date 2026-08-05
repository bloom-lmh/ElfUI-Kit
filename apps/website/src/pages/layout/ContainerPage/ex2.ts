import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  paddingTitle: { zh: "内边距档位", en: "Padding presets" },
  compositionTitle: { zh: "全宽外壳与居中正文", en: "Full-width shell with centered content" },
  background: { zh: "全宽背景区域", en: "Full-width background area" },
  content: { zh: "居中的正文内容", en: "Centered article content" },
  layoutLabel: { zh: "工作台布局", en: "Workspace layout" },
  heading: {
    zh: "全宽背景",
    en: "Full-width background",
  },
  description: {
    zh: "外层虚线框表示全宽容器，内层虚线框表示限宽并居中的正文。",
    en: "The outer dashed frame is fluid; the inner dashed frame constrains and centers the article.",
  },
  paddingComment: {
    zh: "padding 使用 0、sm、md、lg 四个预设档位。",
    en: "padding accepts the 0, sm, md, and lg presets.",
  },
  fluidComment: {
    zh: "fluid 取消最大宽度限制，可在内部嵌套限宽容器。",
    en: "fluid removes the maximum-width limit; nest a constrained container for readable content.",
  },
});

const code1 = `<elf-container padding="0" max-width="md">padding=0</elf-container>
<elf-container padding="sm" max-width="md">padding=sm</elf-container>
<elf-container padding="md" max-width="md">padding=md</elf-container>
<elf-container padding="lg" max-width="md">padding=lg</elf-container>`;

const code2 = `<elf-container fluid padding="lg">
  <header>${t("background")}</header>
  <elf-container max-width="md" padding="md">${t("content")}</elf-container>
</elf-container>`;

const paddingScript = `// ${t("paddingComment")}`;
const fluidScript = `// ${t("fluidComment")}`;

const PageContainerEx2 = defineHtml(`
  <h2>${t("paddingTitle")}</h2>
  <elf-playground :title=${t("paddingTitle")} :code=${code1} :script=${paddingScript}>
    <elf-container
      padding="0"
      max-width="md"
      style="background:transparent;margin:4px 0;border:1px dashed var(--elf-border-strong);border-radius:4px"
      >padding=0</elf-container
    >
    <elf-container
      padding="sm"
      max-width="md"
      style="background:transparent;margin:4px 0;border:1px dashed var(--elf-border-strong);border-radius:4px"
      >padding=sm</elf-container
    >
    <elf-container
      padding="md"
      max-width="md"
      style="background:transparent;margin:4px 0;border:1px dashed var(--elf-border-strong);border-radius:4px"
      >padding=md</elf-container
    >
    <elf-container
      padding="lg"
      max-width="md"
      style="background:transparent;margin:4px 0;border:1px dashed var(--elf-border-strong);border-radius:4px"
      >padding=lg</elf-container
    >
  </elf-playground>

  <h2>${t("compositionTitle")}</h2>
  <elf-playground :title=${t("compositionTitle")} :code=${code2} :script=${fluidScript}>
    <elf-container fluid padding="lg" style="border:1px dashed var(--elf-border-strong);border-radius:4px;background:transparent">
      <elf-container max-width="md" padding="md" style="border:1px dashed var(--elf-primary);border-radius:4px">
        <small style="color:var(--elf-primary);font-weight:700">${t("layoutLabel")}</small>
        <h3 style="margin:8px 0">${t("heading")}</h3>
        <p style="margin:0;color:var(--elf-text-secondary);line-height:1.7">${t("description")}</p>
      </elf-container>
    </elf-container>
  </elf-playground>
`);

export { PageContainerEx2 };
