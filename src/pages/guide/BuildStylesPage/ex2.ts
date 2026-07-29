import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import pageStyles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "重置与 CSS 层", en: "Reset and CSS Layers" },
  sourceComment: {
    zh: "应用全局样式：明确层级，不穿透组件 Shadow DOM",
    en: "Application global styles: define explicit layers without piercing component Shadow DOM"
  },
  scriptComment: {
    zh: "主题颜色、圆角和阴影请在主题与定制中配置 token。这里仅处理应用级 reset、CSS layer 顺序和可选工具类入口。",
    en: "Configure theme colors, radii, and elevations through tokens in Theme and customization. This example only covers the application reset, CSS layer order, and the optional utility entry."
  },
  resetDescription: {
    zh: "应用级归一化，不覆盖组件内部语义",
    en: "Application-level normalization that does not override component internals."
  },
  utilityDescription: {
    zh: "显式引入时才进入全局层",
    en: "Included in the global layer only when explicitly imported."
  },
  appDescription: {
    zh: "业务样式拥有最后的全局覆盖权",
    en: "Application styles own the final global override layer."
  }
});

defineStyle(pageStyles);

const templateCode = `/* ${t("sourceComment")} */
@layer reset, elfui-utilities, app;

@import "@elfui/kit/styles/utilities.css" layer(elfui-utilities);

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}`;

const scriptCode = `// ${t("scriptComment")}`;

const layerRows = [
  { order: "01", label: "reset", description: t("resetDescription") },
  { order: "02", label: "elfui-utilities", description: t("utilityDescription") },
  { order: "03", label: "app", description: t("appDescription") }
];

const PageBuildStylesEx2 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground
    :title=${t("title")}
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
