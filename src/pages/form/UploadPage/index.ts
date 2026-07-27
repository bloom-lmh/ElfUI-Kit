import { defineHtml, useComponents } from "@elfui/core";
import type { UploadChunkRequestOptions, UploadRequestOptions } from "../../../components/Form";

import { PageUploadEx1 } from "./ex1";
import { PageUploadEx2 } from "./ex2";
import { PageUploadEx3 } from "./ex3";
import { PageUploadEx4 } from "./ex4";
import { PageUploadEx5 } from "./ex5";
import { PageUploadEx6 } from "./ex6";
import { PageUploadEx7 } from "./ex7";

const propsRows = [
  { name: "action", type: "string", default: "''", desc: "上传地址" },
  { name: "modelValue / fileList", type: "UploadFileItem[]", default: "[]", desc: "受控文件列表；fileList 支持 v-model:file-list 语义" },
  { name: "method", type: "string", default: "post", desc: "请求方法" },
  { name: "headers", type: "Headers | object", default: "{}", desc: "请求头" },
  { name: "data", type: "object | Function", default: "{}", desc: "附加表单数据" },
  { name: "withCredentials", type: "boolean", default: "false", desc: "携带凭证" },
  { name: "multiple", type: "boolean", default: "false", desc: "是否多选" },
  { name: "directory", type: "boolean", default: "false", desc: "文件夹选择" },
  { name: "drag", type: "boolean", default: "false", desc: "拖拽上传模式" },
  { name: "accept", type: "string", default: "''", desc: "文件类型，支持 .ext / mime / image/*" },
  { name: "autoUpload", type: "boolean", default: "true", desc: "选择后自动上传" },
  { name: "limit", type: "number", default: "0", desc: "文件数量上限，0 表示不限制" },
  { name: "maxSize", type: "number", default: "0", desc: "单文件大小上限，单位 byte" },
  { name: "fileNamePattern", type: "string", default: "''", desc: "文件名正则" },
  { name: "chunkSize", type: "number", default: "0", desc: "分片大小，0 表示不开启" },
  { name: "listType", type: "text|picture|picture-card", default: "text", desc: "文件列表类型" },
  { name: "showFileList", type: "boolean", default: "true", desc: "是否展示文件列表" },
  {
    name: "beforeUpload",
    type: "(file) => boolean | Promise<boolean>",
    default: "-",
    desc: "上传前拦截"
  },
  {
    name: "httpRequest / customRequest",
    type: "UploadRequestOptions => void",
    default: "-",
    desc: "完全自定义上传请求"
  },
  {
    name: "onPreview / onRemove",
    type: "Function",
    default: "-",
    desc: "Element Plus 风格回调属性"
  },
  {
    name: "onSuccess / onError / onProgress",
    type: "Function",
    default: "-",
    desc: "上传状态回调属性"
  },
  { name: "onChange / onExceed", type: "Function", default: "-", desc: "列表变化和超限回调属性" },
  {
    name: "chunkRequest",
    type: "UploadChunkRequestOptions => void",
    default: "-",
    desc: "自定义单个分片上传"
  }
];

const eventsRows = [
  { name: "update:modelValue / update:fileList", type: "(files) => void", desc: "两套受控文件列表更新事件" },
  { name: "change", type: "(files) => void", desc: "文件列表变化" },
  { name: "invalid", type: "({ reason, message, file }) => void", desc: "校验失败" },
  { name: "exceed", type: "(incoming, files) => void", desc: "超过数量限制" },
  { name: "progress", type: "(percent, file) => void", desc: "上传进度" },
  { name: "success", type: "(response, file, files) => void", desc: "上传成功" },
  { name: "error", type: "(error, file, files) => void", desc: "上传失败" },
  { name: "remove", type: "(file, files) => void", desc: "移除文件" },
  { name: "preview", type: "(file) => void", desc: "预览文件" }
];

const methodsRows = [
  { name: "select()", desc: "打开文件选择器" },
  { name: "submit()", desc: "手动上传 ready 文件" },
  { name: "abort(file?)", desc: "取消全部或指定文件上传" },
  { name: "handleStart(rawFile)", desc: "手动加入原始文件" },
  { name: "handleRemove(file)", desc: "手动移除文件" },
  { name: "clearFiles(statuses?)", desc: "清空全部或指定状态文件列表" }
];

const slotsRows = [
  { name: "trigger", type: "HTMLElement", default: "内置上传按钮", desc: "自定义文件选择入口" },
  { name: "tip", type: "HTMLElement", default: "tip 属性", desc: "上传限制与帮助说明" },
  { name: "file", type: "{ file, remove, preview }", default: "文件名", desc: "自定义单个文件内容，提供文件与操作方法" }
];

useComponents({
  "page-upload-ex1": PageUploadEx1,
  "page-upload-ex2": PageUploadEx2,
  "page-upload-ex3": PageUploadEx3,
  "page-upload-ex4": PageUploadEx4,
  "page-upload-ex5": PageUploadEx5,
  "page-upload-ex6": PageUploadEx6,
  "page-upload-ex7": PageUploadEx7
});

const PageUpload = defineHtml(`
  <elf-container>
    <h1>Upload 上传</h1>
    <p>文件选择与上传入口，支持多选、拖拽、图片卡片、校验、手动上传、自定义请求和分片上传。</p>

    <page-upload-ex1 />

    <page-upload-ex2 />

    <page-upload-ex7 />

    <page-upload-ex3 />

    <page-upload-ex4 />

    <page-upload-ex5 />

    <page-upload-ex6 />

    <h2>API</h2>
    <elf-props-table title="上传属性" :rows="propsRows"></elf-props-table>
    <elf-props-table title="上传事件" :rows="eventsRows"></elf-props-table>
    <elf-props-table title="上传方法" :rows="methodsRows"></elf-props-table>
    <elf-props-table title="上传插槽" :rows="slotsRows"></elf-props-table>
  </elf-container>
`);

export { PageUpload };
