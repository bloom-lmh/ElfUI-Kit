import { defineHtml, useRef } from "@elfui/core";

const biography = useRef("ElfUI 让 Web Components 保持简洁。 ");

const normalizeLineEndings = (value: string): string => value.replace(/\r\n/g, "\n");

const displayLineBreaks = (value: string): string => value.replace(/\n/g, " ↵ ");

const onBiographyUpdate = (event: CustomEvent): void => {
  biography.set(String(event.detail ?? ""));
};

const code = `<elf-textarea
  :modelValue.prop=\${biography.value}
  :modelModifiers.prop=\${{ trim: true }}
  :formatter.prop=\${displayLineBreaks}
  :parser.prop=\${normalizeLineEndings}
  clearable
  show-word-limit
  word-limit-position="outside"
  maxlength="120"
  aria-label="组件库简介"
  @update:modelValue=\${onBiographyUpdate}
>
  <span slot="prefix">简介</span>
  <span slot="suffix">Markdown</span>
</elf-textarea>
<span slot="status">模型值：{{ biography || '空' }}</span>`;

const script = `const biography = useRef("ElfUI 让 Web Components 保持简洁。 ");

const normalizeLineEndings = (value) => value.replace(/\\r\\n/g, "\\n");
const displayLineBreaks = (value) => value.replace(/\\n/g, " ↵ ");

const onBiographyUpdate = (event) => {
  biography.set(String(event.detail ?? ""));
};`;

const PageTextareaEx3 = defineHtml(`
  <h2>格式化、清空与插槽</h2>
  <elf-playground title="受控高级文本域" :code=${code} :script=${script}>
    <div style="width:100%;max-width:560px">
      <elf-textarea
        :modelValue.prop=${biography.value}
        :modelModifiers.prop=${{ trim: true }}
        :formatter.prop=${displayLineBreaks}
        :parser.prop=${normalizeLineEndings}
        clearable
        show-word-limit
        word-limit-position="outside"
        maxlength="120"
        aria-label="组件库简介"
        @update:modelValue=${onBiographyUpdate}
      >
        <span slot="prefix">简介</span>
        <span slot="suffix">Markdown</span>
      </elf-textarea>
    </div>
    <span slot="status" class="demo-state">模型值：{{ biography || '空' }}</span>
  </elf-playground>
`);

export { PageTextareaEx3 };
