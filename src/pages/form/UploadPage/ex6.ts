import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { UploadChunkRequestOptions } from "../../../components/Form";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "分片上传", en: "Chunked upload" },
  idle: { zh: "等待分片上传", en: "Waiting for a chunked upload" },
  uploading: { zh: "正在上传分片", en: "Uploading chunk" },
  complete: { zh: "分片上传完成", en: "Chunked upload complete" },
  processed: { zh: "已处理", en: "Processed" },
  chunks: { zh: "片", en: "chunks" },
  button: { zh: "选择大文件", en: "Choose a large file" },
  tip: {
    zh: "示例按 256 KB 真实切片，并逐片调用 chunkRequest。",
    en: "The demo slices the file into 256 KB chunks and calls chunkRequest for each chunk.",
  },
});

const chunkLog = useRef(t("idle"));

const uploadedChunks = useRef(0);

const chunkCode = (): string => `<elf-upload
  :chunk-size=\${256 * 1024}
  :chunk-request.prop=\${chunkRequest}
  @progress=\${onChunkProgress}
  @success=\${onChunkSuccess}
/>`;

const chunkScript = (): string => `const chunkLog = useRef("${t("idle")}");
const uploadedChunks = useRef(0);

const chunkRequest = async (options) => {
  uploadedChunks.set(options.index + 1);
  chunkLog.set(\`${t("uploading")}: \${options.index + 1} / \${options.total} (\${options.chunk.size} bytes)\`);
};

const onChunkProgress = (event) => {
  const [percent, file] = event.detail;
  chunkLog.set(\`\${file.name}：\${percent}%\`);
};

const onChunkSuccess = (event) => {
  const [response, file] = event.detail;
  chunkLog.set(\`\${file.name}: ${t("complete")} (\${response.chunks ?? 0} ${t("chunks")})\`);
};`;

const onChunkProgress = (event: CustomEvent): void => {
  const [percent, file] = event.detail as [number, { name: string }];
  chunkLog.set(`${file.name}：${percent}%`);
};

const chunkRequest = async (options: UploadChunkRequestOptions): Promise<void> => {
  uploadedChunks.set(options.index + 1);
  chunkLog.set(
    `${t("uploading")}: ${options.index + 1} / ${options.total} (${options.chunk.size} bytes)`,
  );
};

const onChunkSuccess = (event: CustomEvent): void => {
  const [response, file] = event.detail as [{ chunks?: number }, { name: string }];
  chunkLog.set(`${file.name}: ${t("complete")} (${response.chunks ?? 0} ${t("chunks")})`);
};

defineStyle(styles);

const PageUploadEx6 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${chunkCode()} :script=${chunkScript()}>
    <span slot="status" role="status" aria-live="polite">
      ${chunkLog.value}; ${t("processed")}: ${uploadedChunks.value} ${t("chunks")}
    </span>
    <div class="upload-demo-stage">
      <elf-upload
        :chunkSize.prop=${262144}
        :chunkRequest.prop=${chunkRequest}
        :buttonText.prop=${t("button")}
        :tip=${t("tip")}
        @progress=${onChunkProgress}
        @success=${onChunkSuccess}
      ></elf-upload>
    </div>
  </elf-playground>
`);

export { PageUploadEx6 };
