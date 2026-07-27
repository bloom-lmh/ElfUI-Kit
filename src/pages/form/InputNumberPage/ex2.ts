import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const amount = useRef(12.5);
const controlVariant = useRef("default");
const flags = useRef<string[]>([]);
const t = createDocsTranslator({
  heading: { zh: "控制器外观", en: "Control variants" },
  title: { zh: "数字输入操作台", en: "Number input playground" },
  controls: { zh: "控制器配置", en: "Control configuration" },
  variant: { zh: "控制器外观", en: "Control variant" },
  default: { zh: "默认", en: "Default" },
  stacked: { zh: "堆叠", en: "Stacked" },
  split: { zh: "分离", en: "Split" },
  hidden: { zh: "隐藏", en: "Hidden" },
  reverse: { zh: "反向", en: "Reverse" },
  inset: { zh: "内缩分隔线", en: "Inset dividers" },
  hideInput: { zh: "隐藏输入值", en: "Hide input" },
  price: { zh: "价格", en: "Price" }
});

const variants = () => (["default", "stacked", "split", "hidden"] as const)
  .map((value) => ({ label: t(value), value }));
const flagOptions = () => [
  { label: t("reverse"), value: "reverse" },
  { label: t("inset"), value: "inset" },
  { label: t("hideInput"), value: "hide-input" }
];
const onAmount = (event: CustomEvent): void => amount.set(Number(event.detail ?? 0));
const onVariant = (event: CustomEvent): void => controlVariant.set(String(Array.isArray(event.detail) ? event.detail[0] : event.detail));
const onFlags = (event: CustomEvent): void => flags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);
const flag = (value: string): boolean => flags.value.includes(value);
const code = (): string => `<elf-input-number
  variant="outlined"
  control-variant="${controlVariant.value}"
  label="Price"
  :modelValue.prop=${amount}
  :step="0.5"
  :precision="2"
/>`;
const script = `const amount = useRef(12.5);
const controlVariant = useRef("default");`;

defineStyle(`
  .number-preview { display:grid; width:100%; place-items:center; }
  .number-controls { display:grid; align-content:start; gap:16px; height:100%; }
  .number-controls label { display:grid; gap:6px; color:var(--elf-text-secondary); font-size:12px; }
`);

const PageInputNumberEx2 = defineHtml(`
  <h2>${t("heading")}</h2>
  <elf-playground :title=${t("title")} :code=${code()} :script=${script}>
    <div class="number-preview">
      <elf-input-number
        variant="outlined"
        :label=${t("price")}
        :controlVariant.prop=${controlVariant.value}
        :reverse.prop=${flag("reverse")}
        :inset.prop=${flag("inset")}
        :hideInput.prop=${flag("hide-input")}
        :modelValue.prop=${amount.value}
        :step=${0.5}
        :precision=${2}
        @update:modelValue=${onAmount}
      ></elf-input-number>
    </div>
    <aside slot="controls" class="number-controls" :aria-label=${t("controls")}>
      <strong>${t("controls")}</strong>
      <label><span>${t("variant")}</span><elf-select :options.prop=${variants()} :modelValue.prop=${controlVariant.value} @update:modelValue=${onVariant}></elf-select></label>
      <elf-checkbox-group :options.prop=${flagOptions()} :modelValue.prop=${flags.value} @update:modelValue=${onFlags}></elf-checkbox-group>
    </aside>
  </elf-playground>
`);

export { PageInputNumberEx2 };
