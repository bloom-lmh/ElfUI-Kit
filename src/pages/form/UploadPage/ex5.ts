import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type { UploadRequestOptions } from "../../../components/Form";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "自定义请求与目录", en: "Custom request and directory selection" },
  idle: { zh: "等待自定义请求", en: "Waiting for a custom request" },
  uploaded: { zh: "已通过自定义请求上传", en: "uploaded through the custom request" },
  button: { zh: "选择目录", en: "Choose directory" },
  tip: {
    zh: "目录选择复用组件入口；httpRequest 接管上传请求。",
    en: "Directory selection reuses the component trigger; httpRequest owns the upload request.",
  },
});

const requestLog = useRef(t("idle"));

const headers = { Authorization: "Bearer demo-token" };

const extraData = { source: "playground", biz: "report" };

const requestCode = (): string => `<elf-upload
  action="/api/upload"
  method="put"
  directory
  button-text="${t("button")}"
  :headers.prop=\${headers}
  :data.prop=\${extraData}
  :http-request.prop=\${httpRequest}
  @success=\${onRequestSuccess}
/>`;

const requestScript = (): string => `const requestLog = useRef("${t("idle")}");

const headers = { Authorization: "Bearer demo-token" };
const extraData = { source: "playground", biz: "report" };

const httpRequest = (options) => {
  requestLog.set(\`\${options.method.toUpperCase()} \${options.action}：\${options.file.name}\`);
  options.onProgress(35);
  queueMicrotask(() => {
    options.onProgress(100);
    options.onSuccess({ ok: true, data: options.data, headers: options.headers });
  });
};

const onRequestSuccess = (event) => {
  const [, file] = event.detail;
  requestLog.set(\`\${file.name}: ${t("uploaded")}\`);
};`;

const httpRequest = (options: UploadRequestOptions): void => {
  requestLog.set(`${options.method.toUpperCase()} ${options.action}：${options.file.name}`);
  options.onProgress(35);
  queueMicrotask(() => {
    options.onProgress(100);
    options.onSuccess({ ok: true, data: options.data, headers: options.headers });
  });
};

const onRequestSuccess = (event: CustomEvent): void => {
  const [, file] = event.detail as [unknown, { name: string }];
  requestLog.set(`${file.name}: ${t("uploaded")}`);
};

defineStyle(styles);

const PageUploadEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${requestCode()} :script=${requestScript()}>
    <span slot="status" role="status" aria-live="polite">${requestLog.value}</span>
    <div class="upload-demo-stage">
      <elf-upload
        action="/api/upload"
        method="put"
        directory
        :buttonText.prop=${t("button")}
        :headers.prop=${headers}
        :data.prop=${extraData}
        :httpRequest.prop=${httpRequest}
        :tip=${t("tip")}
        @success=${onRequestSuccess}
      ></elf-upload>
    </div>
  </elf-playground>
`);

export { PageUploadEx5 };
