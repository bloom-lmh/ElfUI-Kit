import {
  getElementScrollPosition,
  getMaxScrollPosition,
  getScrollPosition,
  resolveScrollContainer,
  resolveScrollTarget,
  setScrollPosition,
  type ScrollAxis,
  type ScrollContainer,
  type ScrollContainerTarget,
  type ScrollRoot,
  type ScrollTarget,
} from "./scroll";

export type GoToEasingName =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutCubic";

export type GoToEasing =
  | GoToEasingName
  | ((progress: number) => number);

export interface GoToOptions {
  container?: ScrollContainerTarget;
  root?: ScrollRoot | null;
  axis?: ScrollAxis;
  offset?: number;
  duration?: number;
  easing?: GoToEasing;
  reducedMotion?: boolean;
}

export type GoToDefaults = Omit<GoToOptions, "root" | "reducedMotion">;

export type GoToStatus = "completed" | "cancelled" | "not-found";

export interface GoToResult {
  status: GoToStatus;
  position: number;
}

export interface GoToTask {
  readonly finished: Promise<GoToResult>;
  cancel(): void;
}

export type GoTo = (
  target: ScrollTarget,
  options?: GoToOptions,
) => GoToTask;

const DEFAULT_DURATION = 300;
const activeTasks = new WeakMap<object, () => void>();

const easings: Record<GoToEasingName, (progress: number) => number> = {
  linear: (progress) => progress,
  "ease-in": (progress) => progress * progress,
  "ease-out": (progress) => 1 - (1 - progress) ** 2,
  "ease-in-out": (progress) =>
    progress < 0.5
      ? 2 * progress * progress
      : 1 - ((-2 * progress + 2) ** 2) / 2,
  easeInQuad: (progress) => progress * progress,
  easeOutQuad: (progress) => 1 - (1 - progress) ** 2,
  easeInOutCubic: (progress) =>
    progress < 0.5
      ? 4 * progress ** 3
      : 1 - ((-2 * progress + 2) ** 3) / 2,
};

const finiteNumber = (value: unknown, fallback: number): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const resolveEasing = (
  easing: GoToEasing | undefined,
): ((progress: number) => number) =>
  typeof easing === "function"
    ? easing
    : easings[easing ?? "easeInOutCubic"] ?? easings.easeInOutCubic;

const resolvedTask = (result: GoToResult): GoToTask => ({
  finished: Promise.resolve(result),
  cancel: () => undefined,
});

const targetPosition = (
  target: ScrollTarget,
  container: ScrollContainer,
  options: GoToOptions,
): number | null => {
  const resolved = resolveScrollTarget(target, options.root);
  if (resolved === null) return null;
  const raw = typeof resolved === "number"
    ? resolved
    : getElementScrollPosition(resolved, container, options.axis);
  const offset = finiteNumber(options.offset, 0);
  const position = raw - offset;
  const maximum = getMaxScrollPosition(container, options.axis);
  return maximum > 0
    ? Math.min(maximum, Math.max(0, position))
    : Math.max(0, position);
};

export const goTo: GoTo = (target, options = {}) => {
  const container = resolveScrollContainer(options.container, options.root);
  if (!container) return resolvedTask({ status: "not-found", position: 0 });

  const position = targetPosition(target, container, options);
  if (position === null) {
    return resolvedTask({
      status: "not-found",
      position: getScrollPosition(container, options.axis),
    });
  }

  activeTasks.get(container)?.();

  const start = getScrollPosition(container, options.axis);
  const duration = options.reducedMotion
    ? 0
    : Math.max(0, finiteNumber(options.duration, DEFAULT_DURATION));
  if (
    duration === 0 ||
    Math.abs(position - start) < 0.5 ||
    typeof requestAnimationFrame !== "function"
  ) {
    setScrollPosition(container, position, options.axis);
    return resolvedTask({ status: "completed", position });
  }

  let frame = 0;
  let settled = false;
  let resolveFinished!: (result: GoToResult) => void;
  const finished = new Promise<GoToResult>((resolve) => {
    resolveFinished = resolve;
  });
  const easing = resolveEasing(options.easing);
  const startedAt =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  const settle = (status: GoToStatus): void => {
    if (settled) return;
    settled = true;
    if (frame) cancelAnimationFrame(frame);
    if (activeTasks.get(container) === cancel) activeTasks.delete(container);
    resolveFinished({ status, position });
  };

  const cancel = (): void => settle("cancelled");

  const step = (timestamp: number): void => {
    if (settled) return;
    const progress = Math.min(1, Math.max(0, (timestamp - startedAt) / duration));
    const next = start + (position - start) * easing(progress);
    setScrollPosition(container, next, options.axis);
    if (progress >= 1) {
      setScrollPosition(container, position, options.axis);
      settle("completed");
      return;
    }
    frame = requestAnimationFrame(step);
  };

  activeTasks.set(container, cancel);
  frame = requestAnimationFrame(step);

  return { finished, cancel };
};
