import type { ThemeTokens } from "../../Providers/context";

export type MessageBoxAction = "confirm" | "cancel" | "close";
export type MessageBoxType = "info" | "success" | "warning" | "error";
export type MessageBoxAppendTarget = string | HTMLElement;
export type MessageBoxContent = string | Node | (() => Node);

export interface MessageBoxActionDetail {
  action: MessageBoxAction;
  value: string;
}

export type MessageBoxInputValidator = (
  value: string,
) => boolean | string | Promise<boolean | string>;

export type MessageBoxBeforeClose = (
  action: MessageBoxAction,
  value: string,
) => boolean | Promise<boolean>;

export interface MessageBoxOptions {
  title?: string;
  message?: MessageBoxContent;
  type?: MessageBoxType;
  icon?: string;
  autofocus?: boolean;
  center?: boolean;
  modal?: boolean;
  showClose?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  closeOnHashChange?: boolean;
  distinguishCancelAndClose?: boolean;
  lockScroll?: boolean;
  showInput?: boolean;
  inputValue?: string;
  inputType?: string;
  inputPlaceholder?: string;
  inputPattern?: RegExp;
  inputValidator?: MessageBoxInputValidator;
  inputErrorMessage?: string;
  beforeClose?: MessageBoxBeforeClose;
  customClass?: string;
  appendTo?: MessageBoxAppendTarget;
  zIndex?: number;
  themeTokens?: ThemeTokens;
  callback?: (action: MessageBoxAction, value: string) => void;
}

export interface MessageBoxResult {
  action: "confirm";
  value: string;
}

export interface MessageBoxProps {
  title: string;
  message: string;
  type: MessageBoxType;
  icon: string;
  autofocus: boolean;
  center: boolean;
  modal: boolean;
  showClose: boolean;
  showCancelButton: boolean;
  showConfirmButton: boolean;
  cancelButtonText: string;
  confirmButtonText: string;
  closeOnClickModal: boolean;
  closeOnPressEscape: boolean;
  lockScroll: boolean;
  showInput: boolean;
  inputValue: string;
  inputType: string;
  inputPlaceholder: string;
}

export interface MessageBoxEmits {
  action: [detail: MessageBoxActionDetail];
  closed: [];
}

export interface MessageBoxSlots {
  default?: unknown;
}

export interface MessageBoxExpose {
  close: () => void;
  setInputError: (message: string) => void;
  setPending: (action: MessageBoxAction, pending: boolean) => void;
  startClose: (action?: MessageBoxAction) => void;
}

export type MessageBoxElement = HTMLElement &
  MessageBoxExpose &
  Partial<MessageBoxProps>;

export interface MessageBoxApi {
  (options: MessageBoxOptions): Promise<MessageBoxResult>;
  alert(
    message: MessageBoxContent,
    title?: string | Omit<MessageBoxOptions, "message" | "title">,
    options?: Omit<MessageBoxOptions, "message" | "title">,
  ): Promise<MessageBoxResult>;
  confirm(
    message: MessageBoxContent,
    title?: string | Omit<MessageBoxOptions, "message" | "title">,
    options?: Omit<MessageBoxOptions, "message" | "title">,
  ): Promise<MessageBoxResult>;
  prompt(
    message: MessageBoxContent,
    title?: string | Omit<MessageBoxOptions, "message" | "title">,
    options?: Omit<MessageBoxOptions, "message" | "title">,
  ): Promise<MessageBoxResult>;
  closeAll(): void;
}
