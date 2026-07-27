import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "卡片与可编辑标签", en: "Card and editable tabs" },
  title: { zh: "新增、关闭与垂直卡片布局", en: "Add, close, and vertical card layout" },
  inbox: { zh: "收件箱", en: "Inbox" },
  inboxContent: { zh: "集中查看通知和待办消息。", en: "Review notifications and pending messages." },
  reports: { zh: "报表", en: "Reports" },
  reportsContent: { zh: "查看业务报表和趋势数据。", en: "Review business reports and trends." },
  settings: { zh: "设置", en: "Settings" },
  settingsContent: { zh: "管理系统和成员配置。", en: "Manage system and member settings." },
  newTab: { zh: "新标签", en: "New tab" },
  newContent: { zh: "这是刚刚添加的可编辑标签。", en: "This editable tab was just added." }
});

type DemoTab = { label: string; value: string; icon: string; content: string };

const active = useRef("reports");
const tabItems = useRef<DemoTab[]>([
  { label: "inbox", value: "inbox", icon: "I", content: "inboxContent" },
  { label: "reports", value: "reports", icon: "R", content: "reportsContent" },
  { label: "settings", value: "settings", icon: "S", content: "settingsContent" }
]);

const localizedItems = (): DemoTab[] => tabItems.value.map((item) => {
  if (item.value.startsWith("custom-")) return item;
  return {
    ...item,
    label: t(item.label as "inbox" | "reports" | "settings"),
    content: t(item.content as "inboxContent" | "reportsContent" | "settingsContent")
  };
});

const onChange = (event: CustomEvent): void => {
  active.set(String(event.detail));
};

const onRemove = (event: CustomEvent): void => {
  const detail = Array.isArray(event.detail) ? event.detail : [event.detail];
  const removed = String(detail[0] || "");
  const next = tabItems.value.filter((item) => item.value !== removed);
  tabItems.set(next);
  if (active.value === removed) active.set(next[0]?.value || "");
};

const onAdd = (): void => {
  const nextIndex = tabItems.value.length + 1;
  const value = `custom-${nextIndex}`;
  tabItems.set([
    ...tabItems.value,
    { label: `${t("newTab")} ${nextIndex}`, value, icon: "+", content: t("newContent") }
  ]);
  active.set(value);
};

const code = `<elf-tabs
  type="border-card"
  tab-position="right"
  editable
  show-panels
  :items.prop=\${tabItems.value}
  :modelValue.prop=\${active.value}
  @update:modelValue=\${onChange}
  @tab-remove=\${onRemove}
  @tab-add=\${onAdd}
/>`;

const script = `const active = useRef("reports");
const tabItems = useRef([...]);

const onRemove = (event) => {
  const [removed] = event.detail;
  const next = tabItems.value.filter((item) => item.value !== removed);
  tabItems.set(next);
  if (active.value === removed) active.set(next[0]?.value || "");
};

const onAdd = () => {
  const value = \`custom-\${tabItems.value.length + 1}\`;
  tabItems.set([...tabItems.value, { label: "新标签", value, content: "新内容" }]);
  active.set(value);
};

const onChange = (event) => {
    active.set(String(event.detail));
};`;

const PageTabsEx6 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="width:100%;max-width:860px;min-height:260px">
      <elf-tabs
        :key=${t("section")}
        type="border-card"
        tab-position="right"
        editable
        show-panels
        :items.prop=${localizedItems()}
        :modelValue.prop=${active.value}
        @update:modelValue=${onChange}
        @tab-remove=${onRemove}
        @tab-add=${onAdd}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx6 };
