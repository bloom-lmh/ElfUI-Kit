import { defineHtml, useRef } from "@elfui/core";
import type { UploadFileItem } from "../../../components/Form";

const fileList = useRef<UploadFileItem[]>([
  {
    uid: "spec-ready",
    name: "component-spec.pdf",
    size: 284_000,
    type: "application/pdf",
    status: "ready",
    percentage: 0
  },
  {
    uid: "preview-uploading",
    name: "dashboard-preview.png",
    size: 1_420_000,
    type: "image/png",
    status: "uploading",
    percentage: 68
  },
  {
    uid: "notes-success",
    name: "release-notes.md",
    size: 18_400,
    type: "text/markdown",
    status: "success",
    percentage: 100
  },
  {
    uid: "metrics-error",
    name: "metrics.csv",
    size: 96_000,
    type: "text/csv",
    status: "error",
    percentage: 42,
    message: "网络中断，可点击重试"
  }
]);

const updateFiles = (event: CustomEvent<UploadFileItem[]>): void => {
  fileList.set(Array.isArray(event.detail) ? event.detail : []);
};

const statusText = (): string => {
  const counts = fileList.value.reduce<Record<string, number>>((result, file) => {
    result[file.status] = (result[file.status] || 0) + 1;
    return result;
  }, {});
  return `共 ${fileList.value.length} 个 · 就绪 ${counts.ready || 0} · 上传中 ${counts.uploading || 0} · 成功 ${counts.success || 0} · 失败 ${counts.error || 0}`;
};

const listCode = `<elf-upload
  multiple
  :fileList.prop="fileList"
  button-text="继续添加"
  @update:fileList="updateFiles"
/>`;

const listScript = `const fileList = useRef([
  { uid: "ready", name: "component-spec.pdf", status: "ready", percentage: 0 },
  { uid: "progress", name: "dashboard-preview.png", status: "uploading", percentage: 68 },
  { uid: "success", name: "release-notes.md", status: "success", percentage: 100 },
  { uid: "error", name: "metrics.csv", status: "error", percentage: 42, message: "网络中断，可点击重试" }
]);

const updateFiles = (event) => {
  fileList.set(Array.isArray(event.detail) ? event.detail : []);
};`;

const PageUploadEx7 = defineHtml(`
  <elf-playground title="多文件列表与失败重试" :code=${listCode} :script=${listScript}>
    <div style="display:grid;place-items:center;width:100%">
      <elf-upload
        style="width:min(100%,720px)"
        multiple
        :fileList.prop="fileList"
        button-text="继续添加"
        tip="失败文件提供重试操作；每一项均可预览或移除。"
        @update:fileList="updateFiles"
      ></elf-upload>
    </div>
    <span slot="status" class="demo-state">${statusText()}</span>
  </elf-playground>
`);

export { PageUploadEx7 };
