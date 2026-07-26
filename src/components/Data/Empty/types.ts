export type EmptySize = "default" | "compact";

export interface EmptyProps {
  image: string;
  imageSize: number | string;
  description: string;
  size: EmptySize;
}

export interface EmptySlots {
  default?: unknown;
  image?: unknown;
  description?: unknown;
}
