export type ImageFit = "fill" | "contain" | "cover" | "none" | "scale-down";

export interface ImageProps {
  src: string;
  srcset: string;
  sizes: string;
  alt: string;
  fit: ImageFit;
  width: number | string;
  height: number | string;
  lazy: boolean;
  previewSrcList: string[];
  initialIndex: number;
  previewTeleported: boolean;
  zoomRate: number;
  toolbar: boolean;
}

export interface ImageEmits {
  load: [event: Event];
  error: [event: Event];
  "preview-open": [index: number];
  "preview-close": [index: number];
  "preview-change": [index: number];
}

export interface ImageSlots {
  error?: unknown;
  loading?: unknown;
}

export interface ImageExposes {
  openPreview(): void;
  closePreview(): void;
  retry(): void;
}
