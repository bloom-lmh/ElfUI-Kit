import type { FieldVariant } from "../../../types/field";

export interface AutocompleteOption {
  value?: string;
  label?: string;
  disabled?: boolean;
}

export type AutocompletePlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end";

export type AutocompleteVariant = FieldVariant;

export type AutocompleteFetchSuggestions = (
  query: string,
  callback: (items: AutocompleteOption[]) => void
) => void | Promise<AutocompleteOption[]>;

export interface AutocompletePopperModifier {
  name: string;
  enabled?: boolean;
  options?: {
    offset?: [number, number];
    padding?: number;
    [key: string]: unknown;
  };
}

export interface AutocompletePopperOptions {
  placement?: AutocompletePlacement;
  modifiers?: AutocompletePopperModifier[];
  [key: string]: unknown;
}

export interface AutocompleteProps {
  modelValue: string;
  options: AutocompleteOption[];
  fetchSuggestions?: AutocompleteFetchSuggestions;
  placeholder: string;
  label: string;
  variant: AutocompleteVariant;
  backgroundColor: string;
  disabled: boolean;
  clearable: boolean;
  triggerOnFocus: boolean;
  debounce: number;
  highlightFirstItem: boolean;
  /** 当输入值不存在于候选项时允许创建新项 */
  allowCreate: boolean;
  /** 创建项前缀文案 */
  createText: string;
  /** 长列表启用固定高度虚拟滚动 */
  virtual: boolean;
  /** 虚拟列表单项高度 */
  itemHeight: number;
  /** 建议列表最大高度 */
  maxHeight: number;
  /** 虚拟列表视口外预渲染条数 */
  overscan: number;
  loading: boolean;
  loadingText: string;
  noDataText: string;
  errorText: string;
  placement: AutocompletePlacement;
  popperClass: string;
  popperStyle: Record<string, string | number>;
  popperOptions: AutocompletePopperOptions;
  teleported: boolean;
  appendTo: string | HTMLElement;
  fitInputWidth: boolean;
  id: string;
  name: string;
  ariaLabel: string;
  validateEvent: boolean;
}

export interface AutocompleteExpose {
  close: () => void;
}

export type AutocompleteElement = HTMLElement & AutocompleteExpose & Partial<AutocompleteProps>;
