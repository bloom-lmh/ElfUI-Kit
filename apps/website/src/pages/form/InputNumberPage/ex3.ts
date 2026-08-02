import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  heading: { zh: "状态", en: "States" },
  title: { zh: "禁用、只读与无控制器", en: "Disabled, readonly, and hidden controls" },
  disabled: { zh: "禁用", en: "Disabled" },
  readonly: { zh: "只读", en: "Readonly" },
  hidden: { zh: "无控制器", en: "No controls" },
});
const code = `<elf-input-number disabled label="Disabled" :modelValue.prop=${3} />
<elf-input-number readonly label="Readonly" :modelValue.prop=${6} />
<elf-input-number control-variant="hidden" label="No controls" :modelValue.prop=${8} />`;
defineStyle(
  `.state-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; width:min(860px,100%); } @media(max-width:720px){.state-grid{grid-template-columns:1fr;}}`,
);

const PageInputNumberEx3 = defineHtml(`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("title")} :code=${code}>
    <div class="state-grid">
      <elf-input-number variant="outlined" disabled :label=${t("disabled")} :modelValue.prop=${3}></elf-input-number>
      <elf-input-number variant="outlined" readonly :label=${t("readonly")} :modelValue.prop=${6}></elf-input-number>
      <elf-input-number variant="outlined" control-variant="hidden" :label=${t("hidden")} :modelValue.prop=${8}></elf-input-number>
    </div>
  </elf-playground>
`);

export { PageInputNumberEx3 };
