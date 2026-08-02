export type ResultIcon = "success" | "warning" | "info" | "error";

export interface ResultProps {
  icon: ResultIcon;
  title: string;
  subTitle: string;
}

export interface ResultSlots {
  icon?: unknown;
  title?: unknown;
  "sub-title"?: unknown;
  extra?: unknown;
}
