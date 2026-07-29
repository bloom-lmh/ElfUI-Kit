import { defineHtml, useRef } from "@elfui/core";


const manualLog = useRef("等待手动上传");

const manualFiles = useRef<unknown[]>([]);

const manualCode = `<elf-upload
  :modelValue=\${manualFiles}
  :auto-upload=\${false}
  button-text="选择待上传文件"
  @update:modelValue=\${onManualUpdate}
  @success=\${onManualSuccess}
/>`;

const manualScript = `const manualFiles = useRef([]);
const manualLog = useRef("等待手动上传");

const onManualUpdate = (event) => {
  const next = event.detail ?? [];
  manualFiles.set(next);
  manualLog.set(next.length ? \`待上传 \${next.length} 个文件\` : "等待手动上传");
};

const onManualSuccess = (event) => {
  const [, file] = event.detail;
  manualLog.set(\`\${file.name} 上传完成\`);
};`;

const onManualUpdate = (event: CustomEvent): void => {
  const next = (event.detail ?? []) as unknown[];
  manualFiles.set(next);
  manualLog.set(next.length ? `待上传 ${next.length} 个文件` : "等待手动上传");
};

const onManualSuccess = (event: CustomEvent): void => {
  const [, file] = event.detail as [unknown, { name: string }];
  manualLog.set(`${file.name} 上传完成`);
};

const PageUploadEx4 = defineHtml(`
<elf-playground title="手动上传" :code=${manualCode} :script=${manualScript}>
      <div style="display:grid;place-items:center;width:100%">
        <elf-upload
          style="width:min(100%,720px);--elf-upload-justify:center;--elf-upload-text-align:center"
          :modelValue=${manualFiles}
          :autoUpload=${false}
          button-text="选择待上传文件"
          tip="选择后点击开始上传。"
          @update:modelValue=${onManualUpdate}
          @success=${onManualSuccess}
        ></elf-upload>
      </div>
      <span slot="status" class="demo-state">${manualLog.value}</span>
    </elf-playground>
`);

export { PageUploadEx4 };
