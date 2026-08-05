import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { nativeDateAdapter, type DateAdapter } from "@elfui/kit";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const value = useRef("2026-07-29 14:30:00");
const t = createDocsTranslator({
  title: { zh: "全球团队排期", en: "Global team schedule" },
  meta: { zh: "en-GB 格式 · 周日起始", en: "en-GB format · Sunday first" },
  label: { zh: "本地化排期", en: "Localized schedule" },
  active: { zh: "原生适配器 · en-GB · 周日开始", en: "Native adapter · en-GB · Sunday first" },
});
const pick = createDocsPicker();

const adapter: DateAdapter = {
  ...nativeDateAdapter,
  format(date, pattern, context) {
    return nativeDateAdapter.format(date, pattern, context);
  },
};
const config = {
  date: {
    adapter,
    locale: "en-GB",
    firstDayOfWeek: 0,
  },
};
const onUpdate = (event: CustomEvent<string>): void => value.set(event.detail);
const code = () =>
  pick(
    `<elf-config-provider :config.prop="config">
  <elf-date-time-picker
    :modelValue.prop="schedule"
    label="本地化排期"
  />
</elf-config-provider>`,
    `<elf-config-provider :config.prop="config">
  <elf-date-time-picker
    :modelValue.prop="schedule"
    label="Localized schedule"
  />
</elf-config-provider>`,
  );
const script = `import { nativeDateAdapter } from "@elfui/kit";

const adapter = {
  ...nativeDateAdapter,
  format(date, pattern, context) {
    return nativeDateAdapter.format(date, pattern, context);
  }
};
const config = {
  date: { adapter, locale: "en-GB", firstDayOfWeek: 0 }
};`;

defineStyle(demoStyles);

const PageDateTimePickerEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <elf-config-provider :config.prop=${config}>
      <div class="dtp-card">
        <div class="dtp-card-head">
          <strong class="dtp-card-title">${t("title")}</strong>
          <span class="dtp-card-meta">${t("meta")}</span>
        </div>
        <elf-date-time-picker
          :modelValue.prop=${value}
          :label=${t("label")}
          @update:modelValue=${onUpdate}
        ></elf-date-time-picker>
      </div>
    </elf-config-provider>
    <span slot="status" class="demo-state">${t("active")}</span>
  </elf-playground>
`);

export { PageDateTimePickerEx4 };
