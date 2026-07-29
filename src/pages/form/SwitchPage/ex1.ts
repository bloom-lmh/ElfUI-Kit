import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  basics: { zh: "基础", en: "Basics" },
  controlled: { zh: "受控状态", en: "Controlled state" },
  notification: { zh: "接收系统通知", en: "Receive system notifications" },
  enabled: { zh: "已开启", en: "Enabled" },
  disabled: { zh: "已关闭", en: "Disabled" },
  textSection: { zh: "状态文字", en: "State text" },
  textTitle: { zh: "开启与关闭文字", en: "Active and inactive text" },
  on: { zh: "开", en: "On" },
  off: { zh: "关", en: "Off" },
  customSection: { zh: "自定义值与内嵌提示", en: "Custom values and inline prompt" },
  customTitle: { zh: "自定义开关值与内嵌提示", en: "Custom switch values and inline prompt" },
  service: { zh: "服务状态", en: "Service status" },
});

const enabled = useRef(false);
const textValue = useRef(true);
const status = useRef("disabled");

const updateEnabled = (event: Event): void => {
  enabled.set(Boolean((event as CustomEvent).detail));
};

const updateText = (event: Event): void => {
  textValue.set(Boolean((event as CustomEvent).detail));
};

const updateStatus = (event: Event): void => {
  status.set(String((event as CustomEvent).detail));
};

const code3 = `<elf-switch
  :modelValue.prop=\${status.value}
  active-value="enabled"
  inactive-value="disabled"
  inline-prompt
  width="64"
  active-text="${t("on")}"
  inactive-text="${t("off")}"
  @update:modelValue=\${updateStatus}
/>`;

const code3Script = `const status = useRef("disabled");
const updateStatus = (event) => {
    status.set(String(event.detail));
};`;

const code1 = `<elf-switch v-model="enabled" label="${t("notification")}" />`;

const code1Script = `const enabled = useRef(false);`;
const code2 = `<elf-switch active-text="${t("on")}" inactive-text="${t("off")}" />`;

const PageSwitchEx1 = defineHtml(`
  <h2>${t("basics")}</h2>
  <elf-playground :title=${t("controlled")} :code=${code1} :script=${code1Script}>
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <elf-switch
        :modelValue.prop=${enabled.value}
        :label=${t("notification")}
        @update:modelValue=${updateEnabled}
      ></elf-switch>
      <span slot="status" class="demo-state">{{ enabled ? t("enabled") : t("disabled") }}</span>
    </div>
  </elf-playground>

  <h2>${t("textSection")}</h2>
  <elf-playground :title=${t("textTitle")} :code=${code2}>
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <elf-switch
        :modelValue.prop=${textValue.value}
        :active-text=${t("on")}
        :inactive-text=${t("off")}
        @update:modelValue=${updateText}
      ></elf-switch>
      <elf-switch :active-text=${t("on")} :inactive-text=${t("off")}></elf-switch>
    </div>
  </elf-playground>
  <h2>${t("customSection")}</h2>
  <elf-playground :title=${t("customTitle")} :code=${code3} :script=${code3Script}>
    <elf-switch
      :modelValue.prop=${status.value}
      active-value="enabled"
      inactive-value="disabled"
      inline-prompt
      width="64"
      :active-text=${t("on")}
      :inactive-text=${t("off")}
      :aria-label=${t("service")}
      @update:modelValue=${updateStatus}
    ></elf-switch>
    <span slot="status" class="demo-state">{{ status }}</span>
  </elf-playground>
`);

export { PageSwitchEx1 };
