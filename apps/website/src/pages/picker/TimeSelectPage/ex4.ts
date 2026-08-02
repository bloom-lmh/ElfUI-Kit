import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "字段表面与状态", en: "Field surfaces and states" },
  filled: { zh: "填充", en: "Filled" },
  outlined: { zh: "描边", en: "Outlined" },
  disabled: { zh: "禁用", en: "Disabled" },
  editable: {
    zh: "可输入搜索固定时刻。",
    en: "Type to search fixed time options.",
  },
  readOnly: {
    zh: "关闭 editable 后仅使用选择交互。",
    en: "Disable editable for selection-only interaction.",
  },
  inherited: {
    zh: "禁用态仍共享字段尺寸与主题。",
    en: "Disabled state keeps the shared field sizing and theme.",
  },
});
const pick = createDocsPicker();

const code = () =>
  pick(
    `<elf-time-select variant="filled" label="填充" />
<elf-time-select variant="outlined" label="描边" :editable="false" />
<elf-time-select model-value="10:00" label="禁用" disabled />`,
    `<elf-time-select variant="filled" label="Filled" />
<elf-time-select variant="outlined" label="Outlined" :editable="false" />
<elf-time-select model-value="10:00" label="Disabled" disabled />`,
  );

defineStyle(demoStyles);

const PageTimeSelectEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()}>
    <div class="demo-grid">
      <section class="demo-card">
        <strong>${t("filled")}</strong>
        <elf-time-select variant="filled" :label=${t("filled")}></elf-time-select>
        <small>${t("editable")}</small>
      </section>
      <section class="demo-card">
        <strong>${t("outlined")}</strong>
        <elf-time-select variant="outlined" :label=${t("outlined")} :editable=${false}></elf-time-select>
        <small>${t("readOnly")}</small>
      </section>
      <section class="demo-card">
        <strong>${t("disabled")}</strong>
        <elf-time-select model-value="10:00" :label=${t("disabled")} disabled></elf-time-select>
        <small>${t("inherited")}</small>
      </section>
    </div>
  </elf-playground>
`);

export { PageTimeSelectEx4 };
