import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "尺寸浮层与导航图标", en: "Size overlay and navigation icons" },
  playground: {
    zh: "浮层可越过裁剪容器，导航图标通过 SVG 插槽按需传入",
    en: "The overlay escapes clipped containers while SVG slots customize navigation icons."
  },
  state: { zh: "当前每页", en: "Current page size:" },
  items: { zh: "条", en: "items" }
});
const pageSize = useRef(20);

const onSizeChange = (event: Event): void => {
  pageSize.set(Number((event as CustomEvent<number>).detail));
};

const stateText = (): string => `${t("state")} ${pageSize.value} ${t("items")}`;

const code = `<div style="overflow:hidden;padding:20px">
  <elf-pagination
    total="260"
    layout="sizes, prev, pager, next"
    teleported
    append-size-to="#pagination-overlay-root"
    popper-class="pagination-size-popper"
    :popperStyle.prop=\${{ maxHeight: "160px" }}
  >
    <svg slot="prev-icon" viewBox="0 0 24 24">...</svg>
    <svg slot="next-icon" viewBox="0 0 24 24">...</svg>
  </elf-pagination>
</div>`;

const script = `const pageSize = useRef(20);

const onSizeChange = (event) => {
  pageSize.set(Number(event.detail));
};`;

const PagePaginationEx4 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("playground")} :code=${code} :script=${script}>
    <span slot="status">${stateText()}</span>
    <div
      id="pagination-overlay-root"
      style="width:100%;max-width:520px;overflow:hidden;padding:20px;border:1px solid var(--elf-border);border-radius:12px"
    >
      <elf-pagination
        total="260"
        layout="sizes, prev, pager, next"
        teleported
        append-size-to="#pagination-overlay-root"
        popper-class="pagination-size-popper"
        :pageSize.prop=${pageSize.value}
        :pageSizes.prop=${[10, 20, 50, 100]}
        :popperStyle.prop=${{ maxHeight: "160px" }}
        @size-change=${onSizeChange}
      >
        <svg slot="prev-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
        <svg slot="next-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </elf-pagination>
    </div>
  </elf-playground>
`);

export { PagePaginationEx4 };
