import { defineHtml, useRef } from "@elfui/core";


const validateLog = useRef("只允许 report-*.pdf，且单文件不超过 1MB");

const validateCode = `<elf-upload
  accept=".pdf"
  file-name-pattern="^report-.*\\\\.pdf$"
  :max-size=\${1048576}
  :before-upload.prop=\${beforeUpload}
  @invalid=\${onInvalid}
/>`;

const validateScript = `const validateLog = useRef("只允许 report-*.pdf，且单文件不超过 1MB");

const beforeUpload = (file) => {
  const ok = file.size <= 1024 * 1024;
  if (!ok) validateLog.set(\`\${file.name} 超过 1MB，已阻止上传\`);
  return ok;
};

const onInvalid = (event) => {
  validateLog.set(event.detail?.message || "文件未通过校验");
};`;

const beforeUpload = (file: File): boolean => {
  const ok = file.size <= 1024 * 1024;
  if (!ok) validateLog.set(`${file.name} 超过 1MB，已阻止上传`);
  return ok;
};

const onInvalid = (event: CustomEvent): void => {
  validateLog.set(event.detail?.message || "文件未通过校验");
};

const PageUploadEx3 = defineHtml(`
<elf-playground title="类型、大小与文件名校验" :code=${validateCode} :script=${validateScript}>
      <div style="display:grid;place-items:center;width:100%">
        <elf-upload
          style="width:min(100%,720px)"
          accept=".pdf"
          file-name-pattern="^report-.*\\\\.pdf$"
          :maxSize=${1048576}
          :beforeUpload.prop=${beforeUpload}
          button-text="选择 PDF"
          tip="只允许 report-*.pdf，且单文件不超过 1MB。"
          @invalid=${onInvalid}
        ></elf-upload>
      </div>
      <span slot="status" class="demo-state">${validateLog.value}</span>
    </elf-playground>
`);

export { PageUploadEx3 };
