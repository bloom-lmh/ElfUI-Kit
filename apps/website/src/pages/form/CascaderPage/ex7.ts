import { defineHtml, useRef } from "@elfui/core";

import type { CascaderOption } from "@elfui/kit";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "多选标签与视口浮层", en: "Tags and viewport overlay" },
  keyboard: {
    zh: "↑↓ 同列移动 · → 进入子级 · ← 返回父级 · Enter 选择",
    en: "↑↓ Move · → Enter child · ← Return · Enter Select",
  },
  placeholder: { zh: "选择负责团队", en: "Choose owner teams" },
  heading: { zh: "选择负责团队", en: "Choose owner teams" },
  footer: { zh: "支持键盘方向键浏览", en: "Keyboard navigation is supported" },
});
const modelValue = useRef<unknown[]>([
  ["engineering", "frontend"],
  ["engineering", "quality"],
]);
const options: CascaderOption[] = [
  {
    label: pick("研发中心", "Engineering"),
    value: "engineering",
    children: [
      { label: pick("前端平台", "Frontend platform"), value: "frontend" },
      { label: pick("质量保障", "Quality assurance"), value: "quality" },
      { label: pick("基础架构", "Infrastructure"), value: "infrastructure" },
    ],
  },
  {
    label: pick("产品中心", "Product"),
    value: "product",
    children: [
      { label: pick("设计系统", "Design system"), value: "design" },
      { label: pick("增长产品", "Growth"), value: "growth" },
    ],
  },
];
const popperOptions = {
  modifiers: [
    { name: "offset", options: { offset: [0, 0] } },
    { name: "flip", enabled: true },
    { name: "preventOverflow", options: { padding: 12 } },
  ],
};
const onUpdate = (event: CustomEvent): void => modelValue.set(event.detail as unknown[]);
const code = `<elf-cascader multiple collapse-tags collapse-tags-tooltip teleported fit-input-width
  :modelValue="value" :options.prop="options" :popperOptions.prop="popperOptions"
  @update:modelValue="onUpdate" />`;
const script = `const value = useRef([["engineering", "frontend"], ["engineering", "quality"]]);
const options = [{ label: "Engineering", value: "engineering", children: [
  { label: "Frontend platform", value: "frontend" },
  { label: "Quality assurance", value: "quality" }
]}];
const onUpdate = (event) => value.set(event.detail);`;

const PageCascaderEx7 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("keyboard")}</span>
    <div style="width:min(100%,560px);height:126px;overflow:hidden;transform:translateZ(0);border:1px dashed var(--elf-border);border-radius:8px;padding:18px;box-sizing:border-box;display:flex;align-items:flex-end">
      <elf-cascader :modelValue=${modelValue} :options.prop=${options} :popperOptions.prop=${popperOptions}
        multiple clearable collapse-tags collapse-tags-tooltip teleported fit-input-width
        :placeholder=${t("placeholder")} @update:modelValue=${onUpdate}>
        <span slot="prefix" aria-hidden="true">⌘</span>
        <strong slot="header" style="display:block;padding:10px 12px;border-bottom:1px solid var(--elf-divider)">${t("heading")}</strong>
        <small slot="footer" style="display:block;padding:8px 12px;border-top:1px solid var(--elf-divider);color:var(--elf-text-secondary)">${t("footer")}</small>
      </elf-cascader>
    </div>
  </elf-playground>
`);

export { PageCascaderEx7 };
