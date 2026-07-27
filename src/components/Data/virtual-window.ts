export interface VirtualWindowOptions {
  count: number;
  itemSize: number;
  viewportSize: number;
  scrollOffset: number;
  overscan?: number;
}

export interface VirtualWindow {
  start: number;
  end: number;
  offset: number;
  totalSize: number;
}

export interface VariableVirtualWindowOptions {
  /** Cumulative row offsets. The first value must be 0 and length is row count + 1. */
  offsets: readonly number[];
  viewportSize: number;
  scrollOffset: number;
  overscan?: number;
}

const finite = (value: number, fallback = 0): number =>
  Number.isFinite(value) ? value : fallback;

/** Calculates a fixed-size virtual window. `end` is exclusive. */
export const computeVirtualWindow = (options: VirtualWindowOptions): VirtualWindow => {
  const count = Math.max(0, Math.floor(finite(options.count)));
  const itemSize = Math.max(1, finite(options.itemSize, 1));
  const viewportSize = Math.max(0, finite(options.viewportSize));
  const overscan = Math.max(0, Math.floor(finite(options.overscan ?? 4)));
  const maxOffset = Math.max(0, count * itemSize - viewportSize);
  const scrollOffset = Math.min(Math.max(0, finite(options.scrollOffset)), maxOffset);
  const visibleStart = Math.floor(scrollOffset / itemSize);
  const visibleCount = Math.max(1, Math.ceil(viewportSize / itemSize));
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(count, visibleStart + visibleCount + overscan);

  return { start, end, offset: start * itemSize, totalSize: count * itemSize };
};

const indexAtOffset = (offsets: readonly number[], offset: number): number => {
  let low = 0;
  let high = Math.max(0, offsets.length - 2);
  while (low <= high) {
    const middle = (low + high) >> 1;
    if ((offsets[middle + 1] ?? 0) <= offset) low = middle + 1;
    else high = middle - 1;
  }
  return Math.max(0, Math.min(offsets.length - 2, low));
};

/** Calculates a virtual window from cumulative, variable-size row offsets. */
export const computeVariableVirtualWindow = (options: VariableVirtualWindowOptions): VirtualWindow => {
  const count = Math.max(0, options.offsets.length - 1);
  if (count === 0) return { start: 0, end: 0, offset: 0, totalSize: 0 };
  const totalSize = Math.max(0, finite(options.offsets[count] ?? 0));
  const viewportSize = Math.max(0, finite(options.viewportSize));
  const scrollOffset = Math.min(Math.max(0, finite(options.scrollOffset)), Math.max(0, totalSize - viewportSize));
  const overscan = Math.max(0, Math.floor(finite(options.overscan ?? 4)));
  const visibleStart = indexAtOffset(options.offsets, scrollOffset);
  const visibleEnd = indexAtOffset(options.offsets, Math.min(totalSize, scrollOffset + viewportSize)) + 1;
  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(count, visibleEnd + overscan);
  return { start, end, offset: options.offsets[start] ?? 0, totalSize };
};
