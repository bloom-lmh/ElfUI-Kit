// Message - 全局轻提示
//
// 函数式：
//   ElfMessage("操作成功")
//   ElfMessage.success("...")
//   ElfMessage({ message: "...", type: "warning", duration: 3000 })

import { registerComponents } from "@elfui/core";

import { Message as MessageElement } from "./component";
import { applyThemeTokens } from "../../Providers/context";
import {
  resolveServiceOptions,
  useServiceDefaults,
  type ServiceDefaultsReader,
} from "../../Providers/service-defaults";

import type {
  MessageHandle,
  MessageApi,
  MessageElement as MessageHost,
  MessageOptions,
  MessagePosition,
  MessageType,
} from "./types";

export type {
  MessageHandle,
  MessageApi,
  MessageElement,
  MessageEmits,
  MessageExpose,
  MessageOptions,
  MessagePosition,
  MessageProps,
  MessageSlots,
  MessageType,
} from "./types";

registerComponents(MessageElement);

const STACK_GAP = 12;
const DEFAULT_OFFSET = 20;
const DEFAULT_Z_INDEX = 2000;

const activeStacks: Record<MessagePosition, HTMLElement[]> = {
  top: [],
  bottom: [],
};

const normalizeType = (type?: MessageType): MessageType =>
  type === "error" ? "danger" : (type ?? "info");

const readOffset = (el: HTMLElement): number => {
  const value = Number(el.dataset.offset);
  return Number.isFinite(value) && value >= 0 ? value : DEFAULT_OFFSET;
};

const restack = (position: MessagePosition): void => {
  let offset = 0;
  for (const el of activeStacks[position]) {
    offset = Math.max(offset || DEFAULT_OFFSET, readOffset(el));
    el.style.setProperty("--_offset", `${offset}px`);
    const height = el.getBoundingClientRect().height || 36;
    offset += height + STACK_GAP;
  }
};

const removeFromStack = (el: HTMLElement, position: MessagePosition): void => {
  const stack = activeStacks[position];
  const index = stack.indexOf(el);
  if (index >= 0) stack.splice(index, 1);
  restack(position);
};

const createMessage = (
  options: MessageOptions | string,
  type?: MessageType,
  defaults?: Partial<MessageOptions>,
): MessageHandle => {
  const normalized: MessageOptions =
    typeof options === "string" ? { message: options } : { ...options };
  const opts = resolveServiceOptions(defaults, normalized);
  if (type) opts.type = type;
  const duration = opts.duration ?? 3000;
  const position: MessagePosition = opts.position === "bottom" ? "bottom" : "top";
  const messageType = normalizeType(opts.type);

  const el = document.createElement("elf-message") as MessageHost;
  el.message = opts.message;
  el.type = messageType;
  el.setAttribute("type", messageType);
  el.position = position;
  el.setAttribute("position", position);
  el.dataset.offset = String(opts.offset ?? DEFAULT_OFFSET);
  el.style.setProperty("--_z-index", String(opts.zIndex ?? DEFAULT_Z_INDEX));
  if (opts.customClass) {
    el.classList.add(...opts.customClass.split(/\s+/).filter(Boolean));
  }
  if (opts.themeTokens) applyThemeTokens(el, opts.themeTokens);
  if (opts.closable) el.closable = true;
  if (opts.action) el.action = opts.action;
  if (opts.onClick) el.addEventListener("click", opts.onClick);
  if (opts.onAction) el.addEventListener("action", opts.onAction);

  let timer: ReturnType<typeof setTimeout> | null = null;
  let state: "open" | "closing" | "removed" = "open";

  /** Removes the service host only after the component reports leave completion. */
  const finalize = (): void => {
    if (state === "removed") return;
    state = "removed";
    if (timer) clearTimeout(timer);
    timer = null;
    removeFromStack(el, position);
    el.remove();
    opts.onClose?.();
  };

  const requestClose = (): void => {
    if (state !== "open") return;
    state = "closing";
    if (timer) clearTimeout(timer);
    timer = null;
    if (typeof el.close === "function") el.close();
    else finalize();
  };

  el.addEventListener("close", finalize, { once: true });

  document.body.appendChild(el);
  activeStacks[position].push(el);
  queueMicrotask(() => restack(position));

  if (duration > 0) {
    timer = setTimeout(requestClose, duration);
  }

  return { close: requestClose };
};

const createMessageApi = (readDefaults?: ServiceDefaultsReader<"message">): MessageApi => {
  const fn = ((options: MessageOptions | string): MessageHandle =>
    createMessage(options, undefined, readDefaults?.())) as MessageApi;

  fn.info = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "info", readDefaults?.());
  fn.success = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "success", readDefaults?.());
  fn.warning = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "warning", readDefaults?.());
  fn.danger = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "danger", readDefaults?.());
  fn.error = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "error", readDefaults?.());
  fn.closeAll = () => {
    for (const position of Object.keys(activeStacks) as MessagePosition[]) {
      for (const el of [...activeStacks[position]]) {
        (el as MessageHost).close();
      }
    }
  };
  return fn;
};

export const ElfMessage = createMessageApi();

/** Returns a Message API bound to the nearest ConfigProvider. */
export const useMessage = (): MessageApi => createMessageApi(useServiceDefaults("message"));
