import { defineHtml, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "基础用法", en: "Basic usage" },
  title: { zh: "受控选中 / 徽标 / 禁用项 / 内容面板", en: "Controlled value / badge / disabled / panels" },
  current: { zh: "当前", en: "Current" },
  activity: { zh: "动态", en: "Activity" },
  activityContent: { zh: "最近动态、待办和系统提醒。", en: "Recent activity, tasks, and system notices." },
  projects: { zh: "项目", en: "Projects" },
  projectsContent: { zh: "项目进度、成员分工和里程碑。", en: "Project status, owners, and milestones." },
  archive: { zh: "归档", en: "Archive" },
  archiveContent: { zh: "已归档内容。", en: "Archived content." }
});

const active = useRef("activity");
const items = () => [
  { label: t("activity"), value: "activity", icon: "A", content: t("activityContent") },
  { label: t("projects"), value: "projects", icon: "P", badge: 6, content: t("projectsContent") },
  { label: t("archive"), value: "archive", icon: "R", disabled: true, content: t("archiveContent") }
];
const onChange = (event: CustomEvent): void => active.set(String(event.detail));
const status = (): string => `${t("current")}: ${active.value}`;

const code = `<elf-tabs
  :items.prop=\${items}
  :modelValue=\${active}
  show-panels
  @update:modelValue=\${onChange}
/>`;
const script = `const active = useRef("activity");
const items = [
  { label: "Activity", value: "activity", content: "Recent activity" },
  { label: "Projects", value: "projects", badge: 6, content: "Project status" }
];
const onChange = (event) => active.set(event.detail);`;

const PageTabsEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <div style="display:grid;gap:12px;width:100%;max-width:760px">
      <elf-tabs
        :key=${t("section")}
        :items.prop=${items()}
        :modelValue.prop=${active.value}
        show-panels
        @update:modelValue=${onChange}
      ></elf-tabs>
      <p slot="status" class="demo-state">${status()}</p>
    </div>
  </elf-playground>
`);

export { PageTabsEx1 };
