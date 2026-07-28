import { defineHtml, defineStyle, useComponents } from "@elfui/core";

import { PageAccessibilityEx1 } from "./ex1";
import { PageAccessibilityEx2 } from "./ex2";
import pageStyles from "./style.scss?inline";

const contractRows = [
  { name: "Keyboard", type: "component contract", default: "supported", desc: "组件交互提供可预测的 Tab、方向键、Enter 与 Escape 行为" },
  { name: "Focus", type: "component contract", default: "supported", desc: "浮层关闭前归还焦点，不对仍持有焦点的节点设置 aria-hidden" },
  { name: "ARIA", type: "component + application", default: "supported", desc: "组件提供角色与状态；业务内容仍需补充可读标签和错误说明" },
  { name: "Motion", type: "ConfigProvider", default: "system", desc: "通过 motion 统一选择 system、full 或 reduced" },
  { name: "Hotkeys", type: "application pattern", default: "native", desc: "当前使用 onMounted 注册并清理；公共快捷键服务列入后续增强" }
];

useComponents({
  "page-accessibility-ex1": PageAccessibilityEx1,
  "page-accessibility-ex2": PageAccessibilityEx2
});

defineStyle(pageStyles);

const PageAccessibility = defineHtml(`
  <elf-container class="accessibility-page">
    <h1>Accessibility 无障碍</h1>
    <p class="page-lead">
      无障碍不是独立皮肤，而是组件契约与应用内容共同承担的质量边界。
      ElfUI 负责键盘、焦点、状态语义和弱化动效；应用负责标题结构、内容标签与业务错误说明。
    </p>

    <page-accessibility-ex1 />
    <page-accessibility-ex2 />

    <h2>能力边界</h2>
    <elf-props-table title="Accessibility contract" :rows=${contractRows} />
  </elf-container>
`);

export { PageAccessibility };
