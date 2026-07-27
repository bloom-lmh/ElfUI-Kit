import { defineHtml, useRef } from "@elfui/core";

const keyboardContent = useRef("@");

const members = [
  { label: "林舟", value: "linzhou" },
  { label: "周然", value: "zhouran" },
  { label: "许宁", value: "xuning" }
];

const code3 = `<elf-mention
  :modelValue.prop=\${keyboardContent}
  :options.prop=\${members}
  variant="outlined"
  aria-label="使用键盘选择成员"
  @update:modelValue=\${onKeyboardUpdate}
/>`;

const script3 = `const keyboardContent = useRef("@");

const members = [
  { label: "林舟", value: "linzhou" },
  { label: "周然", value: "zhouran" },
  { label: "许宁", value: "xuning" }
];

const onKeyboardUpdate = (event) => {
  keyboardContent.set(event.detail);
};`;

const onKeyboardUpdate = (event: CustomEvent): void => {
  keyboardContent.set(String(event.detail || ""));
};

const PageMentionEx3 = defineHtml(`
<elf-playground title="键盘选择" :code=${code3} :script=${script3}>
      <div style="display:grid;gap:10px;max-width:480px">
        <elf-mention
          :modelValue.prop=${keyboardContent}
          :options.prop=${members}
          variant="outlined"
          aria-label="使用键盘选择成员"
          @update:modelValue=${onKeyboardUpdate}
        ></elf-mention>
        <span slot="status" class="demo-state">输入 @ 后，使用 ↑ / ↓ 切换候选项，按 Enter 确认。</span>
      </div>
    </elf-playground>
`);

export { PageMentionEx3 };
