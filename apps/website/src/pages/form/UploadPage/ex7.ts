import { defineHtml, defineStyle, useRef } from "@elfui/core";
import type { UploadFileItem } from "@elfui/kit-src/components/Form";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "多文件状态与失败重试", en: "Multiple-file states and retry" },
  total: { zh: "文件总数", en: "Total files" },
  ready: { zh: "就绪", en: "Ready" },
  uploading: { zh: "上传中", en: "Uploading" },
  success: { zh: "成功", en: "Success" },
  error: { zh: "失败", en: "Failed" },
  errorMessage: { zh: "网络中断，可点击重试", en: "Network interrupted. Retry is available." },
  button: { zh: "继续添加", en: "Add more files" },
  tip: {
    zh: "失败文件可重试；每一项均可预览或移除。",
    en: "Failed files can be retried; every item can be previewed or removed.",
  },
});

const fileList = useRef<UploadFileItem[]>([
  {
    uid: "spec-ready",
    name: "component-spec.pdf",
    size: 284_000,
    type: "application/pdf",
    status: "ready",
    percentage: 0,
  },
  {
    uid: "preview-uploading",
    name: "dashboard-preview.png",
    size: 1_420_000,
    type: "image/png",
    status: "uploading",
    percentage: 68,
  },
  {
    uid: "notes-success",
    name: "release-notes.md",
    size: 18_400,
    type: "text/markdown",
    status: "success",
    percentage: 100,
  },
  {
    uid: "metrics-error",
    name: "metrics.csv",
    size: 96_000,
    type: "text/csv",
    status: "error",
    percentage: 42,
    message: t("errorMessage"),
  },
]);

const updateFiles = (event: CustomEvent<UploadFileItem[]>): void => {
  fileList.set(Array.isArray(event.detail) ? event.detail : []);
};

const statusText = (): string => {
  const counts = fileList.value.reduce<Record<string, number>>((result, file) => {
    result[file.status] = (result[file.status] || 0) + 1;
    return result;
  }, {});
  return `${t("total")}: ${fileList.value.length} · ${t("ready")}: ${counts.ready || 0} · ${t("uploading")}: ${counts.uploading || 0} · ${t("success")}: ${counts.success || 0} · ${t("error")}: ${counts.error || 0}`;
};

const listCode = (): string => `<elf-upload
  multiple
  :fileList.prop=\${fileList}
  button-text="${t("button")}"
  @update:fileList=\${updateFiles}
/>`;

const listScript = (): string => `const fileList = useRef([
  { uid: "ready", name: "component-spec.pdf", status: "ready", percentage: 0 },
  { uid: "progress", name: "dashboard-preview.png", status: "uploading", percentage: 68 },
  { uid: "success", name: "release-notes.md", status: "success", percentage: 100 },
  { uid: "error", name: "metrics.csv", status: "error", percentage: 42, message: "${t("errorMessage")}" }
]);

const updateFiles = (event) => {
  fileList.set(Array.isArray(event.detail) ? event.detail : []);
};`;

defineStyle(styles);

const PageUploadEx7 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${listCode()} :script=${listScript()}>
    <span slot="status" role="status" aria-live="polite">${statusText()}</span>
    <div class="upload-demo-stage">
      <elf-upload
        multiple
        :fileList.prop=${fileList.value}
        :buttonText.prop=${t("button")}
        :tip=${t("tip")}
        @update:fileList=${updateFiles}
      ></elf-upload>
    </div>
  </elf-playground>
`);

export { PageUploadEx7 };
