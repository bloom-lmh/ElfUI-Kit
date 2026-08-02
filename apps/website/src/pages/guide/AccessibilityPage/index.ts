import { defineHtml, defineStyle, useComponents } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { PageAccessibilityEx1 } from "./ex1";
import { PageAccessibilityEx2 } from "./ex2";
import pageStyles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "无障碍", en: "Accessibility" },
  description: {
    zh: "无障碍不是独立皮肤，而是组件契约与应用内容共同承担的质量边界。ElfUI 负责键盘、焦点、状态语义和弱化动效；应用负责标题结构、内容标签与业务错误说明。",
    en: "Accessibility is not a separate skin. It is a shared quality boundary between component contracts and application content. ElfUI owns keyboard behavior, focus, state semantics, and reduced motion; applications own heading structure, content labels, and business error messages.",
  },
  boundary: { zh: "能力边界", en: "Capability boundaries" },
  contract: { zh: "无障碍契约", en: "Accessibility contract" },
});
const pick = createDocsPicker();

const contractRows = [
  {
    name: "Keyboard",
    type: "component contract",
    default: "supported",
    desc: pick(
      "组件交互提供可预测的 Tab、方向键、Enter 与 Escape 行为",
      "Component interactions provide predictable Tab, arrow key, Enter, and Escape behavior.",
    ),
  },
  {
    name: "Focus",
    type: "component contract",
    default: "supported",
    desc: pick(
      "浮层关闭前归还焦点，不对仍持有焦点的节点设置 aria-hidden",
      "Overlays restore focus when closing and never apply aria-hidden to a node that still contains focus.",
    ),
  },
  {
    name: "ARIA",
    type: "component + application",
    default: "supported",
    desc: pick(
      "组件提供角色与状态；业务内容仍需补充可读标签和错误说明",
      "Components provide roles and states; applications still supply readable labels and error descriptions.",
    ),
  },
  {
    name: "Motion",
    type: "ConfigProvider",
    default: "system",
    desc: pick(
      "通过 motion 统一选择 system、full 或 reduced",
      "Use motion to select system, full, or reduced behavior consistently.",
    ),
  },
  {
    name: "Hotkeys",
    type: "application pattern",
    default: "native",
    desc: pick(
      "当前使用 onMounted 注册并清理；公共快捷键服务列入后续增强",
      "Register and clean up shortcuts with onMounted; a shared hotkey service remains a future enhancement.",
    ),
  },
];

useComponents({
  "page-accessibility-ex1": PageAccessibilityEx1,
  "page-accessibility-ex2": PageAccessibilityEx2,
});

defineStyle(pageStyles);

const PageAccessibility = defineHtml(`
  <elf-container class="accessibility-page">
    <elf-docs-hero
      category="guide"
      tag="Guide"
      :title=${t("title")}
      :description=${t("description")}
    ></elf-docs-hero>

    <page-accessibility-ex1 />
    <page-accessibility-ex2 />

    <h2>${t("boundary")}</h2>
    <elf-props-table :title=${t("contract")} :rows=${contractRows} />
  </elf-container>
`);

export { PageAccessibility };
