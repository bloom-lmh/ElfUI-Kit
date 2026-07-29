import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "不可调整的面板", en: "Non-resizable panel" },
  navigation: { zh: "固定宽度导航", en: "Fixed-width navigation" },
  content: { zh: "内容区域", en: "Content area" },
  status: { zh: "指针与键盘调整均已禁用", en: "Pointer and keyboard resizing are disabled" },
  comment1: { zh: "resizable=false 会同时禁用指针和键盘调整。", en: "resizable=false disables both pointer and keyboard resizing." },
  comment2: { zh: "分隔条会暴露 aria-disabled=\"true\"。", en: "The separator exposes aria-disabled=\"true\"." }
});

const code = `<elf-splitter>
  <elf-splitter-panel slot="first" :size=\${40} :resizable.prop=\${false}>
    ${t("navigation")}
  </elf-splitter-panel>
  <elf-splitter-panel slot="second">${t("content")}</elf-splitter-panel>
</elf-splitter>`;

const script = `// ${t("comment1")}
// ${t("comment2")}`;

const PageSplitterEx5 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">${t("status")}</span>
    <elf-splitter>
      <elf-splitter-panel slot="first" :size=${40} :resizable.prop=${false}>
        <strong>${t("navigation")}</strong>
      </elf-splitter-panel>
      <elf-splitter-panel slot="second">${t("content")}</elf-splitter-panel>
    </elf-splitter>
  </elf-playground>
`);

export { PageSplitterEx5 };
