import { defineHtml, defineStyle, useRef } from "@elfui/core";

const keyword = useRef("");
const variant = useRef("filled");
const flags = useRef<string[]>(["clearable", "trigger"]);

const suggestions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Solid", value: "Solid" },
  { label: "ElfUI", value: "ElfUI" },
  { label: "禁用项", value: "disabled", disabled: true }
];

const variantOptions = [
  { label: "填充", value: "filled" },
  { label: "描边", value: "outlined" },
  { label: "下划线", value: "underlined" },
  { label: "独立表面", value: "solo" }
];
const flagOptions = [
  { label: "允许清空", value: "clearable" },
  { label: "聚焦触发", value: "trigger" },
  { label: "高亮首项", value: "highlight" }
];
const hasFlag = (name: string): boolean => flags.value.includes(name);

const code1 = (): string => `<elf-autocomplete
  :options.prop=\${suggestions}
  :modelValue.prop=\${keyword}
  variant="${variant.value}"
  label="前端框架"
  :clearable="${hasFlag("clearable")}"
  :trigger-on-focus="${hasFlag("trigger")}"
  :highlight-first-item="${hasFlag("highlight")}"
  placeholder="输入框架名"
  @update:modelValue=\${onKeywordUpdate}
  @select=\${onSelect}
/>`;

const script1 = `const keyword = useRef("");

const suggestions = [
  { label: "Vue", value: "Vue" },
  { label: "React", value: "React" },
  { label: "Solid", value: "Solid" },
  { label: "ElfUI", value: "ElfUI" },
  { label: "禁用项", value: "disabled", disabled: true }
];

const onKeywordUpdate = (event) => {
  keyword.set(event.detail);
};`;

const onKeywordUpdate = (event: CustomEvent): void => {
  keyword.set(String(event.detail || ""));
};

const onSelect = (): void => undefined;
const eventValue = (event: CustomEvent): unknown => Array.isArray(event.detail) ? event.detail[0] : event.detail;
const onVariant = (event: CustomEvent): void => variant.set(String(eventValue(event) || "filled"));
const onFlags = (event: CustomEvent): void => flags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);

defineStyle(`
  .autocomplete-preview { display:grid; width:100%; place-items:center; }
  .autocomplete-preview elf-autocomplete { width:min(360px,100%); }
  .autocomplete-controls { display:grid; align-content:start; gap:16px; }
  .autocomplete-controls label { display:grid; gap:6px; color:var(--elf-text-secondary); font-size:12px; }
`);

const PageAutocompleteEx1 = defineHtml(`
<h2>基础</h2>
<elf-playground title="综合操作台" :code=${code1()} :script=${script1}>
      <span slot="status" class="demo-state">当前：${keyword.value || "未选择"}</span>
      <div class="autocomplete-preview">
      <elf-autocomplete
        :options.prop=${suggestions}
        :modelValue.prop=${keyword}
        :variant.prop=${variant.value}
        label="前端框架"
        :clearable.prop=${hasFlag("clearable")}
        :triggerOnFocus.prop=${hasFlag("trigger")}
        :highlightFirstItem.prop=${hasFlag("highlight")}
        placeholder="输入框架名"
        @update:modelValue=${onKeywordUpdate}
        @select=${onSelect}
      ></elf-autocomplete>
      </div>
      <aside slot="controls" class="autocomplete-controls" aria-label="自动补全配置">
        <strong>自动补全配置</strong>
        <label><span>外观</span><elf-select :options.prop=${variantOptions} :modelValue.prop=${variant.value} @update:modelValue=${onVariant}></elf-select></label>
        <elf-checkbox-group :options.prop=${flagOptions} :modelValue.prop=${flags.value} @update:modelValue=${onFlags}></elf-checkbox-group>
      </aside>
    </elf-playground>
`);

export { PageAutocompleteEx1 };
