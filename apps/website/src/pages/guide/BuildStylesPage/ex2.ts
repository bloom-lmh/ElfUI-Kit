import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import pageStyles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "组件内样式与主题覆盖", en: "Embedded styles and theme overrides" },
  sourceComment: {
    zh: "CSS Variables 会继承进 Shadow DOM；公开 part 用于精确覆盖",
    en: "CSS variables inherit into Shadow DOM; public parts provide precise overrides",
  },
  scriptComment: {
    zh: "Core theme() 按组件 tag 注入变量和 ::part 规则；它只能在浏览器中调用",
    en: "Core theme() injects variables and ::part rules for one component tag; call it only in the browser",
  },
  tokenDescription: {
    zh: "ConfigProvider、ThemeProvider 或普通 CSS 设置语义 token",
    en: "Set semantic tokens through ConfigProvider, ThemeProvider, or ordinary CSS.",
  },
  themeDescription: {
    zh: "theme() 适合动态安装、替换和销毁组件级品牌覆盖",
    en: "theme() installs, replaces, and disposes component-scoped brand overrides.",
  },
  partDescription: {
    zh: "::part() 只依赖文档公开的稳定内部节点",
    en: "::part() targets only documented stable internal nodes.",
  },
});

defineStyle(pageStyles);

const templateCode = `/* ${t("sourceComment")} */
elf-button.brand {
  --elf-primary: #6750a4;
  --elf-primary-hover: #4f378b;
}

elf-button.brand::part(button) {
  border-radius: 999px;
}`;

const scriptCode = `// ${t("scriptComment")}
import { theme } from "@elfui/core";
import { Button } from "@elfui/kit";

const dispose = theme(Button, \`
  --elf-primary: #6750a4;
  &::part(button) { border-radius: 999px; }
\`, { id: "brand-button" });`;

const layerRows = [
  { order: "01", label: "tokens", description: t("tokenDescription") },
  { order: "02", label: "theme()", description: t("themeDescription") },
  { order: "03", label: "::part()", description: t("partDescription") },
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
