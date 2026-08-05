import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  section: { zh: "基础用法", en: "Basic usage" },
  title: {
    zh: "受控选中",
    en: "Controlled selection",
  },
  current: { zh: "当前", en: "Current" },
  activity: { zh: "动态", en: "Activity" },
  activityContent: {
    zh: "最近动态、待办和系统提醒。",
    en: "Recent activity, tasks, and system notices.",
  },
  projects: { zh: "项目", en: "Projects" },
  projectsContent: {
    zh: "项目进度、成员分工和里程碑。",
    en: "Project status, owners, and milestones.",
  },
  archive: { zh: "归档", en: "Archive" },
  archiveContent: { zh: "已归档内容。", en: "Archived content." },
});

const active = useRef("activity");
const items = () => [
  { label: t("activity"), value: "activity", icon: "A", content: t("activityContent") },
  { label: t("projects"), value: "projects", icon: "P", badge: 6, content: t("projectsContent") },
  {
    label: t("archive"),
    value: "archive",
    icon: "R",
    disabled: true,
    content: t("archiveContent"),
  },
];
const onChange = (event: CustomEvent): void => active.set(String(event.detail));
const status = (): string => `${t("current")}: ${active.value}`;

const code = `<elf-tabs
  :items.prop=\${items}
  :modelValue=\${active}
  show-panels
  @update:modelValue=\${onChange}
/>`;
const script = (): string => `const active = useRef("activity");
const items = [
  { label: "${t("activity")}", value: "activity", content: "${t("activityContent")}" },
  { label: "${t("projects")}", value: "projects", badge: 6, content: "${t("projectsContent")}" }
];
const onChange = (event) => active.set(event.detail);`;

defineStyle(styles);

const PageTabsEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script()}>
    <span slot="status" role="status" aria-live="polite">${status()}</span>
    <div class="tabs-demo-stage" style="max-width:760px">
      <elf-tabs
        :key=${t("section")}
        :items.prop=${items()}
        :modelValue.prop=${active.value}
        show-panels
        @update:modelValue=${onChange}
      ></elf-tabs>
    </div>
  </elf-playground>
`);

export { PageTabsEx1 };
