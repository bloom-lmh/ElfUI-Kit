import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "虚拟列表", en: "VirtualList" },
  title: { zh: "10,000 条构建任务与自定义行", en: "10,000 build tasks with custom rows" },
  task: { zh: "构建任务", en: "Build task" },
  running: { zh: "运行中", en: "Running" },
  completed: { zh: "已完成", en: "Completed" },
  waiting: { zh: "等待中", en: "Waiting" },
  status: { zh: "条 · 固定 44px 行高 · 仅渲染可见窗口", en: "rows · fixed 44px height · viewport-only rendering" }
});

const total = 10000;
const items = Array.from({ length: total }, (_, index) => ({ id: index, status: index % 3 }));
const listItemStyle = { paddingInline: "20px", background: "var(--elf-bg-paper)" };
const renderItem = (item: unknown): Node => {
  const row = item as { id: number; status: number };
  const container = document.createElement("div");
  container.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%";
  const title = document.createElement("span");
  title.textContent = `${t("task")} #${String(row.id + 1).padStart(5, "0")}`;
  const status = document.createElement("span");
  status.style.cssText = "color:var(--elf-text-secondary);font-size:12px";
  status.textContent = row.status === 0 ? t("running") : row.status === 1 ? t("completed") : t("waiting");
  container.append(title, status);
  return container;
};

const code = `<elf-virtual-list
  :items.prop="items"
  :renderItem.prop="renderItem"
  :listItemStyle.prop="listItemStyle"
  list-item-class="task-row"
  height="352"
  item-height="44"
/>`;
const script = `const listItemStyle = { paddingInline: "20px", background: "var(--elf-bg-paper)" };
const renderItem = (item) => createTaskRow(item);

const total = 10000;
const items = Array.from({ length: total }, (_, index) => ({ id: index, status: index % 3 }));`;

const PageVirtualListEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${total.toLocaleString()} ${t("status")}</span>
    <elf-virtual-list
      :key=${t("section")}
      style="width:100%;max-width:760px"
      :items.prop=${items}
      :renderItem.prop=${renderItem}
      :listItemStyle.prop=${listItemStyle}
      list-item-class="task-row"
      height="352"
      item-height="44"
      overscan="5"
      bordered
    ></elf-virtual-list>
  </elf-playground>
`);

export { PageVirtualListEx2 };
