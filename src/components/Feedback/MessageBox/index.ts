import { registerComponents } from "@elfui/core";

import { applyThemeTokens } from "../../Providers/context";
import {
  resolveServiceOptions,
  useServiceDefaults,
  type ServiceDefaultsReader,
} from "../../Providers/service-defaults";
import { MessageBox as MessageBoxElement } from "./component";
import type {
  MessageBoxAction,
  MessageBoxApi,
  MessageBoxAppendTarget,
  MessageBoxContent,
  MessageBoxElement as MessageBoxHost,
  MessageBoxOptions,
  MessageBoxResult,
} from "./types";

export type {
  MessageBoxAction,
  MessageBoxActionDetail,
  MessageBoxApi,
  MessageBoxAppendTarget,
  MessageBoxBeforeClose,
  MessageBoxContent,
  MessageBoxElement,
  MessageBoxEmits,
  MessageBoxExpose,
  MessageBoxInputValidator,
  MessageBoxOptions,
  MessageBoxProps,
  MessageBoxResult,
  MessageBoxSlots,
  MessageBoxType,
} from "./types";

registerComponents(MessageBoxElement);

const DEFAULT_Z_INDEX = 10000;
const activeBoxes = new Set<MessageBoxHost>();

const resolveAppendTarget = (target: MessageBoxAppendTarget | undefined): HTMLElement => {
  if (target instanceof HTMLElement) return target;
  if (typeof target === "string") {
    try {
      const matched = document.querySelector<HTMLElement>(target);
      if (matched) return matched;
    } catch {
      // Invalid selectors fall back to document.body.
    }
  }
  return document.body;
};

const normalizeArgs = (
  message: MessageBoxContent,
  titleOrOptions?: string | Omit<MessageBoxOptions, "message" | "title">,
  options?: Omit<MessageBoxOptions, "message" | "title">,
): MessageBoxOptions => ({
  ...(typeof titleOrOptions === "object" ? titleOrOptions : options),
  message,
  ...(typeof titleOrOptions === "string" ? { title: titleOrOptions } : {}),
});

const contentNode = (content: MessageBoxContent | undefined): Node | null => {
  if (typeof content === "function") return content();
  return content instanceof Node ? content : null;
};

const normalizeAction = (action: MessageBoxAction, distinguish: boolean): MessageBoxAction =>
  action === "close" && !distinguish ? "cancel" : action;

const validateInput = async (options: MessageBoxOptions, value: string): Promise<string> => {
  if (options.inputPattern) {
    options.inputPattern.lastIndex = 0;
  }
  if (options.inputPattern && !options.inputPattern.test(value)) {
    return options.inputErrorMessage || "Invalid input";
  }
  if (!options.inputValidator) return "";
  try {
    const result = await options.inputValidator(value);
    if (result === true) return "";
    if (typeof result === "string") return result;
    return options.inputErrorMessage || "Invalid input";
  } catch {
    return options.inputErrorMessage || "Invalid input";
  }
};

