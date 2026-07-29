import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "键盘与焦点", en: "Keyboard and focus" },
  waiting: { zh: "等待打开", en: "Waiting to open" },
  opening: { zh: "正在打开", en: "Opening" },
  focused: {
    zh: "焦点已进入对话框；Tab 不会离开",
    en: "Focus entered the dialog; Tab stays inside",
  },
  restored: {
    zh: "焦点已返回打开按钮",
    en: "Focus returned to the trigger",
  },
  open: { zh: "打开键盘对话框", en: "Open keyboard dialog" },
  dialogTitle: { zh: "创建工作区", en: "Create workspace" },
  fieldLabel: { zh: "工作区名称", en: "Workspace name" },
  placeholder: { zh: "例如：设计系统", en: "For example: Design system" },
  hint: {
    zh: "按 Tab / Shift+Tab 检查循环焦点，按 Esc 关闭。",
    en: "Use Tab / Shift+Tab to verify focus looping, then press Escape to close.",
  },
  cancel: { zh: "取消", en: "Cancel" },
  create: { zh: "创建", en: "Create" },
});

const open = useRef(false);
const focusStatus = useRef(t("waiting"));

const showDialog = (): void => {
  focusStatus.set(t("opening"));
  open.set(true);
};
const closeDialog = (): void => open.set(false);
const updateOpen = (event: CustomEvent<boolean>): void => open.set(Boolean(event.detail));
const onAutoFocus = (): void => focusStatus.set(t("focused"));
const onRestoreFocus = (): void => focusStatus.set(t("restored"));

const code = `<elf-button @click=\${showDialog}>${t("open")}</elf-button>
<elf-dialog
  v-model:open="open"
  title="${t("dialogTitle")}"
  @open-auto-focus="onAutoFocus"
  @close-auto-focus="onRestoreFocus"
>
  <label for="workspace-name">${t("fieldLabel")}</label>
  <input id="workspace-name" autofocus placeholder="${t("placeholder")}" />
  <template #footer>
    <elf-button @click=\${closeDialog}>${t("cancel")}</elf-button>
    <elf-button @click=\${closeDialog}>${t("create")}</elf-button>
  </template>
</elf-dialog>`;

const script = `const open = useRef(false);
const focusStatus = useRef("${t("waiting")}");

const showDialog = () => open.set(true);
const closeDialog = () => open.set(false);
const onAutoFocus = () => focusStatus.set("${t("focused")}");
const onRestoreFocus = () => focusStatus.set("${t("restored")}");`;

const PageDialogEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${focusStatus}</span>
    <elf-button @click=${showDialog}>${t("open")}</elf-button>
    <elf-dialog
      :open=${open}
      :title=${t("dialogTitle")}
      @update:open=${updateOpen}
      @open-auto-focus=${onAutoFocus}
      @close-auto-focus=${onRestoreFocus}
    >
      <div style="display:grid;gap:8px;min-width:min(360px,70vw)">
        <label for="dialog-workspace-name" style="font-weight:600">${t("fieldLabel")}</label>
        <input
          id="dialog-workspace-name"
          autofocus
          :placeholder=${t("placeholder")}
          style="box-sizing:border-box;width:100%;padding:10px 12px;border:1px solid var(--elf-border);border-radius:6px;background:var(--elf-bg-paper);color:var(--elf-text-primary);outline:none"
        />
        <small style="color:var(--elf-text-secondary)">${t("hint")}</small>
      </div>
      <template #footer>
        <elf-button variant="text" @click=${closeDialog}>${t("cancel")}</elf-button>
        <elf-button @click=${closeDialog}>${t("create")}</elf-button>
      </template>
    </elf-dialog>
  </elf-playground>
`);

export { PageDialogEx3 };
