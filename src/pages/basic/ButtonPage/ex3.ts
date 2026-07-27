import { defineHtml, defineStyle, onUnmounted, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const saveState = useRef<"idle" | "saving" | "saved">("idle");
const submitCount = useRef(0);
const formState = useRef<"waiting" | "submitted" | "reset">("waiting");
let saveTimer: ReturnType<typeof setTimeout> | null = null;

const t = createDocsTranslator({
  asyncTitle: { zh: "异步操作与防重复提交", en: "Async action and duplicate-submit guard" },
  asyncHint: {
    zh: "加载期间按钮不可再次触发，状态变化在标题行同步展示",
    en: "The button cannot fire again while loading; status is announced in the title row"
  },
  idle: { zh: "等待保存", en: "Ready to save" },
  saving: { zh: "正在保存", en: "Saving" },
  saved: { zh: "保存完成", en: "Saved" },
  resetAction: { zh: "重置状态", en: "Reset state" },
  saveTitle: { zh: "发布设置", en: "Publish settings" },
  saveDescription: {
    zh: "异步请求完成前保持按钮禁用，并向辅助技术播报结果。",
    en: "Keep the action disabled until the request completes and announce the result."
  },
  save: { zh: "保存设置", en: "Save settings" },
  disabled: { zh: "无权限", en: "No permission" },
  formTitle: { zh: "原生表单、键盘与重置", en: "Native form, keyboard, and reset" },
  formHint: {
    zh: "Tab 聚焦后可按 Enter 或 Space；submit/reset 可跨 Shadow DOM 作用于外层表单",
    en: "After Tab focuses the button, press Enter or Space; submit/reset bridge the Shadow DOM boundary"
  },
  project: { zh: "项目名称", en: "Project name" },
  submit: { zh: "提交表单", en: "Submit form" },
  resetForm: { zh: "重置", en: "Reset" },
  waiting: { zh: "等待提交", en: "Waiting for submission" },
  submitted: { zh: "已提交", en: "Submitted" },
  reset: { zh: "表单已重置", en: "Form reset" }
});

const isSaving = (): boolean => saveState.value === "saving";
const saveStateText = (): string => t(saveState.value);
const formStateText = (): string => {
  const label = t(formState.value);
  return formState.value === "submitted" ? `${label} · ${submitCount.value}` : label;
};

const clearSaveTimer = (): void => {
  if (saveTimer === null) return;
  clearTimeout(saveTimer);
  saveTimer = null;
};

const save = (): void => {
  if (isSaving()) return;
  clearSaveTimer();
  saveState.set("saving");
  saveTimer = setTimeout(() => {
    saveState.set("saved");
    saveTimer = null;
  }, 800);
};

const resetSave = (): void => {
  clearSaveTimer();
  saveState.set("idle");
};

const onFormSubmit = (event: SubmitEvent): void => {
  event.preventDefault();
  submitCount.set(submitCount.value + 1);
  formState.set("submitted");
};

const onFormReset = (): void => formState.set("reset");

onUnmounted(clearSaveTimer);

const asyncCode = `<elf-button :loading.prop=\${saving.value} @click=\${save}>
  Save settings
</elf-button>
<elf-button disabled>No permission</elf-button>`;

const asyncScript = `const saving = useRef(false);

const save = async () => {
  if (saving.value) return;
  saving.set(true);
  try {
    await saveSettings();
  } finally {
    saving.set(false);
  }
};`;

const formCode = `<form @submit=\${onSubmit} @reset=\${onReset}>
  <input name="project" value="ElfUI Kit" />
  <elf-button type="submit">Submit form</elf-button>
  <elf-button type="reset" variant="outlined">Reset</elf-button>
</form>`;

const formScript = `const onSubmit = (event) => {
  event.preventDefault();
  // type="submit" 会提交最近的外层 form；
  // form="form-id" 也可显式关联其他表单。
};

const onReset = () => {
  // type="reset" 使用原生 form.reset() 语义。
};`;

defineStyle(styles);

const PageButtonEx3 = defineHtml(`
  <elf-playground :title=${t("asyncTitle")} :code=${asyncCode} :script=${asyncScript}>
    <span slot="status" class="button-demo-actions">
      <span role="status" aria-live="polite">${saveStateText()}</span>
      <elf-button size="sm" variant="text" @click=${resetSave}>${t("resetAction")}</elf-button>
    </span>
    <section class="button-action-panel">
      <div>
        <span class="button-demo-eyebrow">Async</span>
        <strong>${t("saveTitle")}</strong>
        <p>${t("saveDescription")}</p>
      </div>
      <div class="button-demo-row">
        <elf-button :loading.prop=${isSaving()} @click=${save}>
          ${isSaving() ? t("saving") : t("save")}
        </elf-button>
        <elf-button disabled>${t("disabled")}</elf-button>
      </div>
    </section>
  </elf-playground>

  <elf-playground :title=${t("formTitle")} :code=${formCode} :script=${formScript}>
    <span slot="status" class="button-demo-status" role="status" aria-live="polite">
      ${formStateText()}
    </span>
    <form class="button-form-demo" @submit=${onFormSubmit} @reset=${onFormReset}>
      <label>
        <span>${t("project")}</span>
        <input name="project" value="ElfUI Kit" />
      </label>
      <div class="button-demo-row">
        <elf-button type="submit">${t("submit")}</elf-button>
        <elf-button type="reset" variant="outlined">${t("resetForm")}</elf-button>
      </div>
      <p>${t("formHint")}</p>
    </form>
  </elf-playground>
`);

export { PageButtonEx3 };
