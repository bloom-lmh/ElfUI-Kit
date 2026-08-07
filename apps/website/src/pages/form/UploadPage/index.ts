import { defineHtml, useComponents } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

import { PageUploadEx1 } from "./ex1";
import { PageUploadEx2 } from "./ex2";
import { PageUploadEx3 } from "./ex3";
import { PageUploadEx4 } from "./ex4";
import { PageUploadEx5 } from "./ex5";
import { PageUploadEx6 } from "./ex6";
import { PageUploadEx7 } from "./ex7";
import { PageUploadEx8 } from "./ex8";
import { PageUploadEx9 } from "./ex9";

const t = createDocsTranslator({
  description: {
    zh: "文件选择与上传入口，覆盖受控列表、拖拽、校验、手动提交、自定义请求、分片上传和失败恢复。",
    en: "A file-selection and upload surface with controlled lists, drag and drop, validation, manual submission, custom requests, chunking, and failure recovery.",
  },
  props: { zh: "Upload 属性", en: "Upload props" },
  events: { zh: "Upload 事件", en: "Upload events" },
  methods: { zh: "Upload 方法", en: "Upload methods" },
  slots: { zh: "Upload 插槽", en: "Upload slots" },
});
const pick = createDocsPicker();

const propsRows = () => [
  {
    name: "modelValue",
    type: "UploadFileItem[]",
    default: "[]",
    desc: pick(
      "受控文件列表；fileList 提供 Element Plus 的 v-model:file-list 兼容入口。",
      "The controlled file list; fileList provides the Element Plus-compatible v-model:file-list entry.",
    ),
  },
  {
    name: "fileList",
    type: "UploadFileItem[]",
    default: "[]",
    desc: pick(
      "受控文件列表；fileList 提供 Element Plus 的 v-model:file-list 兼容入口。",
      "The controlled file list; fileList provides the Element Plus-compatible v-model:file-list entry.",
    ),
  },
  {
    name: "action",
    type: "string",
    default: "''",
    desc: pick(
      "设置默认 XHR 请求地址、HTTP 方法和表单字段名。",
      "Set the default XHR endpoint, HTTP method, and form field name.",
    ),
  },
  {
    name: "method",
    type: "string",
    default: "post",
    desc: pick(
      "设置默认 XHR 请求地址、HTTP 方法和表单字段名。",
      "Set the default XHR endpoint, HTTP method, and form field name.",
    ),
  },
  {
    name: "name",
    type: "string",
    default: "file",
    desc: pick(
      "设置默认 XHR 请求地址、HTTP 方法和表单字段名。",
      "Set the default XHR endpoint, HTTP method, and form field name.",
    ),
  },
  {
    name: "headers",
    type: "Headers | object",
    default: "{}",
    desc: pick(
      "为默认或自定义请求提供请求头、附加数据和凭证策略；data 函数可按文件异步解析。",
      "Provide headers, additional data, and credentials for default or custom requests; data functions may resolve asynchronously per file.",
    ),
  },
  {
    name: "data",
    type: "object | Function",
    default: "{}",
    desc: pick(
      "为默认或自定义请求提供请求头、附加数据和凭证策略；data 函数可按文件异步解析。",
      "Provide headers, additional data, and credentials for default or custom requests; data functions may resolve asynchronously per file.",
    ),
  },
  {
    name: "withCredentials",
    type: "boolean",
    default: "false",
    desc: pick(
      "为默认或自定义请求提供请求头、附加数据和凭证策略；data 函数可按文件异步解析。",
      "Provide headers, additional data, and credentials for default or custom requests; data functions may resolve asynchronously per file.",
    ),
  },
  {
    name: "accept",
    type: "string",
    default: "''",
    desc: pick(
      "限制可选择文件类型，并配置图片预览的跨源模式。",
      "Restrict selectable file types and configure cross-origin image previews.",
    ),
  },
  {
    name: "crossorigin",
    type: "'' | anonymous | use-credentials",
    default: "''",
    desc: pick(
      "限制可选择文件类型，并配置图片预览的跨源模式。",
      "Restrict selectable file types and configure cross-origin image previews.",
    ),
  },
  {
    name: "multiple",
    type: "boolean",
    default: "false",
    desc: pick(
      "启用多选、目录选择和带键盘语义的拖拽区域。",
      "Enable multiple selection, directory selection, and a keyboard-accessible drop zone.",
    ),
  },
  {
    name: "directory",
    type: "boolean",
    default: "false",
    desc: pick(
      "启用多选、目录选择和带键盘语义的拖拽区域。",
      "Enable multiple selection, directory selection, and a keyboard-accessible drop zone.",
    ),
  },
  {
    name: "drag",
    type: "boolean",
    default: "false",
    desc: pick(
      "启用多选、目录选择和带键盘语义的拖拽区域。",
      "Enable multiple selection, directory selection, and a keyboard-accessible drop zone.",
    ),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick(
      "合并组件与 Form 禁用状态，并控制列表变化时是否触发表单校验。",
      "Merge component and Form disabled state, and control Form validation on list changes.",
    ),
  },
  {
    name: "validateEvent",
    type: "boolean",
    default: "true",
    desc: pick(
      "合并组件与 Form 禁用状态，并控制列表变化时是否触发表单校验。",
      "Merge component and Form disabled state, and control Form validation on list changes.",
    ),
  },
  {
    name: "autoUpload",
    type: "boolean",
    default: "true",
    desc: pick(
      "选择完成后立即上传；关闭时复用组件内置的手动提交命令。",
      "Upload immediately after selection; when disabled, use the component's built-in manual submit command.",
    ),
  },
  {
    name: "limit",
    type: "number",
    default: "0",
    desc: pick(
      "限制文件数量、单文件字节数和文件名正则；0 或空字符串表示不限制。",
      "Limit file count, per-file bytes, and filename pattern; zero or an empty string disables the limit.",
    ),
  },
  {
    name: "maxSize",
    type: "number",
    default: "0",
    desc: pick(
      "限制文件数量、单文件字节数和文件名正则；0 或空字符串表示不限制。",
      "Limit file count, per-file bytes, and filename pattern; zero or an empty string disables the limit.",
    ),
  },
  {
    name: "fileNamePattern",
    type: "string",
    default: "''",
    desc: pick(
      "限制文件数量、单文件字节数和文件名正则；0 或空字符串表示不限制。",
      "Limit file count, per-file bytes, and filename pattern; zero or an empty string disables the limit.",
    ),
  },
  {
    name: "chunkSize",
    type: "number",
    default: "0",
    desc: pick(
      "按稳定边界切分原始文件，并把每个 Blob 与索引、范围和进度回调交给请求适配器。",
      "Slice the raw file at stable boundaries and pass each Blob, index, range, and progress callback to the request adapter.",
    ),
  },
  {
    name: "chunkRequest",
    type: "(options) => void | Promise<void>",
    default: "-",
    desc: pick(
      "按稳定边界切分原始文件，并把每个 Blob 与索引、范围和进度回调交给请求适配器。",
      "Slice the raw file at stable boundaries and pass each Blob, index, range, and progress callback to the request adapter.",
    ),
  },
  {
    name: "listType",
    type: "text | picture | picture-card",
    default: "text",
    desc: pick(
      "选择文件列表外观，或隐藏内置列表以组合自定义选择表面。",
      "Choose the file-list presentation or hide the built-in list for a custom selection surface.",
    ),
  },
  {
    name: "showFileList",
    type: "boolean",
    default: "true",
    desc: pick(
      "选择文件列表外观，或隐藏内置列表以组合自定义选择表面。",
      "Choose the file-list presentation or hide the built-in list for a custom selection surface.",
    ),
  },
  {
    name: "buttonText",
    type: "string",
    default: "''",
    desc: pick(
      "覆盖内置选择按钮和辅助说明；空值使用 Provider 文案或 tip 插槽。",
      "Override the built-in choose button and guidance; empty values use Provider copy or the tip slot.",
    ),
  },
  {
    name: "tip",
    type: "string",
    default: "''",
    desc: pick(
      "覆盖内置选择按钮和辅助说明；空值使用 Provider 文案或 tip 插槽。",
      "Override the built-in choose button and guidance; empty values use Provider copy or the tip slot.",
    ),
  },
  {
    name: "beforeUpload",
    type: "Function",
    default: "-",
    desc: pick(
      "在加入上传队列或移除文件前同步、异步放行操作。",
      "Allow or reject queue insertion and file removal synchronously or asynchronously.",
    ),
  },
  {
    name: "beforeRemove",
    type: "Function",
    default: "-",
    desc: pick(
      "在加入上传队列或移除文件前同步、异步放行操作。",
      "Allow or reject queue insertion and file removal synchronously or asynchronously.",
    ),
  },
  {
    name: "httpRequest",
    type: "(options: UploadRequestOptions) => UploadRequestResult",
    default: "-",
    desc: pick(
      "替换默认 XHR，并可返回 abort handle 参与组件统一取消和卸载清理。",
      "Replace the default XHR and optionally return an abort handle for unified cancellation and unmount cleanup.",
    ),
  },
  {
    name: "customRequest",
    type: "(options: UploadRequestOptions) => UploadRequestResult",
    default: "-",
    desc: pick(
      "替换默认 XHR，并可返回 abort handle 参与组件统一取消和卸载清理。",
      "Replace the default XHR and optionally return an abort handle for unified cancellation and unmount cleanup.",
    ),
  },
  {
    name: "onPreview",
    type: "Function",
    default: "-",
    desc: pick(
      "Element Plus 风格回调属性，分别接收预览、移除、列表变化和超限 payload。",
      "Element Plus-style callback props for preview, removal, list changes, and limit-exceeded payloads.",
    ),
  },
  {
    name: "onRemove",
    type: "Function",
    default: "-",
    desc: pick(
      "Element Plus 风格回调属性，分别接收预览、移除、列表变化和超限 payload。",
      "Element Plus-style callback props for preview, removal, list changes, and limit-exceeded payloads.",
    ),
  },
  {
    name: "onChange",
    type: "Function",
    default: "-",
    desc: pick(
      "Element Plus 风格回调属性，分别接收预览、移除、列表变化和超限 payload。",
      "Element Plus-style callback props for preview, removal, list changes, and limit-exceeded payloads.",
    ),
  },
  {
    name: "onExceed",
    type: "Function",
    default: "-",
    desc: pick(
      "Element Plus 风格回调属性，分别接收预览、移除、列表变化和超限 payload。",
      "Element Plus-style callback props for preview, removal, list changes, and limit-exceeded payloads.",
    ),
  },
  {
    name: "onProgress",
    type: "Function",
    default: "-",
    desc: pick(
      "接收进度、成功响应和错误，并携带当前文件与完整文件列表。",
      "Receive progress, success responses, and errors with the current file and complete file list.",
    ),
  },
  {
    name: "onSuccess",
    type: "Function",
    default: "-",
    desc: pick(
      "接收进度、成功响应和错误，并携带当前文件与完整文件列表。",
      "Receive progress, success responses, and errors with the current file and complete file list.",
    ),
  },
  {
    name: "onError",
    type: "Function",
    default: "-",
    desc: pick(
      "接收进度、成功响应和错误，并携带当前文件与完整文件列表。",
      "Receive progress, success responses, and errors with the current file and complete file list.",
    ),
  },
];

