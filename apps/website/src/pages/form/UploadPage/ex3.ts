import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "类型、大小与文件名校验", en: "Type, size, and filename validation" },
  rule: {
    zh: "仅接受 report-*.pdf，且单文件不超过 1 MB",
    en: "Only report-*.pdf files up to 1 MB are accepted",
  },
  tooLarge: { zh: "超过 1 MB，已阻止上传", en: "exceeds 1 MB and was rejected" },
  invalid: { zh: "文件未通过校验", en: "The file did not pass validation" },
  button: { zh: "选择 PDF", en: "Choose PDF" },
});

const validateLog = useRef(t("rule"));

const validateCode = (): string => `<elf-upload
  accept=".pdf"
  file-name-pattern="^report-.*\\\\.pdf$"
  :max-size=\${1048576}
  :before-upload.prop=\${beforeUpload}
  @invalid=\${onInvalid}
/>`;

const validateScript = (): string => `const validateLog = useRef("${t("rule")}");

const beforeUpload = (file) => {
  const ok = file.size <= 1024 * 1024;
  if (!ok) validateLog.set(\`\${file.name} ${t("tooLarge")}\`);
  return ok;
};

const onInvalid = (event) => {
  validateLog.set(event.detail?.message || "${t("invalid")}");
};`;

const beforeUpload = (file: File): boolean => {
  const ok = file.size <= 1024 * 1024;
  if (!ok) validateLog.set(`${file.name} ${t("tooLarge")}`);
  return ok;
};

const onInvalid = (event: CustomEvent): void => {
  validateLog.set(event.detail?.message || t("invalid"));
};

defineStyle(styles);

const PageUploadEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${validateCode()} :script=${validateScript()}>
    <span slot="status" role="status" aria-live="polite">${validateLog.value}</span>
    <div class="upload-demo-stage">
      <elf-upload
        accept=".pdf"
        file-name-pattern="^report-.*\\\\.pdf$"
        :maxSize=${1048576}
        :beforeUpload.prop=${beforeUpload}
        :buttonText.prop=${t("button")}
        :tip=${t("rule")}
        @invalid=${onInvalid}
      ></elf-upload>
    </div>
  </elf-playground>
`);

export { PageUploadEx3 };
