import { defineHtml, defineStyle } from "@elfui/core";

import pageStyles from "./style.scss?inline";

defineStyle(pageStyles);

const templateCode = `// 应用入口：注册组件与 Provider
import "@elfui/kit";

// 可选入口：只在使用工具类时引入
import "@elfui/kit/styles/utilities.css";`;

const scriptCode = `// 当前发布包公开两个稳定入口：组件入口与工具类样式。
// 不要写不存在的单组件深层导入；后续如增加入口会同步更新 exports。`;

const entryRows = [
  { entry: "@elfui/kit", role: "组件、Provider 与公共类型", status: "稳定" },
  { entry: "@elfui/kit/styles/utilities.css", role: "可选 Utilities 工具类", status: "按需" }
];

const PageBuildStylesEx1 = defineHtml(`
  <elf-playground
    title="入口与摇树边界"
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
