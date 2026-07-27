import { defineHtml, defineStyle, useRef } from "@elfui/core";

const content = useRef("请 @");
const variant = useRef("filled");
const placement = useRef("bottom");
const flags = useRef<string[]>([]);

const members = [
  { label: "林舟", value: "linzhou" },
  { label: "周然", value: "zhouran" },
  { label: "许宁", value: "xuning" }
];

const variantOptions = [
  { label: "填充", value: "filled" },
  { label: "描边", value: "outlined" },
  { label: "下划线", value: "underlined" },
  { label: "独立表面", value: "solo" }
];
const placementOptions = [
  { label: "下方", value: "bottom" },
  { label: "上方", value: "top" }
];
const flagOptions = [{ label: "整词触发", value: "whole" }];
const hasFlag = (name: string): boolean => flags.value.includes(name);

const code1 = (): string => `<elf-mention
  :options.prop=\${members}
  :modelValue.prop=\${content}
  variant="${variant.value}"
  placement="${placement.value}"
  label="提及成员"
  :whole="${hasFlag("whole")}"
  placeholder="输入 @ 选择成员"
  @update:modelValue=\${onContentUpdate}
  @select=\${onSelect}
/>`;

const script1 = `const content = useRef("请 @");

const members = [
  { label: "林舟", value: "linzhou" },
  { label: "周然", value: "zhouran" },
  { label: "许宁", value: "xuning" }
];`;

const onContentUpdate = (event: CustomEvent): void => {
  content.set(String(event.detail || ""));
};

const onSelect = (): void => undefined;
const eventValue = (event: CustomEvent): unknown => Array.isArray(event.detail) ? event.detail[0] : event.detail;
const onVariant = (event: CustomEvent): void => variant.set(String(eventValue(event) || "filled"));
const onPlacement = (event: CustomEvent): void => placement.set(String(eventValue(event) || "bottom"));
const onFlags = (event: CustomEvent): void => flags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);

defineStyle(`
  .mention-preview { display:grid; width:100%; place-items:center; }
  .mention-preview elf-mention { width:min(420px,100%); }
  .mention-controls { display:grid; align-content:start; gap:16px; }
  .mention-controls label { display:grid; gap:6px; color:var(--elf-text-secondary); font-size:12px; }
`);

const PageMentionEx1 = defineHtml(`
<h2>综合用法</h2>
<elf-playground title="提及操作台" :code=${code1()} :script=${script1}>
      <span slot="status" class="demo-state">当前：${content.value}</span>
      <div class="mention-preview">
      <elf-mention
        :options.prop=${members}
        :modelValue.prop=${content}
        :variant.prop=${variant.value}
        :placement.prop=${placement.value}
        label="提及成员"
        :whole.prop=${hasFlag("whole")}
        placeholder="输入 @ 选择成员"
        @update:modelValue=${onContentUpdate}
        @select=${onSelect}
      ></elf-mention>
      </div>
      <aside slot="controls" class="mention-controls" aria-label="提及配置">
        <strong>提及配置</strong>
        <label><span>外观</span><elf-select :options.prop=${variantOptions} :modelValue.prop=${variant.value} @update:modelValue=${onVariant}></elf-select></label>
        <label><span>面板位置</span><elf-select :options.prop=${placementOptions} :modelValue.prop=${placement.value} @update:modelValue=${onPlacement}></elf-select></label>
        <elf-checkbox-group :options.prop=${flagOptions} :modelValue.prop=${flags.value} @update:modelValue=${onFlags}></elf-checkbox-group>
      </aside>
    </elf-playground>
`);

export { PageMentionEx1 };
