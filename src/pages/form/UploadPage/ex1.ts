import { defineHtml, useRef } from "@elfui/core";


const basicLog = useRef("等待选择文件");

const basicCode = `<elf-upload
  multiple
  :limit=\${3}
  tip="最多 3 个文件"
  @change=\${onBasicChange}
/>`;

const basicScript = `const basicLog = useRef("等待选择文件");

const onBasicChange = (event) => {
  const files = event.detail;
  const names = files.map((file) => file.name).join("，");
  basicLog.set(files.length ? \`已选择 \${files.length} 个文件：\${names}\` : "列表为空");
};`;

const fileNames = (files: Array<{ name: string }>): string =>
  files.map((file) => file.name).join("，");

const onBasicChange = (event: CustomEvent): void => {
  const files = event.detail as Array<{ name: string }>;
  basicLog.set(files.length ? `已选择 ${files.length} 个文件：${fileNames(files)}` : "列表为空");
};

const PageUploadEx1 = defineHtml(`
<elf-playground title="基础上传" :code=${basicCode} :script=${basicScript}>
      <div style="display:grid;place-items:center;width:100%">
        <elf-upload
          style="width:min(100%,720px)"
          multiple
          :limit=${3}
          tip="最多选择 3 个文件，示例使用模拟上传。"
          @change=${onBasicChange}
        ></elf-upload>
      </div>
      <span slot="status" class="demo-state">${basicLog.value}</span>
    </elf-playground>
`);

export { PageUploadEx1 };
