import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const content = useRef(p("请 @", "Please @"));
const variant = useRef("filled");
const placement = useRef("bottom");
const flags = useRef<string[]>([]);

const members = [
  { label: p("林舟", "Lin Zhou"), value: "linzhou" },
  { label: p("周然", "Zhou Ran"), value: "zhouran" },
  { label: p("许宁", "Xu Ning"), value: "xuning" },
];

const variantOptions = [
  { label: p("填充", "Filled"), value: "filled" },
  { label: p("描边", "Outlined"), value: "outlined" },
  { label: p("下划线", "Underlined"), value: "underlined" },
  { label: p("独立表面", "Solo"), value: "solo" },
];
const placementOptions = [
  { label: p("下方", "Bottom"), value: "bottom" },
  { label: p("上方", "Top"), value: "top" },
];
const flagOptions = [{ label: p("整词触发", "Whole-word trigger"), value: "whole" }];
const hasFlag = (name: string): boolean => flags.value.includes(name);

const code1 = (): string => `<elf-mention
  :options.prop=\${members}
  :modelValue.prop=\${content}
  variant="${variant.value}"
  placement="${placement.value}"
  label="${p("提及成员", "Mention members")}"
  :whole="${hasFlag("whole")}"
  placeholder="${p("输入 @ 选择成员", "Type @ to select a member")}"
  @update:modelValue=\${onContentUpdate}
  @select=\${onSelect}
/>`;

const script1 = `const content = useRef("${p("请 @", "Please @")}");

const members = [
  { label: "${p("林舟", "Lin Zhou")}", value: "linzhou" },
  { label: "${p("周然", "Zhou Ran")}", value: "zhouran" },
  { label: "${p("许宁", "Xu Ning")}", value: "xuning" }
];`;

const onContentUpdate = (event: CustomEvent): void => {
  content.set(String(event.detail || ""));
};

const onSelect = (): void => undefined;
const eventValue = (event: CustomEvent): unknown =>
  Array.isArray(event.detail) ? event.detail[0] : event.detail;
const onVariant = (event: CustomEvent): void => variant.set(String(eventValue(event) || "filled"));
const onPlacement = (event: CustomEvent): void =>
  placement.set(String(eventValue(event) || "bottom"));
const onFlags = (event: CustomEvent): void =>
  flags.set(Array.isArray(event.detail) ? event.detail.map(String) : []);

defineStyle(`
  .mention-preview { display:grid; width:100%; place-items:center; }
  .mention-preview elf-mention { width:min(420px,100%); }
  .mention-controls { display:grid; align-content:start; gap:16px; }
  .mention-controls label { display:grid; gap:6px; color:var(--elf-text-secondary); font-size:12px; }
`);

const PageMentionEx1 = defineHtml(`
<h2>${p("提及操作台", "Mention playground")}</h2>
<elf-playground :title=${p("提及操作台", "Mention playground")} :code=${code1()} :script=${script1}>
      <span slot="status" class="demo-state">${p("当前内容", "Current content")}: ${content.value}</span>
      <div class="mention-preview">
      <elf-mention
        :options.prop=${members}
        :modelValue.prop=${content}
        :variant.prop=${variant.value}
        :placement.prop=${placement.value}
        :label=${p("提及成员", "Mention members")}
        :whole.prop=${hasFlag("whole")}
        :placeholder=${p("输入 @ 选择成员", "Type @ to select a member")}
        @update:modelValue=${onContentUpdate}
        @select=${onSelect}
      ></elf-mention>
      </div>
      <aside slot="controls" class="mention-controls" :aria-label=${p("提及配置", "Mention controls")}>
        <strong>${p("提及配置", "Mention controls")}</strong>
        <label><elf-select :label=${p("外观", "Variant")} :options.prop=${variantOptions} :modelValue.prop=${variant.value} @update:modelValue=${onVariant}></elf-select></label>
        <label><elf-select :label=${p("面板位置", "Panel placement")} :options.prop=${placementOptions} :modelValue.prop=${placement.value} @update:modelValue=${onPlacement}></elf-select></label>
        <elf-checkbox-group :options.prop=${flagOptions} :modelValue.prop=${flags.value} @update:modelValue=${onFlags}></elf-checkbox-group>
      </aside>
    </elf-playground>
`);

export { PageMentionEx1 };
