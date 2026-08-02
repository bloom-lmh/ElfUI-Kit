import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "基础多文件上传", en: "Basic multiple-file upload" },
  idle: { zh: "等待选择文件", en: "Waiting for files" },
  empty: { zh: "文件列表为空", en: "The file list is empty" },
  selected: { zh: "已选择", en: "Selected" },
  files: { zh: "个文件", en: "files" },
  button: { zh: "选择文件", en: "Choose files" },
  tip: {
    zh: "最多选择 3 个文件，示例使用模拟上传。",
    en: "Choose up to 3 files. This demo uses a simulated upload.",
  },
});

const basicLog = useRef(t("idle"));

const basicCode = (): string => `<elf-upload
  multiple
  :limit=\${3}
  button-text="${t("button")}"
  tip="${t("tip")}"
  @change=\${onBasicChange}
/>`;

const basicScript = (): string => `const basicLog = useRef("${t("idle")}");

const onBasicChange = (event) => {
  const files = event.detail || [];
  const names = files.map((file) => file.name).join("${t("files") === "files" ? ", " : "、"}");
  basicLog.set(files.length ? \`${t("selected")} \${files.length} ${t("files")}: \${names}\` : "${t("empty")}");
};`;

const fileNames = (files: Array<{ name: string }>): string =>
  files.map((file) => file.name).join("，");

const onBasicChange = (event: CustomEvent): void => {
  const files = event.detail as Array<{ name: string }>;
  basicLog.set(
    files.length
      ? `${t("selected")} ${files.length} ${t("files")}: ${fileNames(files)}`
      : t("empty"),
  );
};

defineStyle(styles);

const PageUploadEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${basicCode()} :script=${basicScript()}>
    <span slot="status" role="status" aria-live="polite">${basicLog.value}</span>
    <div class="upload-demo-stage">
      <elf-upload
        multiple
        :limit=${3}
        :buttonText.prop=${t("button")}
        :tip=${t("tip")}
        @change=${onBasicChange}
      ></elf-upload>
    </div>
  </elf-playground>
`);

export { PageUploadEx1 };
