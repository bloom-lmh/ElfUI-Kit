import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

interface MappedPanel {
  id: string;
  label: string;
  detail: string;
  locked?: boolean;
}

const t = createDocsTranslator({
  title: { zh: "受控手风琴与禁用状态", en: "Controlled accordion and disabled state" },
  current: { zh: "当前展开", en: "Open panel" },
  none: { zh: "无", en: "None" },
  openDeploy: { zh: "展开部署", en: "Open deployment" },
  closeAll: { zh: "全部收起", en: "Close all" },
  overview: { zh: "项目概览", en: "Project overview" },
  overviewBody: {
    zh: "聚合项目目标、负责人和本周进度。",
    en: "Summarizes goals, ownership, and this week's progress."
  },
  deployment: { zh: "部署策略", en: "Deployment strategy" },
  deploymentBody: {
    zh: "先灰度验证，再逐步扩大流量。",
    en: "Validate with a canary release before increasing traffic."
  },
  archive: { zh: "历史归档（只读）", en: "History archive (read only)" },
  archiveBody: {
    zh: "锁定的归档内容不能被用户展开。",
    en: "Locked archive content cannot be opened by the user."
  },
  hint: {
    zh: "model-value 始终由父级持有；accordion 输出单个名称，禁用项保留原生按钮语义。",
    en: "The parent owns model-value; accordion emits one name and disabled items keep native button semantics."
  }
});

const fieldMap = {
  name: "id",
  title: "label",
  content: "detail",
  disabled: "locked"
};

// State
const activePanel = useRef("overview");

// Derived state
const panels = (): MappedPanel[] => [
  {
    id: "overview",
    label: t("overview"),
    detail: t("overviewBody")
  },
  {
    id: "deployment",
    label: t("deployment"),
    detail: t("deploymentBody")
  },
  {
    id: "archive",
    label: t("archive"),
    detail: t("archiveBody"),
    locked: true
  }
];

const activeStatus = (): string =>
  `${t("current")} · ${activePanel.value || t("none")}`;

// Methods
const onActiveUpdate = (event: CustomEvent<string>): void => {
  activePanel.set(String(event.detail ?? ""));
};

const onStatusAction = (event: Event): void => {
  const action = event
    .composedPath()
    .find((entry): entry is HTMLElement =>
      entry instanceof HTMLElement && Boolean(entry.dataset.action)
    )
    ?.dataset.action;
  if (action === "deployment") activePanel.set("deployment");
  if (action === "close") activePanel.set("");
};

const controlledCode = `<elf-collapse
  accordion
  :items.prop=\${panels}
  :props.prop=\${fieldMap}
  :modelValue.prop=\${activePanel}
  @update:modelValue=\${onActiveUpdate}
/>`;

const controlledScript = `const activePanel = useRef("overview");
const fieldMap = {
  name: "id",
  title: "label",
  content: "detail",
  disabled: "locked"
};
const panels = [
  { id: "overview", label: "Project overview", detail: "..." },
  { id: "deployment", label: "Deployment strategy", detail: "..." },
  { id: "archive", label: "History archive", detail: "...", locked: true }
];

const onActiveUpdate = (event) => {
  activePanel.set(String(event.detail ?? ""));
};`;

defineStyle(styles);

const PageCollapseEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${controlledCode} :script=${controlledScript}>
    <div
      slot="status"
      class="collapse-demo-actions"
      role="status"
      aria-live="polite"
      @click=${onStatusAction}
    >
      <span>${activeStatus()}</span>
      <button type="button" data-action="deployment">${t("openDeploy")}</button>
      <button type="button" data-action="close">${t("closeAll")}</button>
    </div>
    <div class="collapse-demo-shell">
      <elf-collapse
        accordion
        :items.prop=${panels()}
        :props.prop=${fieldMap}
        :modelValue.prop=${activePanel}
        @update:modelValue=${onActiveUpdate}
      ></elf-collapse>
      <p class="collapse-demo-hint">${t("hint")}</p>
    </div>
  </elf-playground>
`);

export { PageCollapseEx1 };
