import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "List 列表", en: "List" }, title: { zh: "结构化任务列表", en: "Structured task list" },
  design: { zh: "设计系统评审", en: "Design system review" }, regression: { zh: "组件回归测试", en: "Component regression testing" },
  release: { zh: "发布候选版本", en: "Release candidate" }, today1030: { zh: "今天 10:30", en: "Today 10:30" },
  today1400: { zh: "今天 14:00", en: "Today 14:00" }, tomorrow0900: { zh: "明天 09:00", en: "Tomorrow 09:00" }
});

const items = [
  { id: 1, title: "design", meta: "today1030" },
  { id: 2, title: "regression", meta: "today1400" },
  { id: 3, title: "release", meta: "tomorrow0900" }
];
const renderItem = (item: unknown): Node => {
  const row = item as { title: string; meta: string };
  const container = document.createElement("div");
  container.style.cssText = "display:flex;justify-content:space-between;gap:16px;width:100%";
  const title = document.createElement("strong");
  title.textContent = t(row.title as "design" | "regression" | "release");
  const meta = document.createElement("span");
  meta.style.color = "var(--elf-text-secondary)";
  meta.textContent = t(row.meta as "today1030" | "today1400" | "tomorrow0900");
  container.append(title, meta);
  return container;
};
const code = `<elf-list :items.prop=\${items} :renderItem.prop=\${renderItem} bordered />`;
const script = `const items = [
  { id: 1, title: "设计系统评审", meta: "今天 10:30" },
  { id: 2, title: "组件回归测试", meta: "今天 14:00" },
  { id: 3, title: "发布候选版本", meta: "明天 09:00" }
];

const renderItem = (item) => {
  const row = document.createElement("div");
  row.textContent = item.title;
  return row;
};`;
const PageVirtualListEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-list :key=${t("section")} style="width:100%;max-width:620px" :items.prop=${items} :renderItem.prop=${renderItem} bordered></elf-list>
  </elf-playground>
`);
export { PageVirtualListEx1 };
