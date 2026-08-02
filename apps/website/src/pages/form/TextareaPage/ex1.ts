import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  basic: { zh: "四行文本框", en: "Four-row textarea" },
  count: { zh: "字数统计与最大长度", en: "Character count and maximum length" },
  description: { zh: "描述", en: "Description" },
  placeholder: { zh: "请输入多行内容...", en: "Enter multiline content..." },
  limit: { zh: "不超过 100 字", en: "Up to 100 characters" },
});
const code1 = `<div style="width:100%;max-width:480px">
  <elf-textarea rows="4" label="${t("description")}" placeholder="${t("placeholder")}" />
</div>`;

const code2 = `<div style="width:100%;max-width:480px">
  <elf-textarea rows="3" maxlength="100" show-count placeholder="${t("limit")}" />
</div>`;

const PageTextareaEx1 = defineHtml(`
  <h2>${t("basic")}</h2>
  <elf-playground :title=${t("basic")} :code=${code1}>
    <div style="width:100%;max-width:480px">
      <elf-textarea rows="4" :label=${t("description")} :placeholder=${t("placeholder")} />
    </div>
  </elf-playground>
  <h2>${t("count")}</h2>
  <elf-playground :title=${t("count")} :code=${code2}>
    <div style="width:100%;max-width:480px">
      <elf-textarea rows="3" maxlength="100" show-count :placeholder=${t("limit")} />
    </div>
  </elf-playground>
`);

export { PageTextareaEx1 };
