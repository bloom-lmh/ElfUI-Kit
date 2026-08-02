import type { AvatarShape, AvatarSize } from "../Avatar/types";

export type AvatarGroupEffect = "light" | "dark";
export type AvatarGroupPlacement = "top" | "bottom";

export interface AvatarGroupProps {
  size: AvatarSize | "";
  shape: AvatarShape | "";
  collapseAvatars: boolean;
  collapseAvatarsTooltip: boolean;
  maxCollapseAvatars: number;
  effect: AvatarGroupEffect;
  placement: AvatarGroupPlacement;
  popperClass: string;
  popperStyle: Record<string, string | number>;
  collapseClass: string;
  collapseStyle: Record<string, string | number>;
}

export interface AvatarGroupSlots {
  default: unknown;
}
