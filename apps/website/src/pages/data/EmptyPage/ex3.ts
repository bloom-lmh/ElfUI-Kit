import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "首次使用与操作区", en: "First use and actions" },
  emptyStatus: { zh: "0 个项目", en: "0 projects" },
  createdStatus: { zh: "1 个项目 · 刚刚创建", en: "1 project · created just now" },
  reset: { zh: "重置案例", en: "Reset demo" },
  description: {
    zh: "从空工作区开始创建第一个项目，或导入已有模板。",
    en: "Create the first project in this workspace or import an existing template.",
  },
  create: { zh: "创建项目", en: "Create project" },
  import: { zh: "导入模板", en: "Import template" },
  project: { zh: "ElfUI 设计系统", en: "ElfUI design system" },
  created: { zh: "刚刚创建 · 0 个任务", en: "Created just now · 0 tasks" },
  open: { zh: "打开项目", en: "Open project" },
});

// State
const created = useRef(false);

// Derived state
const statusText = (): string => (created.value ? t("createdStatus") : t("emptyStatus"));

// Methods
const createProject = (): void => created.set(true);
const resetDemo = (): void => created.set(false);

const actionCode = `<elf-empty
  image="/logo.png"
  image-size="72"
  description="Create the first project in this workspace."
>
  <elf-button variant="outlined">Import template</elf-button>
  <elf-button type="primary" @click=\${createProject}>Create project</elf-button>
</elf-empty>`;

const actionScript = `const created = useRef(false);

const createProject = () => created.set(true);
const resetDemo = () => created.set(false);`;

defineStyle(styles);

const PageEmptyEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${actionCode} :script=${actionScript}>
    <div slot="status" class="empty-demo-actions">
      <span role="status" aria-live="polite">${statusText()}</span>
      <button type="button" class="empty-demo-command" @click=${resetDemo}>
        ${t("reset")}
      </button>
    </div>
    <div class="empty-first-use-panel">
      <elf-empty
        v-if=${!created.value}
        image="/logo.png"
        image-size="72"
        :description=${t("description")}
      >
        <elf-button size="sm" variant="outlined">${t("import")}</elf-button>
        <elf-button size="sm" type="primary" @click=${createProject}>
          ${t("create")}
        </elf-button>
      </elf-empty>
      <article v-else class="empty-created-project">
        <img src="/logo.png" alt="" />
        <div>
          <strong>${t("project")}</strong>
          <span>${t("created")}</span>
        </div>
        <elf-button size="sm" variant="text">${t("open")}</elf-button>
      </article>
    </div>
  </elf-playground>
`);

export { PageEmptyEx3 };
