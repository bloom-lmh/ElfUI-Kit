import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./ex6.scss?inline";

const t = createDocsTranslator({
  title: { zh: "字段值语义", en: "Field value semantics" },
  clearResult: { zh: "清空结果", en: "Clear result" },
  clearTitle: { zh: "全局清空值", en: "Global clear value" },
  clearHelp: {
    zh: "清空后统一写入 null，局部 value-on-clear 仍可覆盖。",
    en: "Clearing writes null consistently; a local value-on-clear still takes priority.",
  },
  emptyTitle: { zh: "自定义空值", en: "Custom empty sentinel" },
  emptyHelp: {
    zh: "数值 0 被配置为空值，因此显示占位文案而不是选项标签。",
    en: "Zero is configured as empty, so the placeholder is shown instead of an option label.",
  },
  selectStatus: { zh: "选择状态", en: "Select a status" },
  unassigned: { zh: "未分配", en: "Unassigned" },
  draft: { zh: "草稿", en: "Draft" },
  published: { zh: "已发布", en: "Published" },
  localPriority: {
    zh: "组件属性优先于全局字段值语义。",
    en: "Component props take priority over the global field-value semantics.",
  },
});

const clearedValue = useRef<unknown>("draft");

const config = {
  field: {
    emptyValues: [undefined, null, "", 0],
    valueOnClear: null,
  },
};

const options = () => [
  { value: 0, label: t("unassigned") },
  { value: "draft", label: t("draft") },
  { value: "published", label: t("published") },
];

const formatValue = (value: unknown): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  return JSON.stringify(value);
};

const onClearValueUpdate = (event: CustomEvent<unknown>): void => {
  clearedValue.set(event.detail);
};

const code = () => `<elf-config-provider :config.prop="config">
  <elf-select
    clearable
    :options.prop="options"
    :model-value.prop="status"
    @update:model-value="status.set($event.detail)"
  />
  <elf-select
    :options.prop="options"
    :model-value.prop="emptyCandidate"
    placeholder="${t("selectStatus")}"
  />
</elf-config-provider>`;

const script = () => `import { useRef } from "@elfui/core";
import { defineElfUIConfig } from "@elfui/kit";

const config = defineElfUIConfig({
  field: {
    emptyValues: [undefined, null, "", 0],
    valueOnClear: null
  }
});

const status = useRef("draft");
const emptyCandidate = 0;
const options = [
  { value: 0, label: "${t("unassigned")}" },
  { value: "draft", label: "${t("draft")}" },
  { value: "published", label: "${t("published")}" }
];

// ${t("localPriority")}`;

defineStyle(styles);

const PageConfigProviderEx6 = defineHtml(`
  <elf-playground
    :title=${t("title")}
    :code=${code()}
    :script=${script()}
  >
    <span class="demo-state">
      ${t("clearResult")}: ${formatValue(clearedValue.value)}
    </span>

    <elf-config-provider :config.prop=${config}>
      <div class="field-defaults-demo">
        <section class="field-defaults-card">
          <strong>${t("clearTitle")}</strong>
          <small>${t("clearHelp")}</small>
          <elf-select
            clearable
            :options.prop=${options()}
            :modelValue.prop=${clearedValue.value}
            @update:modelValue=${onClearValueUpdate}
          ></elf-select>
        </section>

        <section class="field-defaults-card">
          <strong>${t("emptyTitle")}</strong>
          <small>${t("emptyHelp")}</small>
          <elf-select
            :options.prop=${options()}
            :modelValue.prop=${0}
            :placeholder=${t("selectStatus")}
          ></elf-select>
        </section>
      </div>
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx6 };
