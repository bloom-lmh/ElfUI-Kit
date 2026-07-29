import { defineHtml, defineStyle, globalStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import drawerDemoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  section: { zh: "焦点与移动端", en: "Focus and mobile" },
  waiting: { zh: "等待打开", en: "Waiting to open" },
  opening: { zh: "正在打开", en: "Opening" },
  focused: {
    zh: "焦点已进入抽屉，页面滚动已锁定",
    en: "Focus entered the drawer and page scrolling is locked",
  },
  restored: { zh: "焦点已返回打开按钮", en: "Focus returned to the trigger" },
  open: { zh: "打开筛选抽屉", en: "Open filter drawer" },
  title: { zh: "团队筛选", en: "Team filters" },
  intro: {
    zh: "Tab 与 Shift+Tab 始终停留在抽屉内；按 Esc 关闭后，焦点返回打开按钮。",
    en: "Tab and Shift+Tab stay inside the drawer. Escape closes it and restores focus to the trigger.",
  },
  keyword: { zh: "关键词", en: "Keyword" },
  placeholder: { zh: "姓名或团队", en: "Name or team" },
  workStatus: { zh: "工作状态", en: "Work status" },
  all: { zh: "全部状态", en: "All statuses" },
  active: { zh: "进行中", en: "Active" },
  review: { zh: "等待评审", en: "Awaiting review" },
  matched: { zh: "匹配成员", en: "Matching members" },
  projects: { zh: "活跃项目", en: "Active projects" },
  cancel: { zh: "取消", en: "Cancel" },
  apply: { zh: "应用筛选", en: "Apply filters" },
});

const open = useRef(false);
const status = useRef(t("waiting"));

const showDrawer = (): void => {
  status.set(t("opening"));
  open.set(true);
};
const closeDrawer = (): void => open.set(false);
const onAutoFocus = (): void => status.set(t("focused"));
const onRestoreFocus = (): void => status.set(t("restored"));

const code = `<elf-button @click=\${showDrawer}>${t("open")}</elf-button>
<elf-drawer
  v-model:open="open"
  title="${t("title")}"
  direction="rtl"
  size="min(420px, 100vw)"
  @open-auto-focus="onAutoFocus"
  @close-auto-focus="onRestoreFocus"
>
  <label>${t("keyword")} <input autofocus placeholder="${t("placeholder")}" /></label>
  <elf-button @click=\${closeDrawer}>${t("apply")}</elf-button>
</elf-drawer>`;

const script = `const open = useRef(false);
const status = useRef("${t("waiting")}");

const showDrawer = () => open.set(true);
const closeDrawer = () => open.set(false);
const onAutoFocus = () => status.set("${t("focused")}");
const onRestoreFocus = () => status.set("${t("restored")}");`;

defineStyle(drawerDemoStyles);
globalStyle(drawerDemoStyles);

const PageDrawerEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <span slot="status">${status}</span>
    <div class="drawer-focus-trigger">
      <elf-button type="primary" @click=${showDrawer}>${t("open")}</elf-button>
    </div>

    <elf-drawer
      v-model:open="open"
      :title=${t("title")}
      direction="rtl"
      size="min(420px, 100vw)"
      @open-auto-focus=${onAutoFocus}
      @close-auto-focus=${onRestoreFocus}
    >
      <form class="drawer-filter-form" @submit.prevent=${closeDrawer}>
        <p class="drawer-filter-intro">${t("intro")}</p>
        <div class="drawer-filter-grid">
          <label class="drawer-filter-field">
            ${t("keyword")}
            <input autofocus :placeholder=${t("placeholder")} />
          </label>
          <label class="drawer-filter-field">
            ${t("workStatus")}
            <select>
              <option>${t("all")}</option>
              <option>${t("active")}</option>
              <option>${t("review")}</option>
            </select>
          </label>
        </div>
        <div class="drawer-filter-summary">
          <div><strong>24</strong><span>${t("matched")}</span></div>
          <div><strong>6</strong><span>${t("projects")}</span></div>
        </div>
        <div class="drawer-filter-actions">
          <elf-button @click=${closeDrawer}>${t("cancel")}</elf-button>
          <elf-button type="primary" native-type="submit">${t("apply")}</elf-button>
        </div>
      </form>
    </elf-drawer>
  </elf-playground>
`);

export { PageDrawerEx3 };
