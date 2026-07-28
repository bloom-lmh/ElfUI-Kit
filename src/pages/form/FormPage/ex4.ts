import { defineHtml, defineStyle, useReactive, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "./demo.scss?inline";

const disabled = useRef(false);
const settings = useReactive({
  env: "prod",
  notify: true,
  remark: "生产环境变更需要审批"
});

const t = createDocsTranslator({
  section: { zh: "布局与禁用态", en: "Layout and disabled state" },
  title: { zh: "标签布局与整表禁用", en: "Label layout and form-wide disabled state" },
  enable: { zh: "启用表单", en: "Enable form" },
  disable: { zh: "禁用表单", en: "Disable form" },
  cardTitle: { zh: "环境配置", en: "Environment settings" },
  cardSubtitle: { zh: "整表禁用会传递到所有表单控件", en: "Form-wide disabled state is inherited by every control" },
  environment: { zh: "环境", en: "Environment" },
  development: { zh: "开发环境", en: "Development" },
  testing: { zh: "测试环境", en: "Testing" },
  production: { zh: "生产环境", en: "Production" },
  notification: { zh: "通知", en: "Notifications" },
  remark: { zh: "备注", en: "Notes" }
});

const envOptions = () => [
  { label: t("development"), value: "dev" },
  { label: t("testing"), value: "test" },
  { label: t("production"), value: "prod" }
];

const toggle = (): void => {
  disabled.set(!disabled.value);
};
const onEnvUpdate = (event: CustomEvent): void => {
  settings.env = String(event.detail || "prod");
};
const onNotifyUpdate = (event: CustomEvent): void => {
  settings.notify = Boolean(event.detail);
};
const onRemarkUpdate = (event: CustomEvent): void => {
  settings.remark = String(event.detail || "");
};

const code = `<elf-form :model.prop=\${settings} label-position="right" label-width="96px" :disabled=\${disabled.value}>
  <elf-form-item label="Environment">
    <elf-select :modelValue=\${settings.env} @update:modelValue=\${onEnvUpdate} />
  </elf-form-item>
</elf-form>`;

const script = `const disabled = useRef(false);
const settings = useReactive({
  env: "prod",
  notify: true,
  remark: "Production changes require approval"
});

const toggle = () => disabled.set(!disabled.value);
const onEnvUpdate = (event) => {
  settings.env = event.detail;
};`;

defineStyle(demoStyles);

const PageFormEx4 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-button slot="status" size="sm" @click=${toggle}
      >${disabled.value ? t("enable") : t("disable")}</elf-button
    >
    <elf-card
      class="form-demo-card"
      variant="outlined"
      :title=${t("cardTitle")}
      :subtitle=${t("cardSubtitle")}
    >
      <elf-form
        :model.prop=${settings}
        label-position="right"
        label-width="96px"
        :disabled=${disabled.value}
      >
        <elf-form-item :label=${t("environment")}>
          <elf-select :modelValue=${settings.env} :options.prop=${envOptions()} @update:modelValue=${onEnvUpdate}></elf-select>
        </elf-form-item>
        <elf-form-item :label=${t("notification")}>
          <elf-switch :modelValue=${settings.notify} @update:modelValue=${onNotifyUpdate}></elf-switch>
        </elf-form-item>
        <elf-form-item :label=${t("remark")}>
          <elf-textarea :modelValue=${settings.remark} @update:modelValue=${onRemarkUpdate} rows="3"></elf-textarea>
        </elf-form-item>
      </elf-form>
    </elf-card>
  </elf-playground>
`);

export { PageFormEx4 };
