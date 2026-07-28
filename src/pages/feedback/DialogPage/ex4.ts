import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "混合嵌套与关闭顺序", en: "Mixed nesting and close order" },
  statusDialog: { zh: "对话框已打开", en: "Dialog open" },
  statusDrawer: { zh: "抽屉位于最上层", en: "Drawer is topmost" },
  statusClosed: { zh: "等待打开", en: "Waiting to open" },
  openDialog: { zh: "打开编辑流程", en: "Open editing flow" },
  dialogTitle: { zh: "编辑项目", en: "Edit project" },
  intro: {
    zh: "在对话框内打开抽屉。Escape 始终只关闭最上层浮层，并把焦点还给对应触发按钮。",
    en: "Open a drawer from the dialog. Escape closes only the topmost overlay and returns focus to its trigger."
  },
  openDrawer: { zh: "选择负责人", en: "Choose owner" },
  drawerTitle: { zh: "项目成员", en: "Project members" },
  drawerBody: {
    zh: "这是与 Dialog 共用同一交互栈的 Drawer。再次按 Escape 后才会关闭外层对话框。",
    en: "This Drawer shares the modal interaction stack with Dialog. Press Escape again to close the outer dialog."
  },
  close: { zh: "完成", en: "Done" }
});

// State
const dialogOpen = useRef(false);
const drawerOpen = useRef(false);

// Derived state
const status = (): string =>
  drawerOpen.value
    ? t("statusDrawer")
    : dialogOpen.value
      ? t("statusDialog")
      : t("statusClosed");

// Methods
const openDialog = (): void => dialogOpen.set(true);
const openDrawer = (): void => drawerOpen.set(true);
const closeDrawer = (): void => drawerOpen.set(false);
const updateDialog = (event: CustomEvent<boolean>): void => dialogOpen.set(Boolean(event.detail));
const updateDrawer = (event: CustomEvent<boolean>): void => drawerOpen.set(Boolean(event.detail));

const code = `<elf-button @click="openDialog">打开编辑流程</elf-button>
<elf-dialog v-model:open="dialogOpen" title="编辑项目">
  <p>Escape 始终只关闭最上层浮层。</p>
  <elf-button @click="openDrawer">选择负责人</elf-button>

  <elf-drawer v-model:open="drawerOpen" title="项目成员" size="360px">
    <p>Drawer 与 Dialog 共用同一交互栈。</p>
  </elf-drawer>
</elf-dialog>`;

const script = `const dialogOpen = useRef(false);
const drawerOpen = useRef(false);

const openDialog = () => dialogOpen.set(true);
const openDrawer = () => drawerOpen.set(true);
const closeDrawer = () => drawerOpen.set(false);`;

const PageDialogEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" role="status" aria-live="polite">${status()}</span>
    <elf-button id="dialog-open-flow" type="primary" @click=${openDialog}>${t("openDialog")}</elf-button>

    <elf-dialog
      :open=${dialogOpen}
      :title=${t("dialogTitle")}
      @update:open=${updateDialog}
    >
      <div style="display:grid;gap:16px;min-width:min(420px,70vw)">
        <p style="margin:0;color:var(--elf-text-secondary)">${t("intro")}</p>
        <elf-button id="dialog-open-drawer" @click=${openDrawer}>${t("openDrawer")}</elf-button>
      </div>

      <elf-drawer
        :open=${drawerOpen}
        :title=${t("drawerTitle")}
        size="360px"
        @update:open=${updateDrawer}
      >
        <div style="display:grid;gap:16px;padding:4px">
          <p style="margin:0;color:var(--elf-text-secondary)">${t("drawerBody")}</p>
          <elf-button type="primary" @click=${closeDrawer}>${t("close")}</elf-button>
        </div>
      </elf-drawer>
    </elf-dialog>
  </elf-playground>
`);

export { PageDialogEx4 };
