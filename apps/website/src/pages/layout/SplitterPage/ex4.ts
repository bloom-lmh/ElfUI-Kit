import { defineHtml, defineStyle } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";
defineStyle(styles);

const t = createDocsTranslator({
  title: {
    zh: "折叠与持久化",
    en: "Collapse and persistence",
  },
  navigation: { zh: "项目导航", en: "Project navigation" },
  workspace: { zh: "编辑工作区", en: "Editor workspace" },
  status: {
    zh: "双击分隔条或使用折叠按钮",
    en: "Double-click the separator or use the collapse control",
  },
  collapseComment: {
    zh: "双击分隔条或点击折叠按钮可以收起第一个面板。",
    en: "Double-click the separator or use the collapse control to collapse the first panel.",
  },
  storageComment: {
    zh: "storage-key 会在本地存储中保存最近一次尺寸。",
    en: "storage-key persists the latest size in local storage.",
  },
});

const code = `<elf-splitter storage-key="workspace-splitter">
  <elf-splitter-panel
    slot="first"
    :size=\${34}
    :min=\${18}
    :max=\${70}
    collapsible
    lazy
  >
    ${t("navigation")}
  </elf-splitter-panel>
  <elf-splitter-panel slot="second">${t("workspace")}</elf-splitter-panel>
</elf-splitter>`;

const script = `// ${t("collapseComment")}
// ${t("storageComment")}`;

const PageSplitterEx4 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground
    :title=${t("title")}
    :code=${code}
    :script=${script}
  >
    <span slot="status">${t("status")}</span>
    <div class="splitter-demo-stage">
      <elf-splitter storage-key="elfui-demo-workspace-splitter">
        <elf-splitter-panel
          slot="first"
          :size=${34}
          :min=${18}
          :max=${70}
          collapsible
          lazy
        >
          <div style="display:grid;gap:10px">
            <strong>${t("navigation")}</strong>
            <span>src/components</span>
            <span>src/pages</span>
            <span>tests</span>
          </div>
        </elf-splitter-panel>
        <elf-splitter-panel slot="second">
          <div style="display:grid;place-items:center;height:100%;color:var(--elf-text-secondary)">
            ${t("workspace")}
          </div>
        </elf-splitter-panel>
      </elf-splitter>
    </div>
  </elf-playground>
`);

export { PageSplitterEx4 };
