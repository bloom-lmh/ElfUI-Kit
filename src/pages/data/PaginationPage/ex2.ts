import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "布局、默认值与尺寸", en: "Layout, defaults, and sizes" },
  playground: {
    zh: "已知页数、非受控默认值与紧凑布局",
    en: "Known page counts, uncontrolled defaults, and compact layouts."
  },
  previous: { zh: "上一页", en: "Previous" },
  next: { zh: "下一页", en: "Next" }
});
const compactPage = useRef(3);
const simplePage = useRef(1);

const readFirst = <T>(event: Event, fallback: T): T => {
  const detail = (event as CustomEvent).detail;
  return (Array.isArray(detail) ? detail[0] : detail) ?? fallback;
};

const onCompactChange = (event: Event): void => compactPage.set(Number(readFirst(event, compactPage.value)));
const onSimpleChange = (event: Event): void => simplePage.set(Number(readFirst(event, simplePage.value)));

const code = `<elf-pagination
  size="large"
  page-count="4"
  default-current-page="2"
  prev-text="${t("previous")}"
  next-text="${t("next")}"
  layout="prev, pager, next"
/>

<elf-pagination background small layout="prev, pager, next" total="120" />`;

const script = `const compactPage = useRef(3);

const onCompactChange = (event) => {
  compactPage.set(Number(event.detail));
};`;

const PagePaginationEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <div style="width: 100%; display: grid; gap: 18px">
      <elf-pagination
        size="large"
        page-count="4"
        default-current-page="2"
        prev-text=${t("previous")}
        next-text=${t("next")}
        layout="prev, pager, next"
      ></elf-pagination>

      <elf-pagination
        background
        small
        layout="prev, pager, next"
        total="120"
        :currentPage.prop=${compactPage.value}
        @current-change=${onCompactChange}
      ></elf-pagination>

      <elf-pagination
        layout="total, prev, pager, next"
        total="12"
        hide-on-single-page
        :currentPage.prop=${simplePage.value}
        @current-change=${onSimpleChange}
      ></elf-pagination>
    </div>
  </elf-playground>
`);

export { PagePaginationEx2 };
