import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "自定义图标", en: "Custom icon" },
  detail: {
    zh: "icon 插槽可替换默认状态图形",
    en: "The icon slot replaces the default status graphic.",
  },
  favorite: { zh: "收藏成功", en: "Saved to favorites" },
  favoriteDetail: {
    zh: "文章已加入「稍后阅读」，可在个人中心查看。",
    en: "The article is in “Read later”; find it in your profile.",
  },
});

const slotCode = `<elf-result title="${t("favorite")}" sub-title="${t("favoriteDetail")}">
  <span slot="icon">★</span>
</elf-result>`;

const PageResultEx3 = defineHtml(`
<elf-playground :title=${t("title")} :code=${slotCode}>
      <elf-result :title=${t("favorite")} :sub-title=${t("favoriteDetail")}>
        <span slot="icon">★</span>
      </elf-result>
    </elf-playground>
`);

export { PageResultEx3 };
