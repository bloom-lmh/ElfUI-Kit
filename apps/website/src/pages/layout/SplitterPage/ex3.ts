import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";
defineStyle(styles);

const t = createDocsTranslator({
  title: { zh: "Splitter 禁用状态", en: "Splitter disabled state" },
  disabledPanel: { zh: "禁用拖动", en: "Dragging disabled" },
  fixedPanel: { zh: "固定区域", en: "Fixed region" },
  note: { zh: "分隔条不可调整", en: "The separator cannot be resized" },
  comment: {
    zh: "disabled 会同时禁用拖动和键盘调整。",
    en: "disabled prevents both pointer and keyboard resizing.",
  },
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
    <div class="splitter-demo-stage"><elf-splitter disabled :modelValue.prop=${40}>
      <div slot="first">${t("disabledPanel")}</div>
      <div slot="second">${t("fixedPanel")}</div>
    </elf-splitter></div>
  </elf-playground>
`);

export { PageSplitterEx3 };
