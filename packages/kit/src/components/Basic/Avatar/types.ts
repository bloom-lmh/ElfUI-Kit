export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";
export type AvatarFit = "fill" | "contain" | "cover" | "none" | "scale-down";

export interface AvatarProps {
  size: AvatarSize;
  shape: AvatarShape;
  src: string;
  srcSet: string;
  alt: string;
  fit: AvatarFit;
  icon: string;
  color: string;
}

export type AvatarEmits = {
  error: [event: Event];
};
