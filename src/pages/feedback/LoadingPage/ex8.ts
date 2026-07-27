import { defineHtml } from "@elfui/core";

const svgPath = "M25 5 A20 20 0 0 1 45 25";

const code = `<elf-loading
  :loading=\${true}
  text="使用品牌 SVG 路径"
  svg="M25 5 A20 20 0 0 1 45 25"
  svg-view-box="0 0 50 50"
>
  <div style="min-height:160px">自定义 SVG 加载图标</div>
</elf-loading>`;

const script = `const svgPath = "M25 5 A20 20 0 0 1 45 25";`;

const PageLoadingEx8 = defineHtml(`
  <h2>自定义 SVG</h2>
  <elf-playground title="使用 SVG path 与 viewBox 定制加载标识" :code=${code} :script=${script}>
    <elf-loading
      :loading=${true}
      text="使用品牌 SVG 路径"
      :svg=${svgPath}
      svg-view-box="0 0 50 50"
    >
      <div
        style="min-height:160px;padding:24px;border:1px solid var(--elf-border-color);border-radius:12px"
      >
        自定义 SVG 加载图标
      </div>
    </elf-loading>
  </elf-playground>
`);

export { PageLoadingEx8 };
