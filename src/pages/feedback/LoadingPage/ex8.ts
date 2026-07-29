import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "自定义 SVG", en: "Custom SVG" },
  loadingText: { zh: "正在使用品牌 SVG 路径", en: "Using a branded SVG path" },
  content: { zh: "自定义 SVG 加载图标", en: "Custom SVG loading indicator" },
});

const svgPath = "M25 5 A20 20 0 0 1 45 25";

const code = `<elf-loading
  :loading=\${true}
  text="${t("loadingText")}"
  svg="M25 5 A20 20 0 0 1 45 25"
  svg-view-box="0 0 50 50"
>
  <div style="min-height:160px">${t("content")}</div>
</elf-loading>`;

const script = `const svgPath = "M25 5 A20 20 0 0 1 45 25";`;

const PageLoadingEx8 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-loading
      :loading=${true}
      :text=${t("loadingText")}
      :svg=${svgPath}
      svg-view-box="0 0 50 50"
    >
      <div
        style="min-height:160px;padding:24px;border:1px solid var(--elf-border-color);border-radius:12px"
      >
        ${t("content")}
      </div>
    </elf-loading>
  </elf-playground>
`);

export { PageLoadingEx8 };
