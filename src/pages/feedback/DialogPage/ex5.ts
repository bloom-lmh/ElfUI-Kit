import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "模态层与锚定浮层", en: "Modal and anchored overlays" },
  waiting: { zh: "等待打开", en: "Waiting to open" },
  dialogOpen: { zh: "对话框已打开", en: "Dialog open" },
  confirmOpen: { zh: "确认气泡位于最上层", en: "Confirmation is topmost" },
  open: { zh: "打开发布流程", en: "Open publish flow" },
  dialogTitle: { zh: "发布版本", en: "Publish release" },
  intro: {
    zh: "在 Dialog 内打开 PopConfirm。第一次按 Escape 只关闭确认气泡，第二次才关闭对话框。",
    en: "Open PopConfirm inside Dialog. The first Escape closes only the confirmation, and the second closes the dialog.",
  },
  trigger: { zh: "发布到生产环境", en: "Publish to production" },
  confirmTitle: { zh: "确认发布？", en: "Confirm release?" },
  confirmContent: {
    zh: "该操作会立即更新线上版本。",
    en: "This immediately updates the production release.",
  },
});

// State
const dialogOpen = useRef(false);
const status = useRef(t("waiting"));

// Methods
const openDialog = (): void => {
  dialogOpen.set(true);
  status.set(t("dialogOpen"));
};

const updateDialog = (event: CustomEvent<boolean>): void => {
  dialogOpen.set(Boolean(event.detail));
  if (!event.detail) status.set(t("waiting"));
};

const onConfirmOpen = (): void => status.set(t("confirmOpen"));
const onConfirmClose = (): void => status.set(t("dialogOpen"));

const code = `<elf-button @click="openDialog">${t("open")}</elf-button>
<elf-dialog v-model:open="dialogOpen" title="${t("dialogTitle")}">
  <elf-pop-confirm
    title="${t("confirmTitle")}"
    content="${t("confirmContent")}"
  >
    <elf-button>${t("trigger")}</elf-button>
  </elf-pop-confirm>
</elf-dialog>`;

const script = `const dialogOpen = useRef(false);

const openDialog = () => dialogOpen.set(true);`;

const PageDialogEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" role="status" aria-live="polite">${status}</span>
    <elf-button id="dialog-open-overlay-flow" type="primary" @click=${openDialog}>
      ${t("open")}
    </elf-button>

    <elf-dialog
      :open=${dialogOpen}
      :title=${t("dialogTitle")}
      @update:open=${updateDialog}
    >
      <div style="display:grid;gap:16px;min-width:min(420px,70vw)">
        <p style="margin:0;color:var(--elf-text-secondary)">${t("intro")}</p>
        <elf-pop-confirm
          id="dialog-overlay-popconfirm"
          :title=${t("confirmTitle")}
          :content=${t("confirmContent")}
          @open=${onConfirmOpen}
          @close=${onConfirmClose}
        >
          <elf-button>${t("trigger")}</elf-button>
        </elf-pop-confirm>
      </div>
    </elf-dialog>
  </elf-playground>
`);

export { PageDialogEx5 };
