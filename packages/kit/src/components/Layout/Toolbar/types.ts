export type ToolbarDensity = "default" | "comfortable" | "compact" | "prominent";
export type ToolbarCollapsePosition = "start" | "end";
export type ToolbarLocation =
  | "top"
  | "bottom"
  | "start"
  | "end"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "center";

export interface ToolbarProps {
  title: string;
  ariaLabel: string;
  density: ToolbarDensity;
  image: string;
  imageAlt: string;
  imagePosition: string;
  imageOpacity: number;
  color: string;
  elevation: number;
  height: string | number;
  extensionHeight: string | number;
  extended: boolean | null;
  flat: boolean;
  border: boolean;
  rounded: boolean;
  collapsed: boolean;
  collapsePosition: ToolbarCollapsePosition;
  collapseWidth: string | number;
  floating: boolean;
  absolute: boolean;
  fixed: boolean;
  location: ToolbarLocation;
}

export interface ToolbarSlots {
  prepend?: unknown;
  title?: unknown;
  default?: unknown;
  append?: unknown;
  extension?: unknown;
  background?: unknown;
}
