export interface HeatmapAxisItem {
  key: string;
  label: string;
}

export interface HeatmapItem {
  row: string;
  column: string;
  value: number | null;
  label?: string;
  disabled?: boolean;
}

export interface HeatmapThreshold {
  max: number;
  color: string;
  label?: string;
}

export interface HeatmapCellDetail {
  item: HeatmapItem;
  row: HeatmapAxisItem;
  column: HeatmapAxisItem;
}

export interface HeatmapProps {
  items: HeatmapItem[];
  rows: HeatmapAxisItem[];
  columns: HeatmapAxisItem[];
  thresholds: HeatmapThreshold[];
  min: number | undefined;
  max: number | undefined;
  cellSize: number;
  gap: number;
  rounded: number;
  showRowHeaders: boolean;
  showColumnHeaders: boolean;
  legend: boolean;
  legendInteractive: boolean;
  lessText: string;
  moreText: string;
  legendAriaLabel: string;
  hover: boolean;
  emptyColor: string;
  ariaLabel: string;
}

export interface HeatmapEmits {
  "cell-click": [detail: HeatmapCellDetail];
  "cell-focus": [detail: HeatmapCellDetail];
  "legend-change": [threshold: HeatmapThreshold | null];
}

export interface HeatmapExpose {
  focusCell(row: string, column: string): void;
  getCell(row: string, column: string): HTMLButtonElement | null;
  clearLegendFilter(): void;
}

export type HeatmapElement = HTMLElement & HeatmapProps & HeatmapExpose;
