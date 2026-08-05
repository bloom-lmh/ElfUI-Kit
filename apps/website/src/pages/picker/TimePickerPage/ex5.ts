import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const shift = useRef<[string, string]>(["22:30", "02:15"]);
const touched = useRef(false);
const t = createDocsTranslator({
  title: { zh: "跨日值班", en: "Overnight shift" },
  meta: { zh: "夜班交接 · 22:30–次日 02:15", en: "Night handover · 22:30–next day 02:15" },
  label: { zh: "跨日值班时间", en: "Overnight shift" },
  incomplete: { zh: "请选择完整值班时间", en: "Select a complete shift range" },
  waiting: { zh: "等待填写", en: "Waiting for input" },
  nextDay: { zh: "次日", en: "next day" },
  note: {
    zh: "结束时间早于开始时间时按次日计算，组件保留用户选择顺序。",
    en: "When the end precedes the start, treat it as the next day while preserving the selected order.",
  },
});
const pick = createDocsPicker();

const updateShift = (event: CustomEvent<[string, string]>): void => {
  shift.set((event.detail || ["", ""]) as [string, string]);
  touched.set(true);
};

const isComplete = (): boolean => Boolean(shift.value[0] && shift.value[1]);
const statusText = (): string =>
  isComplete()
    ? `${shift.value[0]} → ${t("nextDay")} ${shift.value[1]}`
    : touched.value
      ? t("incomplete")
      : t("waiting");

const code = () =>
  pick(
    `<elf-form label-position="top">
  <elf-form-item
    label="跨日值班时间"
    required
    :error="isComplete() ? '' : '请选择完整值班时间'"
  >
    <elf-time-picker
      :modelValue.prop="shift"
      is-range
      :step="900"
      @update:modelValue="updateShift"
    />
  </elf-form-item>
</elf-form>`,
    `<elf-form label-position="top">
  <elf-form-item
    label="Overnight shift"
    required
    :error="isComplete() ? '' : 'Select a complete shift range'"
  >
    <elf-time-picker
      :modelValue.prop="shift"
      is-range
      :step="900"
      @update:modelValue="updateShift"
    />
  </elf-form-item>
</elf-form>`,
  );

const script = `const shift = useRef(["22:30", "02:15"]);
const touched = useRef(false);

const updateShift = (event) => {
  shift.set(event.detail);
  touched.set(true);
};

const isComplete = () => Boolean(shift.value[0] && shift.value[1]);`;

defineStyle(demoStyles);

const PageTimePickerEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="time-picker-demo-stage time-picker-demo-stage--compact">
      <div class="time-picker-demo-card">
        <div class="time-picker-demo-card-head">
          <strong class="time-picker-demo-card-title">${t("title")}</strong>
          <span class="time-picker-demo-card-meta">${t("meta")}</span>
        </div>
        <elf-form label-position="top">
          <elf-form-item
            :label=${t("label")}
            required
            :error=${touched && !isComplete() ? t("incomplete") : ""}
          >
            <elf-time-picker
              :modelValue.prop=${shift}
              is-range
              :step=${900}
              @update:modelValue=${updateShift}
            ></elf-time-picker>
          </elf-form-item>
        </elf-form>
        <p class="time-picker-demo-note">${t("note")}</p>
      </div>
    </div>
    <span slot="status" class="demo-state" role="status" aria-live="polite">
      ${statusText()}
    </span>
  </elf-playground>
`);

export { PageTimePickerEx5 };
