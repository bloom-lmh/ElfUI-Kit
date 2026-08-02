import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "关闭守卫", en: "Close guard" },
  open: { zh: "打开带关闭守卫的对话框", en: "Open guarded dialog" },
  dialogTitle: { zh: "确认关闭", en: "Confirm before closing" },
  confirmClose: {
    zh: "确认关闭？未提交的数据将丢失。",
    en: "Close this dialog? Unsaved changes will be lost.",
  },
  body: {
    zh: "before-close 可以同步或异步决定是否允许关闭。",
    en: "before-close can synchronously or asynchronously decide whether closing is allowed.",
  },
  cancel: { zh: "取消", en: "Cancel" },
  confirm: { zh: "确认关闭", en: "Close dialog" },
});

const open = useRef(false);
const beforeClose = (): boolean => window.confirm(t("confirmClose"));
const showDialog = (): void => open.set(true);
const requestClose = (): void => {
  if (beforeClose()) open.set(false);
};
const updateOpen = (event: CustomEvent<boolean>): void => open.set(Boolean(event.detail));

const code = `<elf-button @click=\${showDialog}>${t("open")}</elf-button>
<elf-dialog
  v-model:open="open"
  title="${t("dialogTitle")}"
  :before-close="beforeClose"
>
  <p>${t("body")}</p>
</elf-dialog>`;

const script = `const open = useRef(false);

const beforeClose = () => window.confirm("${t("confirmClose")}");
const showDialog = () => open.set(true);`;

const PageDialogEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-button @click=${showDialog}>${t("open")}</elf-button>
    <elf-dialog
      :open=${open}
      :title=${t("dialogTitle")}
      :before-close=${beforeClose}
      @update:open=${updateOpen}
    >
      <p>${t("body")}</p>
      <template #footer>
        <elf-button @click=${requestClose}>${t("cancel")}</elf-button>
        <elf-button type="primary" @click=${requestClose}>${t("confirm")}</elf-button>
      </template>
    </elf-dialog>
  </elf-playground>
`);

export { PageDialogEx2 };
