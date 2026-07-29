import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "禁用吸附", en: "Disabled sticky behavior" },
  content: { zh: "普通内容块", en: "Regular content block" },
  explanation: { zh: "禁用后保持普通文档流，不参与吸附", en: "When disabled, the content remains in normal document flow" },
  comment: { zh: "disabled 会让组件回到普通文档流。", en: "disabled returns the component to normal document flow." }
});

const code = `<elf-sticky top="16" disabled>
  <div>${t("content")}</div>
</elf-sticky>`;

const script = `// ${t("comment")}`;

const PageStickyEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div
      style="width:100%;max-width:720px;height:180px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper);padding:16px"
    >
      <elf-sticky top="16" disabled>
        <div
          style="padding:12px 16px;border-radius:8px;background:var(--elf-bg-overlay);color:var(--elf-text-secondary)"
        >
          ${t("explanation")}
        </div>
      </elf-sticky>
      <div style="height:260px"></div>
    </div>
  </elf-playground>
`);

export { PageStickyEx3 };
