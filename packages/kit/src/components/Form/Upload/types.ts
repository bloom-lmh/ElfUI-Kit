export type UploadListType = "text" | "picture" | "picture-card";
export type UploadStatus = "ready" | "uploading" | "success" | "error";
export type UploadInvalidReason = "limit" | "accept" | "size" | "name" | "before-upload";

export interface UploadFileItem {
  uid: string;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  percentage: number;
  raw?: File;
  url?: string;
  response?: unknown;
  error?: unknown;
  message?: string;
}

export interface UploadRequestOptions {
  action: string;
  method: string;
  filename: string;
  file: UploadFileItem;
  data: Record<string, unknown>;
  headers: Headers | Record<string, unknown>;
  withCredentials: boolean;
  onProgress(percent: number): void;
  onSuccess(response?: unknown): void;
  onError(error: unknown): void;
}

export interface UploadRequestHandle {
  abort(): void;
}

export type UploadRequestResult = void | UploadRequestHandle | Promise<void | UploadRequestHandle>;

export interface UploadChunkRequestOptions {
  file: UploadFileItem;
  chunk: Blob;
  index: number;
  total: number;
  start: number;
  end: number;
  onProgress(percent: number): void;
}

export interface UploadInvalidPayload {
  file?: File;
  files?: File[];
  reason: UploadInvalidReason;
  message: string;
}

export interface UploadProps {
  modelValue: UploadFileItem[];
  fileList?: UploadFileItem[];
  action: string;
  method: string;
  headers: Headers | Record<string, unknown>;
  data:
    | Record<string, unknown>
    | ((file: File) => Record<string, unknown> | Promise<Record<string, unknown>>);
  withCredentials: boolean;
  accept: string;
  crossorigin: "" | "anonymous" | "use-credentials";
  name: string;
  multiple: boolean;
  directory: boolean;
  drag: boolean;
  disabled: boolean;
  required: boolean;
  validateEvent: boolean;
  autoUpload: boolean;
  limit: number;
  maxSize: number;
  fileNamePattern: string;
  chunkSize: number;
  listType: UploadListType;
  showFileList: boolean;
  buttonText: string;
  tip: string;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  beforeRemove?: (file: UploadFileItem) => boolean | Promise<boolean>;
  customRequest?: (options: UploadRequestOptions) => UploadRequestResult;
  httpRequest?: (options: UploadRequestOptions) => UploadRequestResult;
  chunkRequest?: (options: UploadChunkRequestOptions) => void | Promise<void>;
  onPreview?: (file: UploadFileItem) => void;
  onRemove?: (file: UploadFileItem, files: UploadFileItem[]) => void;
  onSuccess?: (response: unknown, file: UploadFileItem, files: UploadFileItem[]) => void;
  onError?: (error: unknown, file: UploadFileItem, files: UploadFileItem[]) => void;
  onProgress?: (percentage: number, file: UploadFileItem, files: UploadFileItem[]) => void;
  onChange?: (file: UploadFileItem | null, files: UploadFileItem[]) => void;
  onExceed?: (files: File[], uploadFiles: UploadFileItem[]) => void;
  form: string;
}

export interface UploadEmits {
  "update:modelValue": [files: UploadFileItem[]];
  "update:fileList": [files: UploadFileItem[]];
  change: [files: UploadFileItem[]];
  remove: [file: UploadFileItem, files: UploadFileItem[]];
  preview: [file: UploadFileItem];
  exceed: [files: File[], uploadFiles: UploadFileItem[]];
  invalid: [payload: UploadInvalidPayload];
  progress: [percentage: number, file: UploadFileItem, files: UploadFileItem[]];
  success: [response: unknown, file: UploadFileItem, files: UploadFileItem[]];
  error: [error: unknown, file: UploadFileItem, files: UploadFileItem[]];
}

/** Public slot surface exposed by {@link UploadElement}. */
export interface UploadSlots {
  /** Replaces the file-selection trigger and receives `select` and `disabled` slot props. */
  trigger?: unknown;
  /** Replaces the drag surface content and receives `select` and `disabled` slot props. */
  dropzone?: unknown;
  /** Replaces the upload constraint and guidance content. */
  tip?: unknown;
  /** Replaces one filename region and receives `file`, `remove`, and `preview` slot props. */
  file?: unknown;
}

/** Imperative Upload operations available on the custom element instance. */
export interface UploadExpose {
  select(): void;
  submit(): void;
  abort(file?: UploadFileItem): void;
  handleStart(rawFile: File): void;
  handleRemove(file: UploadFileItem | File): void;
  clearFiles(statuses?: UploadStatus[]): void;
}

/** Typed custom element contract for property assignment and imperative Upload operations. */
export type UploadElement = HTMLElement & UploadProps & UploadExpose;
