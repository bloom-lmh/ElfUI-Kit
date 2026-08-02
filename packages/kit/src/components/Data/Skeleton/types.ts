// elf-skeleton 类型定义

export type SkeletonVariant = "text" | "circle" | "rect" | "image";

export interface SkeletonThrottleOptions {
  /** Delay before showing the placeholder, in milliseconds. */
  leading?: number;
  /** Delay before revealing content, in milliseconds. */
  trailing?: number;
}

export type SkeletonThrottle = number | SkeletonThrottleOptions;

export interface SkeletonProps {
  /** 形状变体 */
  variant: SkeletonVariant;
  /** 宽度 */
  width: string;
  /** 高度 */
  height: string;
  /** shimmer 扫光动画 */
  animated: boolean;
  /** Number of generated placeholder groups. */
  count: number;
  /** Whether to show the skeleton template instead of default-slot content. */
  loading: boolean;
  /** Number of lines in each generated text placeholder group. */
  rows: number;
  /** Delays show/hide transitions to prevent loading flicker. */
  throttle: SkeletonThrottle;
  /** 行间距 */
  gap: string;
}
