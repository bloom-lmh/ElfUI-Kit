import { defineHtml } from "@elfui/core";

const code = `<div style="width:100%;max-width:360px">
  <elf-pagination
    total="500"
    :pageSize.prop=\${20}
    :pageSizes.prop=\${[10, 20, 50, 100]}
    layout="total, sizes, prev, pager, next, jumper"
  />
</div>`;

const script = `// Pagination 自身使用 flex-wrap，窄容器中各布局段会自然换行。`;

const PagePaginationEx3 = defineHtml(`
  <h2>窄容器换行</h2>
  <elf-playground title="完整布局在 360px 容器内自然换行" :code=${code} :script=${script}>
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
