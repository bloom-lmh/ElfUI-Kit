import { defineHtml, useRef } from "@elfui/core";

import type { UploadRequestOptions } from "../../../components/Form";

const requestLog = useRef("等待自定义请求");

const headers = { Authorization: "Bearer demo-token" };

const extraData = { source: "playground", biz: "report" };

const requestCode = `<elf-upload
  action="/api/upload"
  method="put"
  directory
  :headers.prop=\${headers}
  :data.prop=\${extraData}
  :http-request.prop=\${httpRequest}
  @success=\${onRequestSuccess}
/>`;

const requestScript = `const requestLog = useRef("等待自定义请求");

const headers = { Authorization: "Bearer demo-token" };
const extraData = { source: "playground", biz: "report" };

const httpRequest = (options) => {
  requestLog.set(\`\${options.method.toUpperCase()} \${options.action}：\${options.file.name}\`);
  options.onProgress(35);
  setTimeout(() => {
    options.onProgress(100);
    options.onSuccess({ ok: true, data: options.data, headers: options.headers });
  }, 300);
};

const onRequestSuccess = (event) => {
  const [, file] = event.detail;
  requestLog.set(\`\${file.name} 已通过自定义请求上传\`);
};`;

const httpRequest = (options: UploadRequestOptions): void => {
  requestLog.set(`${options.method.toUpperCase()} ${options.action}：${options.file.name}`);
  options.onProgress(35);
  window.setTimeout(() => {
    options.onProgress(100);
    options.onSuccess({ ok: true, data: options.data, headers: options.headers });
  }, 300);
};

const onRequestSuccess = (event: CustomEvent): void => {
  const [, file] = event.detail as [unknown, { name: string }];
  requestLog.set(`${file.name} 已通过自定义请求上传`);
};

const PageUploadEx5 = defineHtml(`
<elf-playground
      title="自定义请求、目录与附加数据"
      :code=${requestCode}
      :script=${requestScript}
    >
      <div style="display:grid;place-items:center;width:100%">
        <elf-upload
          style="width:min(100%,720px)"
          action="/api/upload"
          method="put"
          directory
          :headers.prop=${headers}
          :data.prop=${extraData}
          :httpRequest.prop=${httpRequest}
          tip="directory 开启文件夹选择；httpRequest 接管真实请求。"
          @success=${onRequestSuccess}
        ></elf-upload>
      </div>
      <span slot="status" class="demo-state">${requestLog.value}</span>
    </elf-playground>
`);

export { PageUploadEx5 };
