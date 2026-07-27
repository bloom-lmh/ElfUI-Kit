// Message - 全局轻提示
//
// 函数式：
//   ElfMessage("操作成功")
//   ElfMessage.success("...")
//   ElfMessage({ message: "...", type: "warning", duration: 3000 })

import { registerComponents } from "@elfui/core";

import { Message as MessageElement } from "./component";
import { applyThemeTokens } from "../../Providers/context";

import type {
    MessageHandle,
    MessageOptions,
    MessagePosition,
    MessageType,
} from "./types";

export type {
    MessageHandle,
    MessageOptions,
    MessagePosition,
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

interface MessageEl extends HTMLElement {
    message?: string;
    type?: MessageType;
    position?: MessagePosition;
    closable?: boolean;
    action?: string;
    close?: () => void;
}

const createMessage = (
    options: MessageOptions | string,
    type?: MessageType,
): MessageHandle => {
    const opts: MessageOptions =
        typeof options === "string" ? { message: options } : { ...options };
    if (type) opts.type = type;
    const duration = opts.duration ?? 3000;
    const position: MessagePosition =
        opts.position === "bottom" ? "bottom" : "top";
    const messageType = normalizeType(opts.type);

    const el = document.createElement("elf-message") as MessageEl;
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
    let removed = false;

    const remove = (playClose = true): void => {
        if (removed) return;
        removed = true;

        if (playClose && typeof el.close === "function") {
            el.close();
        }
        el.setAttribute("data-closing", "");

        if (timer) clearTimeout(timer);
        removeFromStack(el, position);

        setTimeout(() => {
            el.parentNode?.removeChild(el);
            opts.onClose?.();
        }, 220);
    };

    el.addEventListener("close", () => remove(false));

    document.body.appendChild(el);
    activeStacks[position].push(el);
    queueMicrotask(() => restack(position));

    if (duration > 0) {
        timer = setTimeout(remove, duration);
    }

    return { close: remove };
};

interface MessageApi {
    (options: MessageOptions | string): MessageHandle;
    info(
        message: string,
        options?: Omit<MessageOptions, "message" | "type">,
    ): MessageHandle;
    success(
        message: string,
        options?: Omit<MessageOptions, "message" | "type">,
    ): MessageHandle;
    warning(
        message: string,
        options?: Omit<MessageOptions, "message" | "type">,
    ): MessageHandle;
    danger(
        message: string,
        options?: Omit<MessageOptions, "message" | "type">,
    ): MessageHandle;
    error(
        message: string,
        options?: Omit<MessageOptions, "message" | "type">,
    ): MessageHandle;
    closeAll(): void;
}

const fn = ((options: MessageOptions | string): MessageHandle =>
    createMessage(options)) as MessageApi;

fn.info = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "info");
fn.success = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "success");
fn.warning = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "warning");
fn.danger = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "danger");
fn.error = (message, options) =>
    createMessage({ ...(options ?? {}), message }, "error");
fn.closeAll = () => {
    for (const position of Object.keys(activeStacks) as MessagePosition[]) {
        for (const el of [...activeStacks[position]]) {
            const message = el as MessageEl;
            if (typeof message.close === "function") {
                message.close();
            } else {
                el.dispatchEvent(new CustomEvent("close"));
            }
        }
    }
};

export const ElfMessage: MessageApi = fn;
