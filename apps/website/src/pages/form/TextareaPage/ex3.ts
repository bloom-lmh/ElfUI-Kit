import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "格式化、清空与插槽", en: "Formatting, clearing, and slots" },
  playground: { zh: "受控高级文本域", en: "Controlled advanced textarea" },
  initial: {
    zh: "ElfUI 让 Web Components 保持简洁。 ",
    en: "ElfUI keeps Web Components concise. ",
  },
  aria: { zh: "组件库简介", en: "Component library biography" },
  prefix: { zh: "简介", en: "Bio" },
  model: { zh: "模型值", en: "Model value" },
  empty: { zh: "空", en: "Empty" },
});

const biography = useRef(t("initial"));

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
  aria-label="${t("aria")}"
  @update:modelValue=\${onBiographyUpdate}
>
  <span slot="prefix">${t("prefix")}</span>
  <span slot="suffix">Markdown</span>
</elf-textarea>
<span slot="status">${t("model")}: {{ biography || '${t("empty")}' }}</span>`;

const script = `const biography = useRef("${t("initial")}");

const normalizeLineEndings = (value) => value.replace(/\\r\\n/g, "\\n");
const displayLineBreaks = (value) => value.replace(/\\n/g, " ↵ ");

const onBiographyUpdate = (event) => {
  biography.set(String(event.detail ?? ""));
};`;

const PageTextareaEx3 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
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
        :aria-label=${t("aria")}
        @update:modelValue=${onBiographyUpdate}
      >
        <span slot="prefix">${t("prefix")}</span>
        <span slot="suffix">Markdown</span>
      </elf-textarea>
    </div>
    <span slot="status" class="demo-state">${t("model")}: {{ biography || '${t("empty")}' }}</span>
  </elf-playground>
`);

export { PageTextareaEx3 };
