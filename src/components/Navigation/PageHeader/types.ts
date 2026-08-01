export type PageHeaderMode = "standard" | "hero";

export type PageHeaderVariant = "plain" | "card" | "banner";

export type PageHeaderAlign = "start" | "center";

export type PageHeaderTone = "default" | "primary" | "dark";

export interface PageHeaderProps {
  title: string;
  content: string;
  icon: string;
  mode: PageHeaderMode;
  variant: PageHeaderVariant;
  align: PageHeaderAlign;
  tone: PageHeaderTone;
  eyebrow: string;
  tag: string;
  description: string;
  version: string;
  image: string;
  imageAlt: string;
}

export interface PageHeaderEmits {
  back: [];
}

export interface PageHeaderSlots {
  icon?: () => unknown;
  title?: () => unknown;
  content?: () => unknown;
  extra?: () => unknown;
  breadcrumb?: () => unknown;
  eyebrow?: () => unknown;
  tag?: () => unknown;
  description?: () => unknown;
  meta?: () => unknown;
  visual?: () => unknown;
}
