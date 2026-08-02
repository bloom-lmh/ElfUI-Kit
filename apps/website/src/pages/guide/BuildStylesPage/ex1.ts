import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import pageStyles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "入口与摇树边界", en: "Entries and tree-shaking boundaries" },
  componentEntry: {
    zh: "组件、Provider 与公共类型",
    en: "Components, Providers, and public types",
  },
  utilityEntry: { zh: "可选工具类样式", en: "Optional utility-class styles" },
  stable: { zh: "稳定", en: "Stable" },
  optional: { zh: "按需", en: "Optional" },
  appEntry: {
    zh: "应用入口：注册组件与 Provider",
    en: "Application entry: register components and Providers",
  },
  optionalEntry: {
    zh: "可选入口：只在使用工具类时引入",
    en: "Optional entry: import only when using utility classes",
  },
  scriptComment: {
    zh: "当前发布包公开两个稳定入口：组件入口与工具类样式。不要使用不存在的单组件深层导入；后续新增入口时会同步更新 exports。",
    en: "The package currently exposes two stable entries: the component entry and utility styles. Do not use nonexistent per-component deep imports; future entries will be reflected in exports.",
  },
});
defineStyle(pageStyles);

const templateCode = `// ${t("appEntry")}
import "@elfui/kit";

// ${t("optionalEntry")}
import "@elfui/kit/styles/utilities.css";`;

const scriptCode = `// ${t("scriptComment")}`;

const entryRows = [
  {
    entry: "@elfui/kit",
    role: t("componentEntry"),
    status: t("stable"),
  },
  {
    entry: "@elfui/kit/styles/utilities.css",
    role: t("utilityEntry"),
    status: t("optional"),
  },
];

const PageBuildStylesEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground
    :title=${t("title")}
    :code=${templateCode}
    :script=${scriptCode}
  >
    <div class="entry-grid" role="list">
      <article v-for="entry in entryRows" :key="entry.entry" class="entry-card" role="listitem">
        <code>{{ entry.entry }}</code>
        <span>{{ entry.role }}</span>
        <small>{{ entry.status }}</small>
      </article>
    </div>
  </elf-playground>
`);

export { PageBuildStylesEx1 };
