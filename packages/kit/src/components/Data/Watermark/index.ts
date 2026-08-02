import {
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  onMounted,
  useEffect,
  useHost,
  useHostCssVar,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { WatermarkExpose, WatermarkFont, WatermarkProps, WatermarkSlots } from "./types";
import { createMutateController } from "../../../directives/observers";
import {
  acquireTargetPositionContext,
  type TargetPositionLease,
} from "../../Common/overlay/positioning-context";

export type { WatermarkExpose, WatermarkFont, WatermarkProps, WatermarkSlots } from "./types";

const props = defineProps<WatermarkProps>({
  content: { type: [String, Array], default: "" },
  image: { type: String, default: "" },
  width: { type: Number, default: 120 },
  height: { type: Number, default: 64 },
  rotate: { type: Number, default: -22 },
  zIndex: { type: Number, default: 9 },
  gapX: { type: Number, default: 100 },
  gapY: { type: Number, default: 100 },
  offsetX: { type: Number, default: undefined },
  offsetY: { type: Number, default: undefined },
  fontSize: { type: Number, default: 16 },
  fontColor: { type: String, default: "rgba(0,0,0,0.15)" },
  font: { type: Object, default: () => ({}) },
  appendTo: { type: null, default: null },
  antiTamper: { type: Boolean, default: false },
});

const host = useHost();
let overlay: HTMLElement | null = null;
let overlayTarget: HTMLElement | null = null;
let positionLease: TargetPositionLease | null = null;
let observerControllers: Array<ReturnType<typeof createMutateController>> = [];
let restorationQueued = false;
let restorationGeneration = 0;

const font = (): WatermarkFont => (props.font && typeof props.font === "object" ? props.font : {});
const fontSize = (): number => Math.max(1, Number(font().fontSize ?? props.fontSize) || 16);
const fontColor = (): string => String(font().color || props.fontColor || "rgba(0,0,0,0.15)");
const fontWeight = (): string => String(font().fontWeight ?? "normal");
const fontStyle = (): string => String(font().fontStyle ?? "normal");
const fontFamily = (): string => String(font().fontFamily ?? "sans-serif");

const textPosition = (): { x: string; anchor: "start" | "middle" | "end" } => {
  switch (font().textAlign) {
    case "left":
    case "start":
      return { x: "0", anchor: "start" };
    case "right":
    case "end":
      return { x: "100%", anchor: "end" };
    default:
      return { x: "50%", anchor: "middle" };
  }
};

const escapeXml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const contentLines = (): string[] => {
  const value = props.content;
  const lines = Array.isArray(value) ? value : [value];
  return lines.map((line) => String(line)).filter(Boolean);
};

const tileWidth = (): number => Math.max(24, Number(props.width) || 120);
const tileHeight = (): number => Math.max(24, Number(props.height) || 64);

const svgText = (): string => {
  const width = tileWidth();
  const height = tileHeight();
  const lines = contentLines();
  const lineHeight = Math.max(14, fontSize()) + 4;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  const position = textPosition();
  const body = props.image
    ? `<image href="${escapeXml(props.image)}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" />`
    : lines
        .map(
          (line, index) =>
            `<text x="${position.x}" y="${startY + index * lineHeight}" dominant-baseline="middle" text-anchor="${position.anchor}" font-size="${fontSize()}" font-weight="${escapeXml(fontWeight())}" font-style="${escapeXml(fontStyle())}" font-family="${escapeXml(fontFamily())}" fill="${escapeXml(fontColor())}">${escapeXml(line)}</text>`,
        )
        .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><g transform="rotate(${Number(props.rotate) || 0} ${width / 2} ${height / 2})">${body}</g></svg>`;
};

const backgroundImage = (): string => `url("data:image/svg+xml,${encodeURIComponent(svgText())}")`;
const backgroundSize = (): string =>
  `${tileWidth() + Number(props.gapX || 0)}px ${tileHeight() + Number(props.gapY || 0)}px`;
const backgroundPosition = (): string =>
  `${Number(props.offsetX ?? props.gapX / 2) || 0}px ${Number(props.offsetY ?? props.gapY / 2) || 0}px`;

const resolveAppendTarget = (): HTMLElement | null => {
  if (props.appendTo instanceof HTMLElement) return props.appendTo;
  if (typeof props.appendTo !== "string" || !props.appendTo.trim()) return null;
  const selector = props.appendTo.trim();
  const localRoot = host.getRootNode() as Document | ShadowRoot;
  return (
    localRoot.querySelector<HTMLElement>(selector) ?? document.querySelector<HTMLElement>(selector)
  );
};

const applyOverlayStyle = (element: HTMLElement): void => {
  element.className = "";
  element.removeAttribute("style");
  element.style.setProperty("--_watermark-image", backgroundImage());
  Object.assign(element.style, {
    position: "absolute",
    inset: "0px",
    zIndex: String(Number(props.zIndex) || 9),
    pointerEvents: "none",
    backgroundImage: "var(--_watermark-image)",
    backgroundPosition: backgroundPosition(),
    backgroundRepeat: "repeat",
    backgroundSize: backgroundSize(),
  });
};

const disconnectObserver = (): void => {
  for (const controller of observerControllers) controller.dispose();
  observerControllers = [];
};

const cleanupExternalOverlay = (): void => {
  disconnectObserver();
  overlay?.remove();
  positionLease?.();
  overlay = null;
  overlayTarget = null;
  positionLease = null;
};

/** Coalesces one native mutation delivery into one overlay reconciliation. */
const queueRestore = (): void => {
  if (restorationQueued) return;
  restorationQueued = true;
  const generation = restorationGeneration;
  queueMicrotask(() => {
    restorationQueued = false;
    if (generation !== restorationGeneration || !host.isConnected) return;
    syncExternalOverlay();
  });
};

const observeExternalOverlay = (): void => {
  disconnectObserver();
  if (!props.antiTamper || !overlayTarget) return;
  observerControllers.push(
    createMutateController(overlayTarget, {
      handler: queueRestore,
      observer: { childList: true },
    }),
  );
  if (overlay) {
    observerControllers.push(
      createMutateController(overlay, {
        handler: queueRestore,
        observer: { attributes: true, attributeFilter: ["style", "class"] },
      }),
    );
  }
};

const syncExternalOverlay = (): void => {
  disconnectObserver();
  if (!host.isConnected) {
    cleanupExternalOverlay();
    return;
  }
  const target = resolveAppendTarget();
  if (!target || target === host || host.contains(target)) {
    cleanupExternalOverlay();
    return;
  }
  if (target !== overlayTarget) cleanupExternalOverlay();
  overlayTarget = target;
  if (!positionLease) positionLease = acquireTargetPositionContext(target);
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.dataset.elfWatermarkOverlay = "";
    overlay.setAttribute("aria-hidden", "true");
  }
  applyOverlayStyle(overlay);
  if (overlay.parentElement !== target) target.appendChild(overlay);
  observeExternalOverlay();
};

useHostCssVar("--_watermark-bg", backgroundImage);
useHostCssVar(
  "--_watermark-size",
  () => `${tileWidth() + Number(props.gapX || 0)}px ${tileHeight() + Number(props.gapY || 0)}px`,
);
useHostCssVar("--_watermark-z", () => String(Number(props.zIndex) || 9));
useHostCssVar("--_watermark-offset-x", () => `${Number(props.offsetX ?? props.gapX / 2) || 0}px`);
useHostCssVar("--_watermark-offset-y", () => `${Number(props.offsetY ?? props.gapY / 2) || 0}px`);
useHostFlag("data-external", () => Boolean(resolveAppendTarget()));

useEffect(() => {
  void props.appendTo;
  void props.antiTamper;
  void backgroundImage();
  void backgroundSize();
  void backgroundPosition();
  if (host.isConnected) syncExternalOverlay();
});

onMounted(syncExternalOverlay);
onBeforeUnmount(() => {
  restorationGeneration += 1;
  restorationQueued = false;
  cleanupExternalOverlay();
});
defineExpose<WatermarkExpose>({ refresh: syncExternalOverlay });

defineStyle(styles);

const Watermark = defineHtml<WatermarkProps, Record<string, never>, WatermarkSlots>(`
  <div class="watermark" part="watermark">
    <div class="content" part="content">
      <slot></slot>
    </div>
  </div>
`);

export { Watermark };
