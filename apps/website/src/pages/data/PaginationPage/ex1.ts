import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "基础用法", en: "Basic usage" },
  playground: {
    zh: "页码、每页条数和跳转输入会同步状态",
    en: "Page numbers, page size, and the jump input stay synchronized.",
  },
  state: { zh: "当前第", en: "Page" },
  pageSize: { zh: "页，每页", en: "with" },
  items: { zh: "条", en: "items per page" },
});

const page = useRef(1);

const size = useRef(10);

const readFirst = <T>(event: Event, fallback: T): T => {
  const detail = (event as CustomEvent).detail;
  return (Array.isArray(detail) ? detail[0] : detail) ?? fallback;
};

const onPageChange = (event: Event): void => {
  page.set(Number(readFirst(event, page.value)));
};

const onSizeChange = (event: Event): void => {
  size.set(Number(readFirst(event, size.value)));
};

const stateText = (): string =>
  `${t("state")} ${page.value} ${t("pageSize")} ${size.value} ${t("items")}`;

const code = `<elf-pagination
  total="86"
  :currentPage.prop=\${page}
  :pageSize.prop=\${size}
  :pageSizes.prop=\${[5, 10, 20, 50]}
  @current-change=\${onPageChange}
  @size-change=\${onSizeChange}
/>`;

const script = `const page = useRef(1);
const size = useRef(10);

const onPageChange = (event) => page.set(Number(event.detail));
const onSizeChange = (event) => size.set(Number(event.detail));`;

const PagePaginationEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <span slot="status">${stateText()}</span>
    <div style="width: 100%; display: grid; gap: 12px">
      <elf-pagination
        total="86"
        :currentPage.prop=${page.value}
        :pageSize.prop=${size.value}
        :pageSizes.prop=${[5, 10, 20, 50]}
        @current-change=${onPageChange}
        @size-change=${onSizeChange}
      ></elf-pagination>
    </div>
  </elf-playground>
`);

export { PagePaginationEx1 };
