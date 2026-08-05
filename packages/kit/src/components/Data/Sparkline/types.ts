export type SparklineAutoDraw = boolean | "once" | "always";
export type SparklineGradientDirection = "top" | "bottom" | "left" | "right";
export type SparklineItem = number | Record<string, unknown>;
export type SparklineSmoothMode = "default" | "monotone";
export type SparklineStrokeLinecap = "butt" | "round" | "square";
export type SparklineType = "trend" | "bar";

export interface SparklineEmits {
  "update:currentIndex": [index: number | null];
}

export interface SparklineProps {
  modelValue: SparklineItem[];
  itemValue: string;
  width: string | number;
  height: string | number;
  color: string;
  fill: boolean;
  fillColor: string;
  lineWidth: number;
  smooth: number;
  strokeLinecap: SparklineStrokeLinecap;
  animation: boolean;
  animationDuration: number;
  autoDraw: SparklineAutoDraw;
  autoDrawDuration: number;
  ariaLabel: string;
  type: SparklineType;
  gradient: string[];
  gradientDirection: SparklineGradientDirection;
  labels: string[];
  showLabels: boolean;
  labelSize: number;
  autoLineWidth: boolean;
  showMarkers: boolean;
  markerSize: number;
  markerStroke: string;
  inset: boolean;
  smoothMode: SparklineSmoothMode;
  autoDrawEasing: string;
  interactive: boolean;
  padding: number;
  min: number | null;
  max: number | null;
}
