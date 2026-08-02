import { registerComponents } from "@elfui/core";

import { Notification as NotificationElement } from "./component";
import {
  resolveServiceOptions,
  useServiceDefaults,
  type ServiceDefaultsReader,
} from "../../Providers/service-defaults";
import type {
  NotificationApi,
  NotificationAppendTarget,
  NotificationHandle,
  NotificationOptions,
  NotificationPosition,
  NotificationType,
} from "./types";

export type {
  NotificationApi,
  NotificationAppendTarget,
  NotificationContent,
  NotificationHandle,
  NotificationOptions,
  NotificationPosition,
  NotificationType,
} from "./types";

registerComponents(NotificationElement);

const STACK_GAP = 16;

interface ActiveNotification {
  el: HTMLElement;
  baseOffset: number;
}

const activeStacks: Record<NotificationPosition, ActiveNotification[]> = {
  "top-right": [],
  "top-left": [],
  "bottom-right": [],
  "bottom-left": [],
};

const restack = (position: NotificationPosition): void => {
  const stack = activeStacks[position];
  let offset = stack[0]?.baseOffset ?? 16;
  for (const entry of stack) {
    entry.el.style.setProperty("--_offset", `${offset}px`);
    offset += (entry.el.getBoundingClientRect().height || 80) + STACK_GAP;
  }
};

const removeFromStack = (el: HTMLElement, position: NotificationPosition): void => {
  const stack = activeStacks[position];
  const index = stack.findIndex((entry) => entry.el === el);
  if (index >= 0) stack.splice(index, 1);
  restack(position);
};

const resolveAppendTarget = (target: NotificationAppendTarget | undefined): HTMLElement => {
  if (target instanceof Element) return target as HTMLElement;
  if (typeof target === "string") {
    try {
      const found = document.querySelector<HTMLElement>(target);
      if (found) return found;
    } catch {
      // An invalid selector should not prevent a notification from being displayed.
    }
  }
  return document.body;
};

interface NotificationEl extends HTMLElement {
  titleText?: string;
  message?: string;
  type?: NotificationType;
  icon?: string;
  position?: NotificationPosition;
  closable?: boolean;
  showClose?: boolean;
  closeIcon?: string;
  close?: () => void;
}

const createNotification = (
  options: NotificationOptions | string,
  forcedType?: NotificationType,
  defaults?: Partial<NotificationOptions>,
): NotificationHandle => {
  const normalized: NotificationOptions =
    typeof options === "string" ? { message: options } : { ...options };
  const opts = resolveServiceOptions(defaults, normalized);
  if (forcedType) opts.type = forcedType;

  const position: NotificationPosition = opts.position ?? "top-right";
  const duration = Math.max(0, Number(opts.duration ?? 4500) || 0);
  const baseOffset = Math.max(0, Number(opts.offset ?? 16) || 0);
  const target = resolveAppendTarget(opts.appendTo);
  const el = document.createElement("elf-notification") as NotificationEl;
  const content = typeof opts.message === "function" ? opts.message() : opts.message;
  if (content instanceof Node) {
    el.message = "";
    el.appendChild(content);
  } else {
    // Strings stay text-only; the service never parses them as HTML.
    el.message = String(content ?? "");
  }
  el.position = position;
  el.setAttribute("position", position);
  if (opts.title) {
    el.titleText = opts.title;
    el.setAttribute("title-text", opts.title);
  }
  if (opts.type) {
    el.type = opts.type;
    el.setAttribute("type", opts.type);
  }
  if (opts.icon) {
    el.icon = opts.icon;
    el.setAttribute("icon", opts.icon);
  }
  if (opts.showClose === false || opts.closable === false) {
    el.closable = false;
    el.setAttribute("closable", "false");
  }
  if (opts.closeIcon) {
    el.closeIcon = opts.closeIcon;
    el.setAttribute("close-icon", opts.closeIcon);
  }
  if (opts.customClass) {
    for (const className of opts.customClass.split(/\s+/)) {
      if (className) el.classList.add(className);
    }
  }
  if (opts.zIndex != null && Number.isFinite(Number(opts.zIndex))) {
    el.style.zIndex = String(Math.trunc(Number(opts.zIndex)));
  }

  let timer: ReturnType<typeof setTimeout> | null = null;
  let removed = false;
  const remove = (): void => {
    if (removed) return;
    removed = true;
    if (timer) clearTimeout(timer);
    removeFromStack(el, position);
    if (typeof el.close === "function") el.close();
    else el.setAttribute("data-closing", "");
    setTimeout(() => el.parentNode?.removeChild(el), 220);
  };

  el.addEventListener("close", remove);
  if (opts.onClose) el.addEventListener("close", () => opts.onClose?.(), { once: true });
  if (opts.onClick) el.addEventListener("click", opts.onClick);

  target.appendChild(el);
  activeStacks[position].push({ el, baseOffset });
  queueMicrotask(() => restack(position));
  if (duration > 0) timer = setTimeout(remove, duration);
  return { close: remove };
};

const createNotificationApi = (
  readDefaults?: ServiceDefaultsReader<"notification">,
): NotificationApi => {
  const fn = ((options: NotificationOptions | string): NotificationHandle =>
    createNotification(options, undefined, readDefaults?.())) as NotificationApi;
  fn.info = (options) => createNotification(options, "info", readDefaults?.());
  fn.success = (options) => createNotification(options, "success", readDefaults?.());
  fn.warning = (options) => createNotification(options, "warning", readDefaults?.());
  fn.error = (options) => createNotification(options, "error", readDefaults?.());
  fn.closeAll = (): void => {
    for (const position of Object.keys(activeStacks) as NotificationPosition[]) {
      for (const entry of [...activeStacks[position]])
        entry.el.dispatchEvent(new CustomEvent("close"));
    }
  };
  return fn;
};

export const ElfNotification = createNotificationApi();

/** Returns a Notification API bound to the nearest ConfigProvider. */
export const useNotification = (): NotificationApi =>
  createNotificationApi(useServiceDefaults("notification"));
