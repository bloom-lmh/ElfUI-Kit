import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { SelectOption, SelectValue } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";

const selected = useRef<SelectValue>(2048);

const t = createDocsTranslator({
  title: { zh: "虚拟化", en: "Virtualized options" },
  selected: { zh: "当前编号", en: "Selected ID" },
  total: { zh: "10,000 项", en: "10,000 items" },
  label: { zh: "数据记录", en: "Dataset record" },
  placeholder: { zh: "选择一条数据", en: "Choose a record" },
  hint: {
    zh: "10,000 项数据只渲染当前视口与少量缓冲项，键盘导航仍会自动保持活动项可见。",
    en: "Only the viewport and a small overscan are rendered for 10,000 options while keyboard navigation keeps the active option visible.",
  },
});

const options = (): SelectOption[] =>
  Array.from({ length: 10_000 }, (_, index) => ({
    value: index + 1,
    label: `${t("label")} ${String(index + 1).padStart(5, "0")}`,
  }));

const onUpdate = (event: CustomEvent<SelectValue>): void => selected.set(event.detail);

const code = `<elf-select
  :options.prop="options"
  :modelValue.prop="selected"
  virtual
  :virtualThreshold="100"
  :itemHeight="40"
  :height="240"
  @update:modelValue="onUpdate"
/>`;

const script = `const selected = useRef(2048);
const options = Array.from({ length: 10_000 }, (_, index) => ({
  value: index + 1,
  label: \`Dataset record \${String(index + 1).padStart(5, "0")}\`,
}));

const onUpdate = (event) => selected.set(event.detail);`;

defineStyle(`
  .virtual-select-demo {
    width: min(620px, 100%);
    padding: 24px;
    border: 1px solid var(--elf-border);
    border-radius: var(--elf-radius-sm);
    background: color-mix(in srgb, var(--elf-bg-paper) 94%, var(--elf-primary) 6%);
  }
  .virtual-select-demo p {
    margin: 0 0 18px;
    color: var(--elf-text-secondary);
    line-height: 1.65;
  }
  .virtual-select-field { width: 100%; }
`);

const PageSelectEx6 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status">${t("total")} · ${t("selected")} ${String(selected.value)}</span>
    <section class="virtual-select-demo">
      <p>${t("hint")}</p>
      <elf-select
        class="virtual-select-field"
        :options.prop=${options()}
        :modelValue.prop=${selected.value}
        :label=${t("label")}
        :placeholder=${t("placeholder")}
        virtual
        :virtualThreshold=${100}
        :itemHeight=${40}
        :height=${240}
        @update:modelValue=${onUpdate}
      ></elf-select>
    </section>
  </elf-playground>
`);

export { PageSelectEx6 };
