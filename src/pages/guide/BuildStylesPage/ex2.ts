import { defineHtml, defineStyle } from "@elfui/core";

import pageStyles from "./style.scss?inline";

defineStyle(pageStyles);

const templateCode = `/* 应用全局样式：明确层级，不穿透组件 Shadow DOM */
@layer reset, elfui-utilities, app;

@import "@elfui/kit/styles/utilities.css" layer(elfui-utilities);

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}`;

const scriptCode = `// 主题颜色、圆角和阴影请在 Theme & customization 中配置 token。
// 这里仅处理应用级 reset、CSS layer 顺序和可选工具类入口。`;

const layerRows = [
  { order: "01", label: "reset", description: "应用级归一化，不覆盖组件内部语义" },
  { order: "02", label: "elfui-utilities", description: "显式引入时才进入全局层" },
  { order: "03", label: "app", description: "业务样式拥有最后的全局覆盖权" }
];

const PageBuildStylesEx2 = defineHtml(`
  <elf-playground
    title="Reset 与 CSS Layers"
    :code=${templateCode}
    :script=${scriptCode}
  >
    <ol class="layer-stack">
      <li v-for="layer in layerRows" :key="layer.label">
        <span>{{ layer.order }}</span>
        <strong>{{ layer.label }}</strong>
        <small>{{ layer.description }}</small>
      </li>
    </ol>
  </elf-playground>
`);

export { PageBuildStylesEx2 };
