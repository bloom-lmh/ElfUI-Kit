import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "模态层中的日期面板", en: "Date panel inside a modal" },
  waiting: { zh: "等待打开", en: "Waiting to open" },
  dialogOpen: { zh: "对话框已打开", en: "Dialog open" },
  pickerOpen: { zh: "日期面板位于最上层", en: "Date panel is topmost" },
  open: { zh: "安排发布窗口", en: "Schedule release window" },
  dialogTitle: { zh: "发布计划", en: "Release schedule" },
  intro: {
    zh: "第一次按 Escape 只关闭日期面板，第二次才关闭 Dialog。",
    en: "The first Escape closes only the date panel, and the second closes Dialog.",
  },
  label: { zh: "发布日期", en: "Release date" },
});

// State
const dialogOpen = useRef(false);
const date = useRef("2026-08-18");
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

const updateDate = (event: CustomEvent<string>): void => date.set(event.detail || "");
const onPickerVisible = (event: CustomEvent<boolean>): void =>
  status.set(event.detail ? t("pickerOpen") : t("dialogOpen"));

const code = `<elf-dialog v-model:open="dialogOpen" title="发布计划">
  <elf-date-picker
    v-model="date"
    label="发布日期"
    @visible-change="onPickerVisible"
  />
</elf-dialog>`;

const script = `const dialogOpen = useRef(false);
const date = useRef("2026-08-18");

const onPickerVisible = (event) => {
  console.log(event.detail ? "DatePicker topmost" : "Dialog topmost");
};`;

const PageDatePickerEx8 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" role="status" aria-live="polite">${status}</span>
    <elf-button id="date-picker-open-dialog" type="primary" @click=${openDialog}>
      ${t("open")}
    </elf-button>

    <elf-dialog
      :open=${dialogOpen}
      :title=${t("dialogTitle")}
      @update:open=${updateDialog}
    >
      <div style="display:grid;gap:16px;min-width:min(420px,70vw)">
        <p style="margin:0;color:var(--elf-text-secondary)">${t("intro")}</p>
        <elf-date-picker
          id="dialog-date-picker"
          :modelValue.prop=${date}
          :label=${t("label")}
          @update:modelValue=${updateDate}
          @visible-change=${onPickerVisible}
        />
      </div>
    </elf-dialog>
  </elf-playground>
`);

export { PageDatePickerEx8 };
