import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "组合式标签面板", en: "Compositional tab panels" },
  title: { zh: "TabPane、动态新建与关闭回退", en: "TabPane, dynamic add, and close fallback" },
  current: { zh: "当前标签", en: "Current tab" },
  added: { zh: "已新增并激活", en: "Added and activated" },
  closed: { zh: "已关闭", en: "Closed" },
  add: { zh: "＋ 新建", en: "+ New" },
  overview: { zh: "概览", en: "Overview" },
  overviewContent: { zh: "集中查看项目状态、成员和最近活动。", en: "Review project status, members, and recent activity." },
  tasks: { zh: "任务", en: "Tasks" },
  tasksContent: { zh: "该面板延迟创建，仅在首次激活后渲染。", en: "This lazy panel renders after its first activation." },
  audit: { zh: "审计", en: "Audit" },
  auditContent: { zh: "审计标签已禁用，不参与关闭后的激活回退。", en: "The disabled audit tab is skipped during close fallback." },
  newTab: { zh: "新标签", en: "New tab" },
  newContent: { zh: "动态面板", en: "Dynamic panel" }
});

interface DemoPane {
  name: string;
  label: string;
  content: string;
  disabled?: boolean;
  lazy?: boolean;
  closable?: boolean;
}

const active = useRef<string | number>("overview");
const status = useRef("");
const serial = useRef(1);
const panes = useRef<DemoPane[]>([
  { name: "overview", label: "overview", content: "overviewContent", closable: true },
  { name: "tasks", label: "tasks", content: "tasksContent", lazy: true, closable: true },
  { name: "audit", label: "audit", content: "auditContent", disabled: true },
]);

const paneLabel = (pane: DemoPane): string => pane.name.startsWith("new-")
  ? pane.label
  : t(pane.label as "overview" | "tasks" | "audit");
const paneContent = (pane: DemoPane): string => pane.name.startsWith("new-")
  ? pane.content
  : t(pane.content as "overviewContent" | "tasksContent" | "auditContent");
const statusText = (): string => status.value || `${t("current")}: ${active.value}`;

const eventValue = (event: CustomEvent): string => {
  const detail = Array.isArray(event.detail) ? event.detail[0] : event.detail;
  return String(detail ?? "");
};

const onUpdate = (event: CustomEvent<string | number>): void => {
  active.set(event.detail);
};

const onChange = (event: CustomEvent): void => {
  status.set(`${t("current")}: ${eventValue(event)}`);
};

const onAdd = (): void => {
  const value = `new-${serial.value}`;
  serial.set(serial.value + 1);
  panes.set([
    ...panes.value,
    { name: value, label: `${t("newTab")} ${serial.value - 1}`, content: `${value} ${t("newContent")}`, closable: true },
  ]);
  active.set(value);
  status.set(`${t("added")}: ${value}`);
};

const onRemove = (event: CustomEvent): void => {
  const removed = eventValue(event);
  const source = panes.value;
  const removedIndex = source.findIndex((pane) => pane.name === removed);
  if (removedIndex < 0) return;

  const next = source.filter((pane) => pane.name !== removed);
  panes.set(next);

  if (String(active.value) === removed) {
    const fallback =
      next.find((pane, index) => !pane.disabled && index >= removedIndex) ??
      [...next].reverse().find((pane) => !pane.disabled);
    active.set(fallback?.name ?? "");
  }
  status.set(`${t("closed")}: ${removed}`);
};

const code = `<elf-tabs
  type="border-card"
  editable
  :modelValue.prop=\${active.value}
  @update:modelValue=\${onUpdate}
  @tab-change=\${onChange}
  @tab-add=\${onAdd}
  @tab-remove=\${onRemove}
>
  <span slot="add-icon">＋ 新建</span>
  <elf-tab-pane
    v-for="pane in panes.value"
    :key="pane.name"
    :label="pane.label"
    :name="pane.name"
    :disabled="pane.disabled"
    :lazy="pane.lazy"
    :closable="pane.closable"
  >
    {{ pane.content }}
  </elf-tab-pane>
</elf-tabs>`;

const script = `const active = useRef("overview");
const panes = useRef([
  { name: "overview", label: "概览", content: "项目概览", closable: true },
  { name: "tasks", label: "任务", content: "待处理任务", lazy: true, closable: true },
  { name: "audit", label: "审计", content: "审计内容", disabled: true }
]);

const onAdd = () => {
  const name = createUniqueName();
  panes.set([...panes.value, { name, label: "新标签", content: "动态内容", closable: true }]);
  active.set(name);
};

const onRemove = (event) => {
  const removed = event.detail[0];
  panes.set(panes.value.filter((pane) => pane.name !== removed));
  // 当前项被关闭时，优先激活右侧可用项，否则回退到左侧。
};

const t = createDocsTranslator({
    section: { zh: "组合式标签面板", en: "Compositional tab panels" },
    title: { zh: "TabPane、动态新建与关闭回退", en: "TabPane, dynamic add, and close fallback" },
    current: { zh: "当前标签", en: "Current tab" },
    added: { zh: "已新增并激活", en: "Added and activated" },
    closed: { zh: "已关闭", en: "Closed" },
    add: { zh: "＋ 新建", en: "+ New" },
    overview: { zh: "概览", en: "Overview" },
    overviewContent: { zh: "集中查看项目状态、成员和最近活动。", en: "Review project status, members, and recent activity." },
    tasks: { zh: "任务", en: "Tasks" },
    tasksContent: { zh: "该面板延迟创建，仅在首次激活后渲染。", en: "This lazy panel renders after its first activation." },
    audit: { zh: "审计", en: "Audit" },
    auditContent: { zh: "审计标签已禁用，不参与关闭后的激活回退。", en: "The disabled audit tab is skipped during close fallback." },
    newTab: { zh: "新标签", en: "New tab" },
    newContent: { zh: "动态面板", en: "Dynamic panel" }
});
const status = useRef("");
const eventValue = (event) => {
    const detail = Array.isArray(event.detail) ? event.detail[0] : event.detail;
    return String(detail ?? "");
};
const onUpdate = (event) => {
    active.set(event.detail);
};
const onChange = (event) => {
    status.set(\`\${t("current")}: \${eventValue(event)}\`);
};`;

const PageTabsEx7 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-tabs
      :key=${t("section")}
      type="border-card"
      editable
      :modelValue.prop=${active.value}
      @update:modelValue=${onUpdate}
      @tab-change=${onChange}
      @tab-add=${onAdd}
      @tab-remove=${onRemove}
    >
      <span slot="add-icon">${t("add")}</span>
      <elf-tab-pane
        v-for="pane in panes"
        :key="pane.name"
        :label="paneLabel(pane)"
        :name="pane.name"
        :disabled="pane.disabled"
        :lazy="pane.lazy"
        :closable="pane.closable"
      >
        <h3 style="margin:0 0 8px">{{ paneLabel(pane) }}</h3>
        <p style="margin:0">{{ paneContent(pane) }}</p>
      </elf-tab-pane>
    </elf-tabs>
    <span slot="status" class="demo-state">${statusText()}</span>
  </elf-playground>
`);

export { PageTabsEx7 };
