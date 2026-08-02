// elf-transfer 类型定义

export interface TransferDataItem {
  [key: string]: unknown;
}

export interface TransferFieldNames {
  key: string;
  label: string;
  disabled?: string;
}

export type TransferDirection = "left" | "right";
export type TransferTargetOrder = "original" | "push" | "unshift";
export interface TransferFormat {
  noChecked?: string;
  hasChecked?: string;
}

export interface TransferRenderContext {
  side: "left" | "right";
  key: string;
  label: string;
  checked: boolean;
  disabled: boolean;
}

export type TransferRenderContent = (
  item: TransferDataItem,
  context: TransferRenderContext,
) => unknown;

export interface TransferProps {
  /** 数据源 */
  data: TransferDataItem[];
  /** 选中项 key 数组（v-model） */
  modelValue: string[];
  /** 左右面板标题 */
  titles: [string, string];
  /** 是否可搜索 */
  filterable: boolean;
  /** 搜索框占位文本 */
  filterPlaceholder: string;
  filterMethod?: (query: string, item: TransferDataItem) => boolean;
  targetOrder: TransferTargetOrder;
  buttonTexts: [string, string] | string[];
  format: TransferFormat;
  leftDefaultChecked: string[];
  rightDefaultChecked: string[];
  /** 字段别名 */
  props: TransferFieldNames;
  /** 是否仅渲染可视区域内的选项 */
  virtual: boolean;
  /** 面板列表高度 */
  height: number | string;
  /** 固定选项高度 */
  itemSize: number;
  /** 可视区域上下额外渲染的选项数 */
  overscan: number;
  /** 筛选无结果或数据为空时的提示 */
  emptyText: string;
  /** 类型化内容渲染器；未提供时回退到 label 字段。 */
  renderContent?: TransferRenderContent;
}

export interface TransferSlots {
  "left-footer"?: unknown;
  "right-footer"?: unknown;
  "left-empty"?: unknown;
  "right-empty"?: unknown;
}

export interface TransferExpose {
  clearQuery(side?: "left" | "right"): void;
  scrollToItem(side: "left" | "right", key: string): void;
  leftPanel: { readonly query: string };
  rightPanel: { readonly query: string };
}
