export interface WatermarkFont {
  fontSize?: number;
  color?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "start" | "end";
}

export interface WatermarkProps {
  content: string | string[];
  image: string;
  width: number;
  height: number;
  rotate: number;
  zIndex: number;
  gapX: number;
  gapY: number;
  offsetX?: number;
  offsetY?: number;
  fontSize: number;
  fontColor: string;
  font: WatermarkFont;
  /** 将水印层附加到目标容器；内容仍留在当前组件。 */
  appendTo: string | HTMLElement | null;
  /** 监测外部水印层被删除或篡改，并在微任务中恢复。 */
  antiTamper: boolean;
}

export interface WatermarkExpose {
  refresh: () => void;
}

export interface WatermarkSlots {
  default?: unknown;
}
