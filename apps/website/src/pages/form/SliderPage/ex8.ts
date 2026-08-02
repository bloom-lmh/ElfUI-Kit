import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "提示位置", en: "Tooltip placement" },
  comment: {
    zh: "placement 支持 top、bottom、left、right。",
    en: "placement supports top, bottom, left, and right.",
  },
});
const code = `<elf-slider model-value="35" placement="top" />
<elf-slider model-value="35" placement="bottom" />
<elf-slider model-value="35" placement="left" />
<elf-slider model-value="35" placement="right" />`;

const script = `// ${t("comment")}`;

const PageSliderEx8 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(240px,1fr));gap:56px 72px;width:100%;max-width:720px;padding:24px 48px">
      <elf-slider model-value="35" placement="top"></elf-slider>
      <elf-slider model-value="35" placement="bottom"></elf-slider>
      <elf-slider model-value="35" placement="left"></elf-slider>
      <elf-slider model-value="35" placement="right"></elf-slider>
    </div>
  </elf-playground>
`);

export { PageSliderEx8 };
