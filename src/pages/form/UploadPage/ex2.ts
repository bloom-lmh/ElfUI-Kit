import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "拖拽图片卡片", en: "Drag-and-drop picture cards" },
  idle: { zh: "等待拖入或选择图片", en: "Drop or choose an image" },
  selected: { zh: "已加入图片", en: "Images added" },
  button: { zh: "上传图片", en: "Upload images" },
  tip: { zh: "支持拖拽图片，也可以点击选择。", en: "Drop images here or click to choose them." },
});

const dragStatus = useRef(t("idle"));
const onChange = (event: CustomEvent<unknown[]>): void => {
  dragStatus.set(`${t("selected")}: ${event.detail?.length ?? 0}`);
};
const dragCode = (): string => `<elf-upload
  drag
  accept="image/*"
  list-type="picture-card"
  button-text="${t("button")}"
  @change=\${onChange}
/>`;
const dragScript = (): string => `const dragStatus = useRef("${t("idle")}");
const onChange = (event) => dragStatus.set(\`${t("selected")}: \${event.detail?.length ?? 0}\`);`;

defineStyle(styles);

const PageUploadEx2 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${dragCode()} :script=${dragScript()}>
    <span slot="status" role="status" aria-live="polite">${dragStatus.value}</span>
    <div class="upload-demo-stage">
      <elf-upload
        drag
        accept="image/*"
        list-type="picture-card"
        :buttonText.prop=${t("button")}
        :tip=${t("tip")}
        @change=${onChange}
      ></elf-upload>
    </div>
  </elf-playground>
`);

export { PageUploadEx2 };
