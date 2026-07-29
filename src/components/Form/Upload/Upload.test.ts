import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../register");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface UploadEl extends HTMLElement {
  modelValue?: Array<{
    uid: string;
    name: string;
    size: number;
    type: string;
    status: "ready" | "uploading" | "success" | "error";
    percentage: number;
    message?: string;
  }>;
  fileList?: UploadEl["modelValue"];
  autoUpload?: boolean;
  multiple?: boolean;
  limit?: number;
  maxSize?: number;
  accept?: string;
  fileNamePattern?: string;
  chunkSize?: number;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  chunkRequest?: unknown;
  httpRequest?: unknown;
  action?: string;
  method?: string;
  headers?: Record<string, unknown>;
  data?: Record<string, unknown> | ((file: File) => Record<string, unknown>);
  withCredentials?: boolean;
  directory?: boolean;
  submit?: () => void;
  abort?: () => void;
  handleStart?: (file: File) => void;
  handleRemove?: (file: File) => void;
  clearFiles?: (statuses?: string[]) => void;
}

const selectFiles = async (el: UploadEl, files: File[]): Promise<void> => {
  const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
  Object.defineProperty(input, "files", { value: files, configurable: true });
  input.dispatchEvent(new Event("change"));
  await tick();
  await tick();
};

const flushTicks = async (count = 6): Promise<void> => {
  for (let i = 0; i < count; i += 1) {
    await tick();
  }
};

