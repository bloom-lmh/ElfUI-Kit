import { defineHtml, useRef } from "@elfui/core";

import type { UploadChunkRequestOptions } from "../../../components/Form";

const chunkLog = useRef("等待分片上传");

const uploadedChunks = useRef(0);

const chunkCode = `<elf-upload
  :chunk-size=\${256 * 1024}
  :chunk-request.prop=\${chunkRequest}
  @progress=\${onChunkProgress}
  @success=\${onChunkSuccess}
/>`;

const chunkScript = `const chunkLog = useRef("等待分片上传");
const uploadedChunks = useRef(0);

const chunkRequest = async (options) => {
  uploadedChunks.set(options.index + 1);
  chunkLog.set(\`正在上传第 \${options.index + 1} / \${options.total} 片（\${options.chunk.size} bytes）\`);
};

const onChunkProgress = (event) => {
  const [percent, file] = event.detail;
  chunkLog.set(\`\${file.name}：\${percent}%\`);
};

const onChunkSuccess = (event) => {
  const [response, file] = event.detail;
  chunkLog.set(\`\${file.name} 分片完成，共 \${response.chunks ?? 0} 片\`);
};`;

const onChunkProgress = (event: CustomEvent): void => {
  const [percent, file] = event.detail as [number, { name: string }];
  chunkLog.set(`${file.name}：${percent}%`);
};

const chunkRequest = async (options: UploadChunkRequestOptions): Promise<void> => {
  uploadedChunks.set(options.index + 1);
  chunkLog.set(`正在上传第 ${options.index + 1} / ${options.total} 片（${options.chunk.size} bytes）`);
};

const onChunkSuccess = (event: CustomEvent): void => {
  const [response, file] = event.detail as [{ chunks?: number }, { name: string }];
  chunkLog.set(`${file.name} 分片完成，共 ${response.chunks ?? 0} 片`);
};

const PageUploadEx6 = defineHtml(`
<elf-playground title="分片上传" :code=${chunkCode} :script=${chunkScript}>
      <div style="display:grid;place-items:center;width:100%">
        <elf-upload
          style="width:min(100%,720px)"
          :chunkSize.prop=${262144}
          :chunkRequest.prop=${chunkRequest}
          button-text="选择大文件"
          tip="示例按 256KB 对文件真实切片，并逐片调用 chunkRequest。"
          @progress=${onChunkProgress}
          @success=${onChunkSuccess}
        ></elf-upload>
      </div>
      <span slot="status" class="demo-state">${chunkLog.value}；已处理 ${uploadedChunks.value} 片</span>
    </elf-playground>
`);

export { PageUploadEx6 };
