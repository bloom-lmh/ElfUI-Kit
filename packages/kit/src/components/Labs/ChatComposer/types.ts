export interface ChatComposerLabels {
  send: string;
  stop: string;
  hint: string;
}

export interface ChatComposerProps {
  modelValue: string;
  placeholder: string;
  disabled: boolean;
  loading: boolean;
  maxlength: number;
  rows: number;
  maxRows: number;
  submitOnEnter: boolean;
  labels: Partial<ChatComposerLabels>;
  ariaLabel: string;
  autofocus: boolean;
}

export interface ChatComposerEmits {
  send: [content: string];
  stop: [];
  focus: [];
  blur: [];
}

export interface ChatComposerExpose {
  focus(): void;
  blur(): void;
  clear(): void;
  getValue(): string;
}

export type ChatComposerElement = HTMLElement & Partial<ChatComposerProps> & ChatComposerExpose;
