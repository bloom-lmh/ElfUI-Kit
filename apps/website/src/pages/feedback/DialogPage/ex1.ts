import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  basic: { zh: "基础用法", en: "Basic usage" },
  openDialog: { zh: "打开对话框", en: "Open dialog" },
  promptTitle: { zh: "提示", en: "Notice" },
  basicBody: {
    zh: "这是一段对话框内容，页面状态会在对话框关闭后保留。",
    en: "This dialog keeps the current page state intact after it closes.",
  },
  cancel: { zh: "取消", en: "Cancel" },
  confirm: { zh: "确定", en: "Confirm" },
  sizes: { zh: "不同尺寸", en: "Sizes" },
  fullscreen: { zh: "全屏", en: "Fullscreen" },
  small: { zh: "小尺寸", en: "Small" },
  fullscreenTitle: { zh: "全屏工作区", en: "Fullscreen workspace" },
  fullscreenHeading: { zh: "全屏对话框", en: "Fullscreen dialog" },
  back: { zh: "返回", en: "Back" },
  save: { zh: "保存", en: "Save" },
  deleteTitle: { zh: "删除确认", en: "Confirm deletion" },
  deleteBody: {
    zh: "此操作将永久删除该资源，确定继续？",
    en: "This permanently deletes the resource. Continue?",
  },
  confirmDelete: { zh: "确认删除", en: "Delete" },
});

const basicOpen = useRef(false);
const fullscreenOpen = useRef(false);
const smallOpen = useRef(false);

const openBasic = (): void => basicOpen.set(true);
const closeBasic = (): void => basicOpen.set(false);
const openFullscreen = (): void => fullscreenOpen.set(true);
const closeFullscreen = (): void => fullscreenOpen.set(false);
const openSmall = (): void => smallOpen.set(true);
const closeSmall = (): void => smallOpen.set(false);
const updateBasic = (event: CustomEvent<boolean>): void => basicOpen.set(Boolean(event.detail));
const updateFullscreen = (event: CustomEvent<boolean>): void =>
  fullscreenOpen.set(Boolean(event.detail));
const updateSmall = (event: CustomEvent<boolean>): void => smallOpen.set(Boolean(event.detail));

const basicCode = `<elf-button @click=\${showDialog}>${t("openDialog")}</elf-button>
<elf-dialog v-model:open="open" title="${t("promptTitle")}">
  <p>${t("basicBody")}</p>
  <template #footer>
    <elf-button @click=\${closeDialog}>${t("cancel")}</elf-button>
    <elf-button type="primary" @click=\${closeDialog}>${t("confirm")}</elf-button>
  </template>
</elf-dialog>`;

const basicScript = `const open = useRef(false);

const showDialog = () => open.set(true);
const closeDialog = () => open.set(false);`;

const sizesCode = `<elf-button @click=\${showFullscreenDialog}>${t("fullscreen")}</elf-button>
<elf-button @click=\${showSmallDialog}>${t("small")}</elf-button>

<elf-dialog size="fullscreen" v-model:open="fullscreenOpen" title="${t("fullscreenTitle")}">
  <h3>${t("fullscreenHeading")}</h3>
</elf-dialog>
<elf-dialog size="sm" v-model:open="smallOpen" title="${t("deleteTitle")}">
  <p>${t("deleteBody")}</p>
</elf-dialog>`;

const sizesScript = `const fullscreenOpen = useRef(false);
const smallOpen = useRef(false);

const showFullscreenDialog = () => fullscreenOpen.set(true);
const showSmallDialog = () => smallOpen.set(true);`;

const PageDialogEx1 = defineHtml(`
  <h2>${t("basic")}</h2>
  <elf-playground :title=${t("basic")} :code=${basicCode} :script=${basicScript}>
    <elf-button @click=${openBasic}>${t("openDialog")}</elf-button>
    <elf-dialog :open=${basicOpen} :title=${t("promptTitle")} size="md" @update:open=${updateBasic}>
      <p>${t("basicBody")}</p>
      <template #footer>
        <elf-button @click=${closeBasic}>${t("cancel")}</elf-button>
        <elf-button type="primary" @click=${closeBasic}>${t("confirm")}</elf-button>
      </template>
    </elf-dialog>
  </elf-playground>

  <h2>${t("sizes")}</h2>
  <elf-playground :title=${t("sizes")} :code=${sizesCode} :script=${sizesScript}>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <elf-button @click=${openFullscreen}>${t("fullscreen")}</elf-button>
      <elf-button @click=${openSmall}>${t("small")}</elf-button>
    </div>
    <elf-dialog :open=${fullscreenOpen} :title=${t("fullscreenTitle")} size="fullscreen" @update:open=${updateFullscreen}>
      <div style="padding:24px;text-align:center">
        <h3>${t("fullscreenHeading")}</h3>
      </div>
      <template #footer>
        <elf-button @click=${closeFullscreen}>${t("back")}</elf-button>
        <elf-button type="primary" @click=${closeFullscreen}>${t("save")}</elf-button>
      </template>
    </elf-dialog>
    <elf-dialog :open=${smallOpen} :title=${t("deleteTitle")} size="sm" @update:open=${updateSmall}>
      <p style="color:var(--elf-danger);font-weight:500">${t("deleteBody")}</p>
      <template #footer>
        <elf-button size="small" @click=${closeSmall}>${t("cancel")}</elf-button>
        <elf-button size="small" type="primary" @click=${closeSmall}>${t("confirmDelete")}</elf-button>
      </template>
    </elf-dialog>
  </elf-playground>
`);

export { PageDialogEx1 };