const createMessageBox = (
  input: MessageBoxOptions,
  defaults?: Partial<MessageBoxOptions>,
): Promise<MessageBoxResult> => {
  const options = resolveServiceOptions(defaults, input);
  const host = document.createElement("elf-message-box") as MessageBoxHost;
  const node = contentNode(options.message);

  host.title = options.title ?? "";
  host.message = node ? "" : String(options.message ?? "");
  host.type = options.type ?? "info";
  host.icon = options.icon ?? "";
  host.autofocus = options.autofocus !== false;
  host.center = Boolean(options.center);
  host.modal = options.modal !== false;
  host.showClose = options.showClose !== false;
  host.showCancelButton = Boolean(options.showCancelButton);
  host.showConfirmButton = options.showConfirmButton !== false;
  host.cancelButtonText = options.cancelButtonText ?? "";
  host.confirmButtonText = options.confirmButtonText ?? "";
  host.closeOnClickModal = options.closeOnClickModal !== false;
  host.closeOnPressEscape = options.closeOnPressEscape !== false;
  host.lockScroll = options.lockScroll !== false;
  host.showInput = Boolean(options.showInput);
  host.inputValue = options.inputValue ?? "";
  host.inputType = options.inputType ?? "text";
  host.inputPlaceholder = options.inputPlaceholder ?? "";
  host.style.setProperty("--_message-box-z-index", String(options.zIndex ?? DEFAULT_Z_INDEX));

  if (options.customClass) {
    host.classList.add(...options.customClass.split(/\s+/).filter(Boolean));
  }
  if (options.themeTokens) applyThemeTokens(host, options.themeTokens);
  if (node) host.appendChild(node);

  const target = resolveAppendTarget(options.appendTo);
  target.appendChild(host);
  activeBoxes.add(host);

  return new Promise<MessageBoxResult>((resolve, reject) => {
    let action: MessageBoxAction = "close";
    let value = options.inputValue ?? "";
    let settled = false;

    const cleanup = (): void => {
      window.removeEventListener("hashchange", onHashChange);
      activeBoxes.delete(host);
      host.remove();
    };

    const settle = (): void => {
      if (settled) return;
      settled = true;
      cleanup();
      const finalAction = normalizeAction(action, Boolean(options.distinguishCancelAndClose));
      options.callback?.(finalAction, value);
      if (finalAction === "confirm") {
        resolve({ action: "confirm", value });
      } else {
        reject(finalAction);
      }
    };

    const finish = (nextAction: MessageBoxAction, nextValue: string): void => {
      if (!host.startClose(nextAction)) return;
      action = nextAction;
      value = nextValue;
    };

    const onAction = async (event: Event): Promise<void> => {
      const detail = (event as CustomEvent).detail as {
        action: MessageBoxAction;
        value: string;
      };
      if (!detail || settled) return;

      if (detail.action === "confirm" && options.showInput) {
        host.setPending("confirm", true);
        const error = await validateInput(options, detail.value);
        if (settled) return;
        host.setPending("confirm", false);
        if (error) {
          host.setInputError(error);
          return;
        }
      }

      if (options.beforeClose) {
        host.setPending(detail.action, true);
        let allowed = false;
        try {
          allowed = (await options.beforeClose(detail.action, detail.value)) !== false;
        } catch {
          allowed = false;
        }
        if (settled) return;
        host.setPending(detail.action, false);
        if (!allowed) return;
      }

      finish(detail.action, detail.value);
    };

    const onHashChange = (): void => finish("close", value);

    host.addEventListener("action", (event) => void onAction(event));
    host.addEventListener("closed", settle, { once: true });
    if (options.closeOnHashChange !== false) {
      window.addEventListener("hashchange", onHashChange, { once: true });
    }
  });
};

const createMessageBoxApi = (readDefaults?: ServiceDefaultsReader<"messageBox">): MessageBoxApi => {
  const open = ((options: MessageBoxOptions): Promise<MessageBoxResult> =>
    createMessageBox(options, readDefaults?.())) as MessageBoxApi;

  open.alert = (message, title, options) =>
    createMessageBox(
      {
        ...normalizeArgs(message, title, options),
        showCancelButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      },
      readDefaults?.(),
    );
  open.confirm = (message, title, options) =>
    createMessageBox(
      {
        showCancelButton: true,
        ...normalizeArgs(message, title, options),
      },
      readDefaults?.(),
    );
  open.prompt = (message, title, options) =>
    createMessageBox(
      {
        showCancelButton: true,
        showInput: true,
        ...normalizeArgs(message, title, options),
      },
      readDefaults?.(),
    );
  open.closeAll = (): void => {
    for (const host of [...activeBoxes]) host.close();
  };
  return open;
};

export const ElfMessageBox = createMessageBoxApi();

/** Returns a MessageBox API bound to the nearest ConfigProvider. */
export const useMessageBox = (): MessageBoxApi =>
  createMessageBoxApi(useServiceDefaults("messageBox"));
