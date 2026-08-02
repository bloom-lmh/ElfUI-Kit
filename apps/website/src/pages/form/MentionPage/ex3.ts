import { defineHtml, useRef } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const p = createDocsPicker();
const keyboardContent = useRef("@");

const members = [
  { label: p("林舟", "Lin Zhou"), value: "linzhou" },
  { label: p("周然", "Zhou Ran"), value: "zhouran" },
  { label: p("许宁", "Xu Ning"), value: "xuning" },
];

const code3 = `<elf-mention
  :modelValue.prop=\${keyboardContent}
  :options.prop=\${members}
  variant="outlined"
  aria-label="${p("使用键盘选择成员", "Select a member with the keyboard")}"
  @update:modelValue=\${onKeyboardUpdate}
/>`;

const script3 = `const keyboardContent = useRef("@");

const members = [
  { label: "${p("林舟", "Lin Zhou")}", value: "linzhou" },
  { label: "${p("周然", "Zhou Ran")}", value: "zhouran" },
  { label: "${p("许宁", "Xu Ning")}", value: "xuning" }
];

const onKeyboardUpdate = (event) => {
  keyboardContent.set(event.detail);
};`;

const onKeyboardUpdate = (event: CustomEvent): void => {
  keyboardContent.set(String(event.detail || ""));
};

const PageMentionEx3 = defineHtml(`
<elf-playground :title=${p("键盘选择", "Keyboard selection")} :code=${code3} :script=${script3}>
      <div style="display:grid;gap:10px;max-width:480px">
        <elf-mention
          :modelValue.prop=${keyboardContent}
          :options.prop=${members}
          variant="outlined"
          :aria-label=${p("使用键盘选择成员", "Select a member with the keyboard")}
          @update:modelValue=${onKeyboardUpdate}
        ></elf-mention>
        <span slot="status" class="demo-state">${p("输入 @ 后，使用 ↑ / ↓ 切换候选项，按 Enter 确认。", "Type @, use ↑ / ↓ to move through suggestions, then press Enter to select.")}</span>
      </div>
    </elf-playground>
`);

export { PageMentionEx3 };
