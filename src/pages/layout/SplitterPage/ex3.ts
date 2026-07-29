import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "禁用状态", en: "Disabled state" },
  disabledPanel: { zh: "禁用拖动", en: "Dragging disabled" },
  fixedPanel: { zh: "固定区域", en: "Fixed region" },
  note: { zh: "分隔条不可调整", en: "The separator cannot be resized" },
  comment: { zh: "disabled 会同时禁用拖动和键盘调整。", en: "disabled prevents both pointer and keyboard resizing." }
});

const code = `<elf-splitter disabled :modelValue.prop=\${40}>
  <div slot="first">${t("disabledPanel")}</div>
  <div slot="second">${t("fixedPanel")}</div>
</elf-splitter>`;

const script = `// ${t("comment")}`;

const PageSplitterEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">${t("note")}</span>
    <elf-splitter disabled :modelValue.prop=${40}>
      <div slot="first" style="padding:16px">${t("disabledPanel")}</div>
      <div slot="second" style="padding:16px">${t("fixedPanel")}</div>
    </elf-splitter>
  </elf-playground>
`);

export { PageSplitterEx3 };
