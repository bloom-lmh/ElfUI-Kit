export type SparklineAutoDraw = boolean | "once" | "always";
export type SparklineStrokeLinecap = "butt" | "round" | "square";

export interface SparklineProps {
  modelValue: number[];
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
}
