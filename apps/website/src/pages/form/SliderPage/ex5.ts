import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "禁用状态", en: "Disabled state" },
  comment: {
    zh: "禁用状态由 disabled 属性声明。",
    en: "Declare the disabled state with the disabled prop.",
  },
});
const code = `<elf-slider disabled model-value="70"></elf-slider>`;

const script = `// ${t("comment")}`;

const PageSliderEx5 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="width:100%;max-width:680px">
      <elf-slider disabled model-value="70"></elf-slider>
    </div>
  </elf-playground>
`);

export { PageSliderEx5 };
