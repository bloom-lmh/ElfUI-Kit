import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "手动提交上传", en: "Manual upload submission" },
  idle: { zh: "等待选择待上传文件", en: "Waiting for files" },
  pending: { zh: "待上传文件", en: "Files ready to upload" },
  complete: { zh: "上传完成", en: "Upload complete" },
  button: { zh: "选择待上传文件", en: "Choose files" },
  tip: {
    zh: "选择文件后使用组件内置的开始上传命令。",
    en: "Choose files, then use the built-in start-upload command.",
  },
});

const manualLog = useRef(t("idle"));

const manualFiles = useRef<unknown[]>([]);

const manualCode = (): string => `<elf-upload
  :modelValue=\${manualFiles}
  :auto-upload=\${false}
  button-text="${t("button")}"
  @update:modelValue=\${onManualUpdate}
  @success=\${onManualSuccess}
/>`;

const manualScript = (): string => `const manualFiles = useRef([]);
const manualLog = useRef("${t("idle")}");

const onManualUpdate = (event) => {
  const next = event.detail ?? [];
  manualFiles.set(next);
  manualLog.set(next.length ? \`${t("pending")}: \${next.length}\` : "${t("idle")}");
};

const onManualSuccess = (event) => {
  const [, file] = event.detail;
  manualLog.set(\`\${file.name}: ${t("complete")}\`);
};`;

const onManualUpdate = (event: CustomEvent): void => {
  const next = (event.detail ?? []) as unknown[];
  manualFiles.set(next);
  manualLog.set(next.length ? `${t("pending")}: ${next.length}` : t("idle"));
};

const onManualSuccess = (event: CustomEvent): void => {
  const [, file] = event.detail as [unknown, { name: string }];
  manualLog.set(`${file.name}: ${t("complete")}`);
};

defineStyle(styles);

const PageUploadEx4 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${manualCode()} :script=${manualScript()}>
    <span slot="status" role="status" aria-live="polite">${manualLog.value}</span>
    <div class="upload-demo-stage">
      <elf-upload
        :modelValue.prop=${manualFiles.value}
        :autoUpload=${false}
        :buttonText.prop=${t("button")}
        :tip=${t("tip")}
        @update:modelValue=${onManualUpdate}
        @success=${onManualSuccess}
      ></elf-upload>
    </div>
  </elf-playground>
`);

export { PageUploadEx4 };
