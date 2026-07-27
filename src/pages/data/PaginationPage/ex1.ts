import { defineHtml, useRef } from "@elfui/core";


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

const stateText = (): string => `当前第 ${page.value} 页，每页 ${size.value} 条`;

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
  <h2>基础用法</h2>
  <elf-playground title="页码、每页条数和跳转输入会同步状态" :code=${code} :script=${script}>
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