const eventsRows = () => [
  {
    name: "update:modelValue",
    type: "(files: UploadFileItem[]) => void",
    desc: pick(
      "请求提交新的受控文件列表。",
      "Request a new controlled file list through either compatibility channel.",
    ),
  },
  {
    name: "update:fileList",
    type: "(files: UploadFileItem[]) => void",
    desc: pick(
      "请求提交新的受控文件列表。",
      "Request a new controlled file list through either compatibility channel.",
    ),
  },
  {
    name: "change",
    type: "(files: UploadFileItem[]) => void",
    desc: pick("文件列表提交变化后触发。", "Emitted after the file list commits a change."),
  },
  {
    name: "invalid",
    type: "(payload: UploadInvalidPayload) => void",
    desc: pick(
      "报告数量、类型、大小、文件名或 beforeUpload 拒绝原因。",
      "Report limit, type, size, filename, or beforeUpload rejection details.",
    ),
  },
  {
    name: "exceed",
    type: "(incoming: File[], files: UploadFileItem[]) => void",
    desc: pick(
      "报告超出数量限制的原始文件和当前列表。",
      "Report incoming raw files and the current list when the limit is exceeded.",
    ),
  },
  {
    name: "progress",
    type: "(percentage, file, files) => void",
    desc: pick("上传进度归一化为 0 至 100。", "Upload progress normalized from 0 to 100."),
  },
  {
    name: "success",
    type: "(result, file, files) => void",
    desc: pick(
      "报告请求完成响应或错误及其文件上下文。",
      "Report a completed response or error with its file context.",
    ),
  },
  {
    name: "error",
    type: "(result, file, files) => void",
    desc: pick(
      "报告请求完成响应或错误及其文件上下文。",
      "Report a completed response or error with its file context.",
    ),
  },
  {
    name: "remove",
    type: "(file, files?) => void",
    desc: pick("报告移除和预览命令。", "Report remove and preview commands."),
  },
  {
    name: "preview",
    type: "(file, files?) => void",
    desc: pick("报告移除和预览命令。", "Report remove and preview commands."),
  },
];

