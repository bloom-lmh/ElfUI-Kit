import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import pageStyles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "唯一入口与摇树边界", en: "Single entry and tree-shaking boundary" },
  componentEntry: {
    zh: "全部组件、AI、Labs、Provider、服务与公共类型",
    en: "All components, AI, Labs, Providers, services, and public types",
  },
  stable: { zh: "唯一公开入口", en: "Only public entry" },
  appEntry: {
    zh: "全量注册：只有调用时才注册全部 Custom Elements",
    en: "Full registration: register every Custom Element only when called",
  },
  scriptComment: {
    zh: "按需模式仍从同一根入口命名导入；未使用组件由打包器摇树删除。useComponents/registerComponents 来自 @elfui/core，Kit 不重复包装。",
    en: "On-demand mode uses named imports from the same root. Bundlers remove unused components; useComponents/registerComponents stay owned by @elfui/core.",
  },
});

defineStyle(pageStyles);

const templateCode = `// ${t("appEntry")}
import { registerAllComponents } from "@elfui/kit";

registerAllComponents();`;

const scriptCode = `// ${t("scriptComment")}
import { registerComponents } from "@elfui/core";
import { Button, Input } from "@elfui/kit";

registerComponents(Button, Input);`;

const entryRows = [
  {
    entry: "@elfui/kit",
    role: t("componentEntry"),
    status: t("stable"),
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
