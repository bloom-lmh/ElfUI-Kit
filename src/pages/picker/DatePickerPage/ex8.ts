import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

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
const pick = createDocsPicker();

const dialogOpen = useRef(false);
const date = useRef("2026-08-18");
const status = useRef(t("waiting"));

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

const code = () =>
  pick(
    `<elf-dialog v-model:open="dialogOpen" title="发布计划">
  <elf-date-picker
    v-model="date"
    label="发布日期"
    @visible-change="onPickerVisible"
  />
</elf-dialog>`,
    `<elf-dialog v-model:open="dialogOpen" title="Release schedule">
  <elf-date-picker
    v-model="date"
    label="Release date"
    @visible-change="onPickerVisible"
  />
</elf-dialog>`,
  );

const script = () =>
  pick(
    `const dialogOpen = useRef(false);
const date = useRef("2026-08-18");
const status = useRef("等待打开");

const onPickerVisible = (event) => {
  status.set(event.detail ? "日期面板位于最上层" : "对话框已打开");
};`,
    `const dialogOpen = useRef(false);
const date = useRef("2026-08-18");
const status = useRef("Waiting to open");

const onPickerVisible = (event) => {
  status.set(event.detail ? "Date panel is topmost" : "Dialog open");
};`,
  );

defineStyle(demoStyles);

const PageDatePickerEx8 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script()}>
    <div class="date-picker-demo-stage">
      <elf-button id="date-picker-open-dialog" type="primary" @click=${openDialog}>
        ${t("open")}
      </elf-button>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${status}
    </span>

    <elf-dialog
      :open=${dialogOpen}
      :title=${t("dialogTitle")}
      @update:open=${updateDialog}
    >
      <div class="date-picker-demo-modal">
        <p>${t("intro")}</p>
        <elf-date-picker
          id="dialog-date-picker"
          :modelValue.prop=${date}
          :label=${t("label")}
          @update:modelValue=${updateDate}
          @visible-change=${onPickerVisible}
        ></elf-date-picker>
      </div>
    </elf-dialog>
  </elf-playground>
`);

export { PageDatePickerEx8 };