const methodsRows = () => [
  { name: "select()", desc: pick("打开原生文件选择器。", "Open the native file picker.") },
  { name: "submit()", desc: pick("上传全部 ready 文件。", "Upload every ready file.") },
  {
    name: "abort(file?)",
    desc: pick(
      "取消全部或指定文件的活动请求。",
      "Cancel all active requests or the request for one file.",
    ),
  },
  {
    name: "handleStart(rawFile)",
    desc: pick(
      "通过完整校验流程加入原始文件。",
      "Add a raw file through the complete validation pipeline.",
    ),
  },
  {
    name: "handleRemove(file)",
    desc: pick("按文件项或原始文件请求移除。", "Request removal by file item or raw file."),
  },
  {
    name: "clearFiles(statuses?)",
    desc: pick(
      "清空全部或指定状态的文件并释放资源。",
      "Clear all files or selected statuses and release their resources.",
    ),
  },
];

const slotsRows = () => [
  {
    name: "trigger",
    type: "{ select, disabled }",
    default: pick("内置选择按钮", "Built-in choose button"),
    desc: pick("自定义文件选择入口。", "Customize the file-selection trigger."),
  },
  {
    name: "dropzone",
    type: "{ select, disabled }",
    default: pick("内置拖拽提示", "Built-in drag prompt"),
    desc: pick("自定义完整拖拽区域内容。", "Customize the complete drop-zone content."),
  },
  {
    name: "tip",
    type: "unknown",
    default: "tip",
    desc: pick("自定义上传限制与帮助说明。", "Customize upload constraints and guidance."),
  },
  {
    name: "file",
    type: "{ file, remove, preview }",
    default: pick("文件名", "Filename"),
    desc: pick(
      "自定义单个文件名称区域，并复用组件公开的移除和预览命令。",
      "Customize one filename region while reusing the component's public remove and preview commands.",
    ),
  },
];

useComponents({
  "page-upload-ex1": PageUploadEx1,
  "page-upload-ex2": PageUploadEx2,
  "page-upload-ex3": PageUploadEx3,
  "page-upload-ex4": PageUploadEx4,
  "page-upload-ex5": PageUploadEx5,
  "page-upload-ex6": PageUploadEx6,
  "page-upload-ex7": PageUploadEx7,
  "page-upload-ex8": PageUploadEx8,
  "page-upload-ex9": PageUploadEx9,
});

const PageUpload = defineHtml(`
  <elf-container>
    <elf-docs-hero category="form" tag="Upload" title="Upload" :description=${t("description")}></elf-docs-hero>

    <page-upload-ex1 />

    <page-upload-ex2 />

    <page-upload-ex8 />

    <page-upload-ex9 />

    <page-upload-ex7 />

    <page-upload-ex3 />

    <page-upload-ex4 />

    <page-upload-ex5 />

    <page-upload-ex6 />

    <elf-api-builder component="elf-upload" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propsRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventsRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("methods")} :rows=${methodsRows()}></elf-props-table>
    <elf-props-table role="slots" :title=${t("slots")} :rows=${slotsRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageUpload };
