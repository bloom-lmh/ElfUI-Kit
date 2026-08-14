import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineOptions,
  defineProps,
  defineStyle,
  inject,
  onUnmounted,
  useEffect,
  useHost,
  useHostFlag,
  useRef,
  useTemplateRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { serializeNativeFormValue, useDisabled, useNativeFormControl } from "../../../composables";
import { FORM_ITEM_KEY } from "../context";
import type {
  UploadChunkRequestOptions,
  UploadEmits,
  UploadExpose,
  UploadFileItem,
  UploadInvalidPayload,
  UploadListType,
  UploadProps,
  UploadRequestHandle,
  UploadRequestOptions,
  UploadRequestResult,
  UploadSlots,
  UploadStatus,
} from "./types";
import { useLocaleProvider } from "../../Providers/context";

export type {
  UploadChunkRequestOptions,
  UploadElement,
  UploadEmits,
  UploadExpose,
  UploadFileItem,
  UploadInvalidPayload,
  UploadInvalidReason,
  UploadListType,
  UploadProps,
  UploadRequestOptions,
  UploadRequestHandle,
  UploadRequestResult,
  UploadSlots,
  UploadStatus,
} from "./types";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  fileList: { type: Array, default: undefined },
  action: { type: String, default: "" },
  method: { type: String, default: "post" },
  headers: { type: Object, default: () => ({}) },
  data: { type: null, default: () => ({}) },
  withCredentials: { type: Boolean, default: false },
  accept: { type: String, default: "" },
  crossorigin: { type: String, default: "" },
  name: { type: String, default: "file" },
  multiple: { type: Boolean, default: false },
  directory: { type: Boolean, default: false },
  drag: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  validateEvent: { type: Boolean, default: true },
  autoUpload: { type: Boolean, default: true },
  limit: { type: Number, default: 0 },
  maxSize: { type: Number, default: 0 },
  fileNamePattern: { type: String, default: "" },
  chunkSize: { type: Number, default: 0 },
  listType: { type: String, default: "text" },
  showFileList: { type: Boolean, default: true },
  buttonText: { type: String, default: "" },
  tip: { type: String, default: "" },
  beforeUpload: { type: Function, default: undefined },
  beforeRemove: { type: Function, default: undefined },
  customRequest: { type: Function, default: undefined },
  httpRequest: { type: Function, default: undefined },
  onPreview: { type: Function, default: undefined },
  onRemove: { type: Function, default: undefined },
  onSuccess: { type: Function, default: undefined },
  onError: { type: Function, default: undefined },
  onProgress: { type: Function, default: undefined },
  onChange: { type: Function, default: undefined },
  onExceed: { type: Function, default: undefined },
  chunkRequest: { type: Function, default: undefined },
  form: { type: String, default: "" },
});

defineOptions({ formControl: true });

const locale = useLocaleProvider();

const emit = defineEmits<UploadEmits>();

const inputRef = useTemplateRef<HTMLInputElement>("inputEl");
const tipSlotRef = useTemplateRef<HTMLSlotElement>("tipSlotEl");

const host = useHost();

const files = useRef<UploadFileItem[]>([]);

const uid = useRef(0);

const notice = useRef("");
const hasTipSlot = useRef(false);

const activeTimers = new Map<string, number>();
const activeRequests = new Map<string, UploadRequestHandle>();
const objectUrls = new Map<string, string>();

const formItem = inject(FORM_ITEM_KEY);
const isDisabled = useDisabled(() => Boolean(props.disabled));

useHostFlag("disabled", isDisabled);

const emitModel = (): void => {
  const next = [...files.value];
  emit("update:modelValue", next);
  emit("update:fileList", next);
  emit("change", next);
  if (props.validateEvent) formItem?.validateTrigger("change");
};

const syncTipSlot = (): void => {
  hasTipSlot.set(Boolean(tipSlotRef.value?.assignedNodes({ flatten: true }).length));
};

const notifyChange = (file: UploadFileItem | null): void => {
  (
    props.onChange as ((file: UploadFileItem | null, files: UploadFileItem[]) => void) | undefined
  )?.(file, [...files.value]);
};

useEffect(() => {
  const controlled = Array.isArray(props.fileList) ? props.fileList : props.modelValue;
  if (Array.isArray(controlled)) files.set([...(controlled as UploadFileItem[])]);
});

useNativeFormControl<UploadFileItem[]>({
  props,
  value: () => files.value,
  setValue: (value) => {
    const next = [...value];
    files.set(next);
    emit("update:modelValue", next);
    emit("update:fileList", next);
  },
  isEmpty: (value) => value.length === 0,
  serialize: (value, options) =>
    serializeNativeFormValue(
      value.flatMap((item) => (item.raw instanceof File ? [item.raw] : [])),
      options,
    ),
});

const createItem = (file: File): UploadFileItem => {
  uid.set(uid.value + 1);
  const itemUid = `${Date.now()}-${uid.value}`;
  let url: string | undefined;
  if (file.type.startsWith("image/") && typeof URL.createObjectURL === "function") {
    url = URL.createObjectURL(file);
    objectUrls.set(itemUid, url);
  }
  return {
    uid: itemUid,
    name: file.name,
    size: file.size,
    type: file.type,
    status: "ready",
    percentage: 0,
    raw: file,
    ...(url ? { url } : {}),
  };
};

const canAdd = (incoming: File[]): boolean => {
  const limit = Number(props.limit || 0);
  if (limit > 0 && files.value.length + incoming.length > limit) {
    setInvalid({
      files: incoming,
      reason: "limit",
      message: locale.t("upload.limit", { limit }),
    });
    emit("exceed", incoming, [...files.value]);
    (props.onExceed as ((files: File[], uploadFiles: UploadFileItem[]) => void) | undefined)?.(
      incoming,
      [...files.value],
    );
    return false;
  }
  return true;
};

const setInvalid = (payload: UploadInvalidPayload): void => {
  notice.set(payload.message);
  emit("invalid", payload);
};

const matchesAccept = (file: File): boolean => {
  const accept = String(props.accept || "").trim();
  if (!accept) return true;
  const rules = accept
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (rules.length === 0) return true;
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return fileName.endsWith(rule);
    if (rule.endsWith("/*")) return fileType.startsWith(rule.slice(0, -1));
    return fileType === rule;
  });
};

const validateFile = async (file: File): Promise<boolean> => {
  if (!matchesAccept(file)) {
    setInvalid({
      file,
      reason: "accept",
      message: locale.t("upload.invalidType", { name: file.name }),
    });
    return false;
  }

  const maxSize = Number(props.maxSize || 0);
  if (maxSize > 0 && file.size > maxSize) {
    setInvalid({
      file,
      reason: "size",
      message: locale.t("upload.sizeExceeded", { name: file.name }),
    });
    return false;
  }

  const pattern = String(props.fileNamePattern || "");
  if (pattern) {
    let regexp: RegExp;
    try {
      regexp = new RegExp(pattern);
    } catch {
      setInvalid({ file, reason: "name", message: locale.t("upload.invalidPattern") });
      return false;
    }
    if (!regexp.test(file.name)) {
      setInvalid({
        file,
        reason: "name",
        message: locale.t("upload.invalidName", { name: file.name }),
      });
      return false;
    }
  }

  const guard = props.beforeUpload as ((file: File) => boolean | Promise<boolean>) | undefined;
  if (!guard) return true;
  const result = await guard(file);
  if (result === false) {
    setInvalid({
      file,
      reason: "before-upload",
      message: locale.t("upload.rejected", { name: file.name }),
    });
    return false;
  }
  return true;
};

const addFiles = async (incoming: File[]): Promise<void> => {
  if (isDisabled() || incoming.length === 0 || !canAdd(incoming)) return;
  const accepted: UploadFileItem[] = [];
  for (const file of incoming) {
    if (await validateFile(file)) accepted.push(createItem(file));
  }
  if (accepted.length === 0) return;
  notice.set("");
  files.set([...files.value, ...accepted]);
  emitModel();
  for (const file of accepted) notifyChange(file);
  if (props.autoUpload) {
    for (const file of accepted) void uploadFile(file);
  }
};

const select = (): void => {
  if (isDisabled()) return;
  const input = inputRef.peek() ?? host.shadowRoot?.querySelector<HTMLInputElement>("input.native");
  input?.click();
};

const onInputChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  void addFiles(Array.from(input.files ?? []));
  input.value = "";
};

const onDrop = (event: DragEvent): void => {
  event.preventDefault();
  void addFiles(Array.from(event.dataTransfer?.files ?? []));
};

const onDragOver = (event: DragEvent): void => {
  event.preventDefault();
};

const onDropzoneKeydown = (event: KeyboardEvent): void => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  select();
};

const updateFile = (uidValue: string, patch: Partial<UploadFileItem>): void => {
  const next = files.value.map((file) => {
    if (file.uid !== uidValue) return file;
    Object.assign(file, patch);
    return file;
  });
  files.set([...next]);
  emitModel();
};

const uploadFile = async (file: UploadFileItem): Promise<void> => {
  if (file.status === "uploading" || file.status === "success") return;
  updateFile(file.uid, { status: "uploading", percentage: 5 });

  const resolveData = async (): Promise<Record<string, unknown>> => {
    const data = props.data as
      | Record<string, unknown>
      | ((rawFile: File) => Record<string, unknown> | Promise<Record<string, unknown>>)
      | undefined;
    if (typeof data === "function" && file.raw) return data(file.raw);
    return data && typeof data === "object" ? data : {};
  };

  const onProgress = (percentage: number): void => {
    const value = Math.max(0, Math.min(100, Math.round(percentage)));
    updateFile(file.uid, { percentage: value, status: "uploading" });
    emit("progress", value, file, [...files.value]);
    (
      props.onProgress as
        ((percentage: number, file: UploadFileItem, files: UploadFileItem[]) => void) | undefined
    )?.(value, file, [...files.value]);
  };
  const onSuccess = (response?: unknown): void => {
    activeRequests.delete(file.uid);
    updateFile(file.uid, { status: "success", percentage: 100, response });
    emit("success", response, file, [...files.value]);
    (
      props.onSuccess as
        ((response: unknown, file: UploadFileItem, files: UploadFileItem[]) => void) | undefined
    )?.(response, file, [...files.value]);
    notifyChange(file);
  };
  const onError = (error: unknown): void => {
    activeRequests.delete(file.uid);
    const message =
      error instanceof Error ? error.message : String(error || locale.t("upload.failed"));
    updateFile(file.uid, { status: "error", error, message });
    notice.set(message);
    emit("error", error, file, [...files.value]);
    (
      props.onError as
        ((error: unknown, file: UploadFileItem, files: UploadFileItem[]) => void) | undefined
    )?.(error, file, [...files.value]);
    notifyChange(file);
  };

  const requestOptions: UploadRequestOptions = {
    action: String(props.action || ""),
    method: String(props.method || "post"),
    filename: String(props.name || "file"),
    file,
    data: await resolveData(),
    headers: (props.headers || {}) as Headers | Record<string, unknown>,
    withCredentials: Boolean(props.withCredentials),
    onProgress,
    onSuccess,
    onError,
  };

  const customRequest = (props.httpRequest || props.customRequest) as
    ((options: UploadRequestOptions) => UploadRequestResult) | undefined;
  if (customRequest) {
    try {
      const result = await customRequest(requestOptions);
      if (result && typeof result.abort === "function") activeRequests.set(file.uid, result);
    } catch (error) {
      onError(error);
    }
    return;
  }

  if (Number(props.chunkSize || 0) > 0 && file.raw) {
    await uploadChunks(file, onProgress, onSuccess, onError);
    return;
  }

  if (props.action && file.raw) {
    runXhrRequest(requestOptions);
    return;
  }

  const timer = window.setTimeout(() => {
    activeTimers.delete(file.uid);
    onProgress(100);
    onSuccess({ action: props.action || "mock" });
  }, 120);
  activeTimers.set(file.uid, timer);
};

const appendFormValue = (formData: FormData, key: string, value: unknown): void => {
  if (Array.isArray(value)) {
    for (const item of value) appendFormValue(formData, key, item);
    return;
  }
  if (value instanceof Blob) {
    formData.append(key, value);
    return;
  }
  if (value !== undefined && value !== null) formData.append(key, String(value));
};

const parseXhrResponse = (xhr: XMLHttpRequest): unknown => {
  if (xhr.responseType === "json") return xhr.response;
  const text = xhr.responseText;
  const contentType = xhr.getResponseHeader("content-type") || "";
  if (contentType.includes("application/json") && text) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }
  return text;
};

const runXhrRequest = (options: UploadRequestOptions): void => {
  const raw = options.file.raw;
  if (!raw) {
    options.onError(new Error(locale.t("upload.missingFile")));
    return;
  }

  const xhr = new XMLHttpRequest();
  activeRequests.set(options.file.uid, xhr);
  xhr.open(options.method.toUpperCase(), options.action, true);
  xhr.withCredentials = options.withCredentials;

  if (options.headers instanceof Headers) {
    options.headers.forEach((value, key) => xhr.setRequestHeader(key, value));
  } else {
    for (const [key, value] of Object.entries(options.headers)) {
      if (value !== undefined && value !== null) xhr.setRequestHeader(key, String(value));
    }
  }

  xhr.upload.addEventListener("progress", (event) => {
    if (event.lengthComputable && event.total > 0) {
      options.onProgress((event.loaded / event.total) * 100);
    }
  });
  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) options.onSuccess(parseXhrResponse(xhr));
    else options.onError(new Error(`Upload request failed with status ${xhr.status}`));
  });
  xhr.addEventListener("error", () => options.onError(new Error(locale.t("upload.failed"))));
  xhr.addEventListener("abort", () => options.onError(new Error(locale.t("upload.cancelled"))));

  const formData = new FormData();
  for (const [key, value] of Object.entries(options.data)) appendFormValue(formData, key, value);
  formData.append(options.filename, raw, raw.name);
  xhr.send(formData);
};

const uploadChunks = async (
  file: UploadFileItem,
  onProgress: (percentage: number) => void,
  onSuccess: (response?: unknown) => void,
  onError: (error: unknown) => void,
): Promise<void> => {
  const raw = file.raw;
  if (!raw) {
    onError(new Error(locale.t("upload.missingFile")));
    return;
  }

  const chunkSize = Math.max(1, Number(props.chunkSize || 0));
  const total = Math.max(1, Math.ceil(raw.size / chunkSize));
  const chunkRequest = props.chunkRequest as
    ((options: UploadChunkRequestOptions) => void | Promise<void>) | undefined;

  try {
    for (let index = 0; index < total; index += 1) {
      const start = index * chunkSize;
      const end = Math.min(raw.size, start + chunkSize);
      const chunk = raw.slice(start, end);
      if (chunkRequest) {
        await chunkRequest({
          file,
          chunk,
          index,
          total,
          start,
          end,
          onProgress,
        });
      } else {
        await Promise.resolve();
      }
      onProgress(((index + 1) / total) * 100);
    }
    onSuccess({ action: props.action || "chunked-mock", chunks: total });
  } catch (error) {
    onError(error);
  }
};

const submit = (): void => {
  for (const file of files.value.filter((item) => item.status === "ready")) {
    void uploadFile(file);
  }
};

const removeFile = async (file: UploadFileItem): Promise<void> => {
  const guard = props.beforeRemove as
    ((file: UploadFileItem) => boolean | Promise<boolean>) | undefined;
  if (guard && (await guard(file)) === false) return;
  cancelTransfer(file.uid, false);
  releaseObjectUrl(file.uid);
  files.set(files.value.filter((item) => item.uid !== file.uid));
  emit("remove", file, [...files.value]);
  (props.onRemove as ((file: UploadFileItem, files: UploadFileItem[]) => void) | undefined)?.(
    file,
    [...files.value],
  );
  emitModel();
  notifyChange(file);
};

const previewFile = (file: UploadFileItem): void => {
  emit("preview", file);
  (props.onPreview as ((file: UploadFileItem) => void) | undefined)?.(file);
};

const clearFiles = (statuses?: UploadStatus[]): void => {
  const removed =
    !Array.isArray(statuses) || statuses.length === 0
      ? [...files.value]
      : files.value.filter((file) => statuses.includes(file.status));
  for (const file of removed) {
    cancelTransfer(file.uid, false);
    releaseObjectUrl(file.uid);
  }
  if (!Array.isArray(statuses) || statuses.length === 0) {
    files.set([]);
  } else {
    files.set(files.value.filter((file) => !statuses.includes(file.status)));
  }
  emitModel();
};

const handleStart = (rawFile: File): void => {
  void addFiles([rawFile]);
};

const handleRemove = (file: UploadFileItem | File): void => {
  const target =
    "uid" in file
      ? files.value.find((item) => item.uid === String((file as UploadFileItem).uid))
      : files.value.find((item) => item.raw === file || item.name === file.name);
  if (target) void removeFile(target);
};

const abort = (file?: UploadFileItem): void => {
  const targets = file ? files.value.filter((item) => item.uid === file.uid) : files.value;
  for (const item of targets) {
    cancelTransfer(item.uid, true);
    updateFile(item.uid, {
      status: "error",
      error: new Error(locale.t("upload.cancelled")),
      message: locale.t("upload.cancelled"),
    });
  }
};

const cancelTransfer = (uidValue: string, abortRequest: boolean): void => {
  const timer = activeTimers.get(uidValue);
  if (timer !== undefined) {
    window.clearTimeout(timer);
    activeTimers.delete(uidValue);
  }
  const request = activeRequests.get(uidValue);
  if (!request) return;
  activeRequests.delete(uidValue);
  if (abortRequest) request.abort();
};

const releaseObjectUrl = (uidValue: string): void => {
  const url = objectUrls.get(uidValue);
  if (!url) return;
  URL.revokeObjectURL(url);
  objectUrls.delete(uidValue);
};

const formatSize = (size: number): string => {
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
};

const listType = (): UploadListType => {
  const value = String(props.listType || "text");
  return value === "picture" || value === "picture-card" ? value : "text";
};

const fileIcon = (file: UploadFileItem): string => {
  if (file.status === "success") return "✓";
  if (file.status === "error") return "!";
  if (file.type?.startsWith("image/")) return "IMG";
  return "DOC";
};

const onFileActionClick = (event: Event): void => {
  event.stopPropagation();
  const target = event.target as HTMLElement | null;
  const button = target?.closest?.("[data-action]") as HTMLElement | null;
  const uidValue = button?.dataset.uid;
  const action = button?.dataset.action;
  const file = files.value.find((item) => item.uid === uidValue);
  if (!file) return;
  if (action === "preview") previewFile(file);
  if (action === "remove") void removeFile(file);
  if (action === "retry") void uploadFile(file);
};

onUnmounted(() => {
  for (const uidValue of new Set([...activeTimers.keys(), ...activeRequests.keys()])) {
    cancelTransfer(uidValue, true);
  }
  for (const uidValue of [...objectUrls.keys()]) releaseObjectUrl(uidValue);
});

defineExpose<UploadExpose>({ select, submit, clearFiles, abort, handleStart, handleRemove });

defineStyle(styles);

const Upload = defineHtml<UploadProps, UploadEmits, UploadSlots>(`
  <div class="upload">
    <input
      ref="inputEl"
      class="native"
      type="file"
      :name=${props.name}
      :accept=${props.accept}
      :multiple=${props.multiple}
      :webkitdirectory=${props.directory}
      :directory=${props.directory}
      :crossorigin=${props.crossorigin || null}
      :disabled=${isDisabled()}
      tabindex="-1"
      aria-hidden="true"
      @change=${onInputChange}
    />

    <div
      v-if=${props.drag}
      class="dropzone"
      part="dropzone"
      role="button"
      :tabindex=${isDisabled() ? -1 : 0}
      :aria-disabled=${isDisabled() ? "true" : "false"}
      @click=${select}
      @keydown=${onDropzoneKeydown}
      @drop=${onDrop}
      @dragover=${onDragOver}
    >
      <slot name="dropzone" :select=${select} :disabled=${isDisabled()}>
        <span class="drop-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v5h14v-5"></path>
          </svg>
        </span>
        <span>${locale.t("upload.drop")}</span>
      </slot>
    </div>
    <div v-if=${props.directory} class="directory-note" role="note">
      ${locale.t("upload.directoryHint")}
    </div>
    <div class="trigger" part="trigger">
      <slot name="trigger" :select=${select} :disabled=${isDisabled()}>
        <button class="button" type="button" @click=${select}>${props.buttonText || locale.t("upload.choose")}</button>
      </slot>
      <button v-if=${!props.autoUpload} class="manual" type="button" @click=${submit}>
        ${locale.t("upload.start")}
      </button>
    </div>
    <div :class=${["tip", { empty: !props.tip && !hasTipSlot }]}>
      <slot ref="tipSlotEl" name="tip" @slotchange=${syncTipSlot}>${props.tip}</slot>
    </div>
    <div v-if=${notice} class="notice" role="alert">${notice}</div>

    <div v-if=${props.showFileList} :class=${["list", "is-" + listType()]} part="list">
      <div
        v-for="file in files"
        :key="file.uid"
        :class="['file', 'is-' + file.status]"
        part="file"
      >
        <span class="thumb">
          <img
            v-if="file.type && file.type.startsWith('image/') && file.url"
            :src="file.url"
            :alt="file.name"
            :crossorigin=${props.crossorigin || null}
          />
          <span v-else>{{ fileIcon(file) }}</span>
        </span>
        <div class="meta">
          <div class="name">
            <slot name="file" :file="file" :remove=${removeFile} :preview=${previewFile}>
              {{ file.name }}
            </slot>
          </div>
          <div class="desc">{{ formatSize(file.size) }} · {{ file.message || file.status }}</div>
          <div
            v-if="file.status === 'uploading' || file.status === 'success'"
            class="progress"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="file.percentage"
          >
            <div class="bar" :style="{ width: file.percentage + '%' }"></div>
          </div>
        </div>
        <div class="actions" @click=${onFileActionClick}>
          <button
            class="icon-button"
            type="button"
            data-action="preview"
            :data-uid="file.uid"
            :aria-label=${locale.t("common.preview")}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M2.5 10s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5Z"></path>
              <circle cx="10" cy="10" r="2.25"></circle>
            </svg>
          </button>
          <button
            v-if="file.status === 'error'"
            class="icon-button"
            type="button"
            data-action="retry"
            :data-uid="file.uid"
            :aria-label=${locale.t("common.retry")}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M15.7 7.2A6.25 6.25 0 1 0 16 11"></path>
              <path d="M15.8 3.8v3.8H12"></path>
            </svg>
          </button>
          <button
            class="icon-button"
            type="button"
            data-action="remove"
            :data-uid="file.uid"
            :aria-label=${locale.t("common.remove")}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M5 5l10 10M15 5 5 15"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
`);

export { Upload };
