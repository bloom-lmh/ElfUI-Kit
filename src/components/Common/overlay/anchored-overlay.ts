/** Placement values shared by components that position an anchored overlay. */
export type AnchoredPlacement =
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "top"
  | "top-start"
  | "top-end"
  | "left"
  | "right";

export interface OverlayRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface OverlayViewport {
  width: number;
  height: number;
  offsetLeft?: number;
  offsetTop?: number;
}

export const readOverlayViewport = (): OverlayViewport => {
  const viewport = window.visualViewport;
  return {
    width: viewport?.width || window.innerWidth,
    height: viewport?.height || window.innerHeight,
    offsetLeft: viewport?.offsetLeft || 0,
    offsetTop: viewport?.offsetTop || 0,
  };
};

export interface AnchoredPositionOptions<TPlacement extends AnchoredPlacement = AnchoredPlacement> {
  placement: TPlacement;
  offset?: readonly [crossAxis: number, mainAxis: number];
  padding?: number;
  flip?: boolean;
  fallbackPlacements?: readonly TPlacement[];
}

export interface AnchoredPosition<TPlacement extends AnchoredPlacement = AnchoredPlacement> {
  left: number;
  top: number;
  placement: TPlacement;
}

const oppositePlacement = (placement: AnchoredPlacement): AnchoredPlacement =>
  placement === "left"
    ? "right"
    : placement === "right"
      ? "left"
      : placement.startsWith("top")
        ? placement.replace("top", "bottom") as AnchoredPlacement
        : placement.replace("bottom", "top") as AnchoredPlacement;

const rawPosition = (
  anchor: OverlayRect,
  overlay: Pick<OverlayRect, "width" | "height">,
  placement: AnchoredPlacement,
  offset: readonly [number, number]
): Pick<AnchoredPosition, "left" | "top"> => {
  const [crossAxis, mainAxis] = offset;
  if (placement === "left" || placement === "right") {
    return {
      left: placement === "left"
        ? anchor.left - overlay.width - mainAxis
        : anchor.right + mainAxis,
      top: anchor.top + (anchor.height - overlay.height) / 2 + crossAxis
    };
  }
  const isTop = placement.startsWith("top");
  const isEnd = placement.endsWith("end");
  const isCenter = placement === "top" || placement === "bottom";
  const left = isEnd
    ? anchor.right - overlay.width
    : isCenter
      ? anchor.left + (anchor.width - overlay.width) / 2
      : anchor.left;
  return {
    left: left + crossAxis,
    top: isTop
      ? anchor.top - overlay.height - mainAxis
      : anchor.bottom + mainAxis
  };
};

const overflowScore = (
  position: Pick<AnchoredPosition, "left" | "top">,
  overlay: Pick<OverlayRect, "width" | "height">,
  viewport: OverlayViewport,
  padding: number
): number => {
  const minLeft = (viewport.offsetLeft || 0) + padding;
  const minTop = (viewport.offsetTop || 0) + padding;
  const maxRight = (viewport.offsetLeft || 0) + viewport.width - padding;
  const maxBottom = (viewport.offsetTop || 0) + viewport.height - padding;
  return Math.max(0, minLeft - position.left)
    + Math.max(0, minTop - position.top)
    + Math.max(0, position.left + overlay.width - maxRight)
    + Math.max(0, position.top + overlay.height - maxBottom);
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, Math.max(min, max)));

export const computeAnchoredPosition = <TPlacement extends AnchoredPlacement>(
  anchor: OverlayRect,
  overlay: Pick<OverlayRect, "width" | "height">,
  viewport: OverlayViewport,
  options: AnchoredPositionOptions<TPlacement>
): AnchoredPosition<TPlacement> => {
  const padding = Math.max(0, Number(options.padding) || 0);
  const offset = options.offset || [0, 6];
  const placements = (options.flip === false
    ? [options.placement]
    : Array.from(new Set([
        options.placement,
        ...(options.fallbackPlacements || []),
        oppositePlacement(options.placement)
      ]))) as TPlacement[];
  const candidates = placements.map((placement) => ({
    placement,
    position: rawPosition(anchor, overlay, placement, offset)
  }));
  const best = candidates.reduce((current, candidate) =>
    overflowScore(candidate.position, overlay, viewport, padding)
      < overflowScore(current.position, overlay, viewport, padding)
      ? candidate
      : current
  );
  const placement = best.placement;
  const position = best.position;
  const viewportLeft = viewport.offsetLeft || 0;
  const viewportTop = viewport.offsetTop || 0;

  return {
    left: clamp(position.left, viewportLeft + padding, viewportLeft + viewport.width - overlay.width - padding),
    top: clamp(position.top, viewportTop + padding, viewportTop + viewport.height - overlay.height - padding),
    placement
  };
};

export const isEventInside = (
  event: Event,
  containers: ArrayLike<Element | null | undefined>
): boolean => {
  const path = event.composedPath();
  return Array.from(containers).some((container) =>
    Boolean(
      container &&
      path.some((target) => target === container || (target instanceof Node && container.contains(target)))
    )
  );
};

export const listenForExternalOverlayMotion = (
  containers: () => ArrayLike<Element | null | undefined>,
  onExternalMotion: () => void
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const onMotion = (event: Event): void => {
    if (!isEventInside(event, containers())) onExternalMotion();
  };
  const options: AddEventListenerOptions = { capture: true, passive: true };

  window.addEventListener("scroll", onMotion, options);
  window.addEventListener("wheel", onMotion, options);
  window.addEventListener("touchmove", onMotion, options);
  window.visualViewport?.addEventListener("scroll", onMotion, { passive: true });

  return () => {
    window.removeEventListener("scroll", onMotion, { capture: true });
    window.removeEventListener("wheel", onMotion, { capture: true });
    window.removeEventListener("touchmove", onMotion, { capture: true });
    window.visualViewport?.removeEventListener("scroll", onMotion);
  };
};

export interface AnchoredOverlayLifecycleOptions {
  resizeTargets: ArrayLike<Element | null | undefined>;
  motionContainers: () => ArrayLike<Element | null | undefined>;
  onResize: () => void;
  onExternalMotion: () => void;
}

/**
 * Connects the shared browser resources for one active anchored overlay.
 * Components retain the policy decision to update or close on external motion.
 */
export const connectAnchoredOverlayLifecycle = (
  options: AnchoredOverlayLifecycleOptions
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const resizeTargets = Array.from(options.resizeTargets).filter(
    (target): target is Element => Boolean(target)
  );
  const observer = resizeTargets.length > 0 && typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(options.onResize)
    : undefined;
  resizeTargets.forEach((target) => observer?.observe(target));
  const cleanupMotion = listenForExternalOverlayMotion(
    options.motionContainers,
    options.onExternalMotion
  );

  window.addEventListener("resize", options.onResize, { passive: true });
  window.visualViewport?.addEventListener("resize", options.onResize, { passive: true });

  return () => {
    observer?.disconnect();
    cleanupMotion();
    window.removeEventListener("resize", options.onResize);
    window.visualViewport?.removeEventListener("resize", options.onResize);
  };
};
