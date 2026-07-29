import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "窄容器换行", en: "Wrapping in narrow containers" },
  playground: {
    zh: "完整布局在 360px 容器内自然换行",
    en: "The complete layout wraps naturally inside a 360px container."
  },
  comment: {
    zh: "Pagination 自身使用 flex-wrap，窄容器中各布局段会自然换行。",
    en: "Pagination uses flex-wrap so layout sections wrap naturally in narrow containers."
  }
});
const code = `<div style="width:100%;max-width:360px">
  <elf-pagination
    total="500"
    :pageSize.prop=\${20}
    :pageSizes.prop=\${[10, 20, 50, 100]}
    layout="total, sizes, prev, pager, next, jumper"
  />
</div>`;

const script = `// ${t("comment")}`;

const PagePaginationEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <div style="width:100%;max-width:360px;padding:16px;border:1px solid var(--elf-border-color);border-radius:12px">
      <elf-pagination
        total="500"
        :pageSize.prop=${20}
        :pageSizes.prop=${[10, 20, 50, 100]}
        layout="total, sizes, prev, pager, next, jumper"
      ></elf-pagination>
    </div>
  </elf-playground>
`);

export { PagePaginationEx3 };