describe("elf-upload", () => {
  it("点击选择按钮会打开原生文件选择器", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    document.body.appendChild(el);
    await tick();
    await tick();

    const input = el.shadowRoot!.querySelector("input.native") as HTMLInputElement;
    const click = vi.spyOn(input, "click").mockImplementation(() => undefined);

    (el.shadowRoot!.querySelector(".button") as HTMLElement).click();
    await tick();

    expect(click).toHaveBeenCalledTimes(1);
  });

  it("选择文件后更新列表并触发 change", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.autoUpload = false;
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "a.txt", { type: "text/plain" })]);

    expect(el.shadowRoot!.textContent).toContain("a.txt");
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toHaveLength(1);
  });

  it("超过 limit 时触发 exceed", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.limit = 1;
    el.multiple = true;
    const onExceed = vi.fn();
    el.addEventListener("exceed", onExceed as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "a.txt"), new File(["b"], "b.txt")]);

    expect(onExceed).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelectorAll(".file")).toHaveLength(0);
  });

  it("自动上传成功后触发 success", async () => {
    vi.useFakeTimers();
    const el = document.createElement("elf-upload") as UploadEl;
    const onSuccess = vi.fn();
    el.addEventListener("success", onSuccess as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "a.txt")]);
    await vi.runAllTimersAsync();
    await tick();

    expect(onSuccess).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".file.is-success")).toBeTruthy();
  });

  it("校验 accept、文件名规则和 maxSize，并触发 invalid", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.autoUpload = false;
    el.accept = "image/*";
    el.fileNamePattern = "^avatar-";
    el.maxSize = 4;
    const onInvalid = vi.fn();
    el.addEventListener("invalid", onInvalid as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["abc"], "readme.txt", { type: "text/plain" })]);
    expect((onInvalid.mock.calls[0]![0] as CustomEvent).detail.reason).toBe("accept");
    expect(el.shadowRoot!.querySelectorAll(".file")).toHaveLength(0);

    await selectFiles(el, [new File(["abc"], "photo.png", { type: "image/png" })]);
    expect((onInvalid.mock.calls[1]![0] as CustomEvent).detail.reason).toBe("name");

    await selectFiles(el, [new File(["abcde"], "avatar-big.png", { type: "image/png" })]);
    expect((onInvalid.mock.calls[2]![0] as CustomEvent).detail.reason).toBe("size");
    expect(el.shadowRoot!.textContent).toContain("超过大小限制");
  });

  it("beforeUpload 返回 false 时显示提示并阻止加入列表", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.beforeUpload = vi.fn(() => false);
    const onInvalid = vi.fn();
    el.addEventListener("invalid", onInvalid as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "a.txt")]);

    expect((onInvalid.mock.calls[0]![0] as CustomEvent).detail.reason).toBe("before-upload");
    expect(el.shadowRoot!.textContent).toContain("未通过上传前检查");
    expect(el.shadowRoot!.querySelectorAll(".file")).toHaveLength(0);
  });

  it("手动上传只在 submit 后开始", async () => {
    vi.useFakeTimers();
    const el = document.createElement("elf-upload") as UploadEl;
    el.autoUpload = false;
    const onSuccess = vi.fn();
    el.addEventListener("success", onSuccess as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "manual.txt")]);
    expect(onSuccess).not.toHaveBeenCalled();

    el.submit?.();
    await vi.runAllTimersAsync();
    await tick();

    expect(onSuccess).toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector(".file.is-success")).toBeTruthy();
  });

  it("chunkSize 开启分片上传并汇报进度", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.chunkSize = 2;
    const onProgress = vi.fn();
    const onSuccess = vi.fn();
    el.addEventListener("progress", onProgress as EventListener);
    el.addEventListener("success", onSuccess as EventListener);
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["abcde"], "chunk.txt")]);
    await flushTicks();

    expect(onProgress).toHaveBeenCalled();
    expect((onSuccess.mock.calls[0]![0] as CustomEvent).detail[0].chunks).toBe(3);
    expect(el.shadowRoot!.querySelector(".file.is-success")).toBeTruthy();
  });

  it("chunkRequest receives every real file slice with stable boundaries", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.chunkSize = 2;
    const chunks: Array<{ index: number; total: number; start: number; end: number; size: number }> = [];
    el.chunkRequest = vi.fn((options) => {
      chunks.push({
        index: options.index,
        total: options.total,
        start: options.start,
        end: options.end,
        size: options.chunk.size
      });
    });
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["abcde"], "chunk.txt")]);
    await flushTicks();

    expect(chunks).toEqual([
      { index: 0, total: 3, start: 0, end: 2, size: 2 },
      { index: 1, total: 3, start: 2, end: 4, size: 2 },
      { index: 2, total: 3, start: 4, end: 5, size: 1 }
    ]);
  });

  it("httpRequest 接收 Element Plus 风格请求参数", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    const httpRequest = vi.fn((options) => {
      options.onProgress(50);
      options.onSuccess({ ok: true });
    });
    el.action = "/upload";
    el.method = "put";
    el.headers = { token: "abc" };
    el.data = (file: File) => ({ filename: file.name });
    el.withCredentials = true;
    el.httpRequest = httpRequest;
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "request.txt")]);
    await flushTicks();

    expect(httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "/upload",
        method: "put",
        filename: "file",
        data: { filename: "request.txt" },
        headers: { token: "abc" },
        withCredentials: true
      })
    );
    expect(el.shadowRoot!.querySelector(".file.is-success")).toBeTruthy();
  });

  it("fileList 别名参与受控同步并发出 update:fileList", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.autoUpload = false;
    el.fileList = [{
      uid: "controlled-1",
      name: "controlled.txt",
      size: 10,
      type: "text/plain",
      status: "ready",
      percentage: 0
    }];
    const onUpdate = vi.fn();
    el.addEventListener("update:fileList", onUpdate as unknown as EventListener);
    document.body.appendChild(el);
    await flushTicks();

    expect(el.shadowRoot!.textContent).toContain("controlled.txt");
    await selectFiles(el, [new File(["b"], "next.txt")]);
    expect((onUpdate.mock.calls.at(-1)![0] as CustomEvent).detail).toHaveLength(2);
  });

  it("action 使用真实 XHR，并可通过 abort 取消请求", async () => {
    let request: MockXhr | undefined;
    class MockXhr extends EventTarget {
      upload = new EventTarget();
      status = 0;
      responseType: XMLHttpRequestResponseType = "";
      responseText = "";
      withCredentials = false;
      open = vi.fn();
      setRequestHeader = vi.fn();
      send = vi.fn();
      constructor() {
        super();
        request = this;
      }
      getResponseHeader(): string | null {
        return null;
      }
      abort(): void {
        this.dispatchEvent(new Event("abort"));
      }
    }
    vi.stubGlobal("XMLHttpRequest", MockXhr);

    const el = document.createElement("elf-upload") as UploadEl;
    el.action = "/api/upload";
    document.body.appendChild(el);
    await tick();
    await selectFiles(el, [new File(["a"], "xhr.txt", { type: "text/plain" })]);
    await flushTicks();

    expect(request?.open).toHaveBeenCalledWith("POST", "/api/upload", true);
    expect(request?.send).toHaveBeenCalledWith(expect.any(FormData));
    el.abort?.();
    await tick();
    expect(el.shadowRoot!.querySelector(".file.is-error")).toBeTruthy();
  });

  it("directory 会透传目录选择属性并保留选择入口", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.directory = true;
    document.body.appendChild(el);
    await tick();
    await tick();

    const input = el.shadowRoot!.querySelector("input.native") as HTMLInputElement;
    expect(input.hasAttribute("webkitdirectory")).toBe(true);
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".button");
    expect(trigger).toBeTruthy();
    const click = vi.spyOn(input, "click").mockImplementation(() => undefined);
    trigger!.click();
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("handleStart / handleRemove / clearFiles 暴露方法可控制列表", async () => {
    const el = document.createElement("elf-upload") as UploadEl;
    el.autoUpload = false;
    document.body.appendChild(el);
    await tick();

    const file = new File(["a"], "manual-api.txt");
    el.handleStart?.(file);
    await flushTicks();
    expect(el.shadowRoot!.textContent).toContain("manual-api.txt");

    el.handleRemove?.(file);
    await flushTicks();
    expect(el.shadowRoot!.textContent).not.toContain("manual-api.txt");

    el.handleStart?.(new File(["b"], "clear-ready.txt"));
    await flushTicks();
    el.clearFiles?.(["ready"]);
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".file")).toHaveLength(0);
  });

  it("abort 会取消模拟上传并标记错误", async () => {
    vi.useFakeTimers();
    const el = document.createElement("elf-upload") as UploadEl;
    document.body.appendChild(el);
    await tick();

    await selectFiles(el, [new File(["a"], "abort.txt")]);
    el.abort?.();
    await tick();
    await vi.runAllTimersAsync();
    await tick();

    expect(el.shadowRoot!.querySelector(".file.is-error")).toBeTruthy();
    expect(el.shadowRoot!.textContent).toContain("上传已取消");
  });

  it("renders a retry action for failed files and can upload them again", async () => {
    vi.useFakeTimers();
    const el = document.createElement("elf-upload") as UploadEl;
    el.modelValue = [{
      uid: "failed-1",
      name: "failed.csv",
      size: 128,
      type: "text/csv",
      status: "error",
      percentage: 35,
      message: "网络中断"
    }];
    document.body.appendChild(el);
    await tick();

    const retry = el.shadowRoot!.querySelector('[data-action="retry"]') as HTMLButtonElement;
    expect(retry).not.toBeNull();
    expect(retry.querySelector("svg")).not.toBeNull();
    retry.click();
    await tick();
    expect(el.shadowRoot!.querySelector(".file.is-uploading")).not.toBeNull();

    await vi.runAllTimersAsync();
    await tick();
    expect(el.shadowRoot!.querySelector(".file.is-success")).not.toBeNull();
  });
});
